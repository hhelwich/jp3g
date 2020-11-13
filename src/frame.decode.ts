import {
  DQT_TABLE,
  HuffmanTree,
  Jpeg,
  Segment,
  SegmentForType,
  SOF,
  zigZag,
} from './jpeg'
import { InvalidJpegError } from './InvalidJpegError'
import { dequantize } from './quantization.decode'
import { idct } from './dctOptimized.decode'
import { decenter } from './dctCenter.decode'
import { yCbCr2Rgb } from './colorRgb.decode'

export const prepareScanDecode = (sof: SOF) => {
  const maxH = Math.max(...sof.components.map(component => component.h))
  const maxV = Math.max(...sof.components.map(component => component.v))
  const mcusPerLine = Math.ceil(sof.width / 8 / maxH)
  const mcusPerColumn = Math.ceil(sof.height / 8 / maxV)
  const components = sof.components.map(({ id, h, v, qId }) => {
    const blocksPerLine = Math.ceil((Math.ceil(sof.width / 8) * h) / maxH)
    const blocksPerColumn = Math.ceil((Math.ceil(sof.height / 8) * v) / maxV)
    const blocksPerLineForMcu = mcusPerLine * h
    const blocksPerColumnForMcu = mcusPerColumn * v
    const blocksBufferSize =
      64 * blocksPerColumnForMcu * (blocksPerLineForMcu + 1)
    return {
      id,
      h,
      v,
      qId,
      blocksBufferSize,
      blocksPerLine,
      blocksPerColumn,
    }
  })
  return {
    maxH,
    maxV,
    mcusPerLine,
    mcusPerColumn,
    components,
  }
}

export const decodeFrame = (
  jpeg: Jpeg
): { data: Uint8ClampedArray; width: number; height: number } => {
  const huffmanTables: [HuffmanTree[], HuffmanTree[]] = [[], []]
  const quantizationTables: DQT_TABLE[] = []
  let frameComponents: SOF['components'] = []
  let data: { data: Uint8ClampedArray; width: number; height: number } = {
    data: new Uint8ClampedArray(),
    width: 0,
    height: 0,
  }
  let yCbCr: number[][] = [] // TODO remove
  segmentLoop: for (const segment of jpeg) {
    switch (segment.type) {
      case 'DHT':
        for (const table of segment.tables) {
          huffmanTables[table.cls][table.id] = table.tree
        }
        break
      case 'DQT':
        for (const table of segment.tables) {
          quantizationTables[table.id] = table
        }
        break
      case 'SOF':
        if (
          segment.frameType < 0 ||
          segment.frameType > 1 ||
          segment.precision !== 8
        ) {
          // Only sequential DCT frames with 8-bit samples are supported
          throw new Error('Not 8-bit sequential')
        }
        const interleaved = segment.components.length > 1
        if (segment.components.length === 0) {
          throw new InvalidJpegError('No components found')
        }
        if (!interleaved) {
          // Support only interleaved scans at the moment
          throw new Error('Not interleaved')
        }
        // Get maximum of all component horizontal/vertical sampling frequencies
        const hMax = Math.max(
          ...segment.components.map(component => component.h)
        )
        const vMax = Math.max(
          ...segment.components.map(component => component.v)
        )
        frameComponents = []
        for (const component of segment.components) {
          frameComponents[component.id] = component
        }
        // Get the data unit size in pixels for each component
        const dataUnitSizes = segment.components.map(({ h, v }) => ({
          x: (8 * hMax) / h,
          y: (8 * vMax) / v,
        }))
        // data unit: An 8 × 8 block of samples of one component
        // horizontal sampling factor: The relative number of horizontal data units of a particular component with respect
        //   to the number of horizontal data units in the other components.
        // vertical sampling factor: The relative number of vertical data units of a particular component with respect to
        //   the number of vertical data units in the other components in the frame.
        // minimum coded unit; MCU: The smallest group of data units that is coded.
        const mcuSizes = {
          //the MCU contains one or more data units from each component
          x: (segment.width + 8 * hMax - 1) / (8 * hMax),
          y: (segment.height + 8 * hMax - 1) / (8 * hMax),
        }
        data = {
          data: new Uint8ClampedArray(segment.width * segment.height * 4),
          width: segment.width,
          height: segment.height,
        }
        break
      case 'SOS':
        const [huffmanTablesDC, huffmanTablesAC] = huffmanTables
        const { getCoeff } = decodeFns(segment.data)
        for (const component of segment.components) {
          const { v, h, qId } = frameComponents[component.id]
          const quantizationTable = quantizationTables[qId]
          for (let i = 0; i < v; i += 1) {
            for (let j = 0; j < h; j += 1) {
              //
              const qcoeff = getCoeff(
                huffmanTablesDC[component.dcTbl],
                huffmanTablesAC[component.acTbl]
              )
              //
              const coeff: number[] = []
              dequantize(quantizationTable.values, qcoeff, coeff)
              //
              const values = idct(coeff)
              // Decenter
              const dvalues = decenter(values)
              //
              yCbCr[component.id - 1] = dvalues
            }
          }
        }
        for (let i = 0; i < 64; i += 1) {
          const [r, g, b] = yCbCr2Rgb([yCbCr[0][i], yCbCr[1][i], yCbCr[2][i]])
          data.data[i * 4 + 0] = r
          data.data[i * 4 + 1] = g
          data.data[i * 4 + 2] = b
          data.data[i * 4 + 3] = 255
        }

        break
      case 'EOI':
        break segmentLoop
    }
  }
  return data
}

const getSegmentsOfType = <T extends Segment['type']>(jpeg: Jpeg, type: T) =>
  jpeg.filter(segment => segment.type === type) as SegmentForType<T>[]

// [Bitmap] <-> Sampling <-> DCT <-> Quantization <-> Huffman Coding <-> [JPEG]

// 4:4:4 (1x1,1x1,1x1) => Data unit 8x8 pixels
// 4:2:2 (2x1,1x1,1x1) => Data unit 8x16 (Y), 16x16 (Cb, Cr) pixels
// 4:2:0 (2x2,1x1,1x1) => Data unit 8x8 (Y), 16x16 (Cb, Cr) pixels

export const decodeFns = (data: Uint8Array) => {
  // The Position of the next byte in the data
  let offset = 0
  // The current data byte
  let currentByte: number
  // Position of the next bit in the current byte
  let byteOffset = -1
  const nextBit = (): number => {
    // If current byte is read => get next byte
    if (byteOffset < 0) {
      currentByte = data[offset++]
      byteOffset = 7
      // The value ff (rarely occurs) is coded as ff00 to make searching for
      // markers easy. So the next 0-byte is ignored in this case.
      if (currentByte === 0xff && data[offset++] !== 0) {
        throw Error('Unexpected marker in compressed data')
      }
    }
    // Return current bit
    return (currentByte >> byteOffset--) & 1
  }
  /**
   * Receive function from JPEG spec.
   */
  const nextBits = (length: number): number => {
    let v = 0
    for (let i = 0; i < length; i += 1) {
      v = (v << 1) + nextBit()
    }
    return v
  }
  const nextHuffmanByte = (tree: HuffmanTree): number => {
    let node: HuffmanTree | number | undefined
    while (true) {
      node = tree[nextBit()]
      if (typeof node === 'number') {
        return node
      }
      if (node == null) {
        throw Error('Unexpected huffman code')
      }
      tree = node
    }
  }
  const nextDcDiff = (huffmanTreeDC: HuffmanTree) => {
    const magnitude = nextHuffmanByte(huffmanTreeDC)
    const additionalBits = nextBits(magnitude)
    return extend(additionalBits, magnitude)
  }
  let lastDc = 0
  const nextDc = (huffmanTreeDC: HuffmanTree) => {
    return (lastDc += nextDcDiff(huffmanTreeDC))
  }
  const getCoeff = (huffmanTreeDC: HuffmanTree, huffmanTreeAC: HuffmanTree) => {
    lastDc = 0 // TODO remove
    const coefficients: number[] = []
    coefficients[0] = nextDc(huffmanTreeDC)
    for (let i = 1; i < 64; i += 1) {
      coefficients[i] = 0
    }
    for (let i = 1; i < 64; ) {
      const value = nextHuffmanByte(huffmanTreeAC)
      // The low nibble contains the number of bits to be read, which determines
      // the magnitude of the coefficient.
      const loBits = value & 0xf
      // The high nibble contains the number of zero coefficients before this
      // coefficients.
      const hiBits = (value & 0xf0) >> 4 // ? value >> 4
      if (loBits !== 0) {
        const extraBits = nextBits(loBits)
        i += hiBits
        coefficients[zigZag[i]] = extend(extraBits, loBits)
        i += 1
      } else {
        if (hiBits === 0xf) {
          i += 16 // Run of 16 Zeros
        } else if (hiBits === 0) {
          i = 64 // All Done
        }
      }
    }
    return coefficients
  }
  return {
    nextBit,
    nextHuffmanByte,
    nextDcDiff,
    nextDc,
    getCoeff,
  }
}

/**
 * This function is taken from the JPEG specification. It is used to decode DC
 * coefficients. DC coefficients are coded as differences to the previous DC
 * value (as these are usually smaller). This difference is then coded in two
 * parts: First a huffman-coded byte that defines the magnitude of the DC
 * difference by number of following bits. This function calculates the DC
 * coefficient difference from these two values.
 *
 * E.g. coded: 1100 1101 1011 ...
 * First three bits 110 are e.g. huffman encoded magnitude t=7. Next 7 bits are
 * v=0110110=52. Encoded DC coefficient difference = extend(52, 7) = -73
 *
 * @param v Bits encoded after huffman encoded magnitude.
 * @param t Magnitude of the DC coefficient and also the number of encoded bits
 * in the previous parameter.
 */
export const extend = (v: number, t: number) => {
  const v_t = 1 << (t - 1) // 2^(t-1)
  if (v < v_t) {
    return v + (-1 << t) + 1
  } else {
    return v
  }
}
