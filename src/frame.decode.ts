import {
  DHT,
  DQT,
  DQT_TABLE,
  EOI,
  HuffmanTree,
  Jpeg,
  SOF,
  SOS,
  zigZag,
} from './jpeg'
import { dequantize } from './quantization.decode'
import { idct } from './dctOptimized.decode'
import { decenter } from './dctCenter.decode'
import { zeros } from './util'

const { min, max, ceil } = Math

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

const createImageData = (width: number, height: number): ImageData => ({
  data: new Uint8ClampedArray(width * height * 4),
  width,
  height,
})

export const decodeFrame = (jpeg: Jpeg): ImageData => {
  const huffmanTables: [HuffmanTree[], HuffmanTree[]] = [[], []]
  const quantizationTables: DQT_TABLE[] = []
  let frame:
    | {
        components: SOF['components']
        imageData: ImageData
      }
    | undefined
  segmentLoop: for (const segment of jpeg) {
    switch (segment.type) {
      case DHT:
        for (const table of segment.tables) {
          huffmanTables[table.cls][table.id] = table.tree
        }
        break
      case DQT:
        for (const table of segment.tables) {
          quantizationTables[table.id] = table
        }
        break
      case SOF: {
        if (
          segment.frameType < 0 ||
          segment.frameType > 1 ||
          segment.precision !== 8
        ) {
          // Only sequential DCT frames with 8-bit samples are supported
          throw Error('Not 8-bit sequential')
        }
        const frameComponents: SOF['components'] = []
        for (const component of segment.components) {
          frameComponents[component.id] = component
        }
        frame = {
          components: frameComponents,
          imageData: createImageData(segment.width, segment.height),
        }
        break
      }
      case SOS: {
        if (!frame) {
          throw Error('Missing frame')
        }
        const {
          components: frameComponents,
          imageData: { width, height, data },
        } = frame
        const { components } = segment
        const interleaved = components.length > 1
        if (!interleaved) {
          // Support only interleaved scans at the moment
          throw Error('Not interleaved')
        }
        let minH = 5
        let maxH = 0
        let minV = 5
        let maxV = 0
        let mcuDataUnitCount = 0
        for (const component of components) {
          const { h, v } = frameComponents[component.id]
          if (h < 1 || h > 4 || v < 1 || v > 4) {
            throw Error('Invalid sampling factor')
          }
          minH = min(minH, h)
          maxH = max(maxH, h)
          minV = min(minV, v)
          maxV = max(maxV, v)
          mcuDataUnitCount += h * v
        }
        // Size of the MCU in pixels
        const mcuWidth = 8 * maxH
        const mcuHeight = 8 * maxV
        // Number of MCU columns/rows
        const mcuColumns = ceil(width / mcuWidth)
        const mcuRows = ceil(height / mcuHeight)
        //
        const [huffmanTablesDC, huffmanTablesAC] = huffmanTables
        const decodeCoeff = createDecodeCoeff(segment.data)
        const componentCount = components.length
        const lastDcs = zeros(componentCount)
        // Create buffer to hold the data units for each MCU row
        const yCbCr = new Float64Array(mcuColumns * mcuDataUnitCount * 64)

        const yCbCr2Rgb = nextYCbCr2Rgb(
          yCbCr,
          createMapIndices(
            width,
            mcuColumns,
            mcuHeight,
            components.map(({ id }) => frameComponents[id]),
            maxH,
            maxV
          ),
          data
        )
        for (let mcuRow = 0; mcuRow < mcuRows; mcuRow += 1) {
          let yCbCrOffset = 0
          for (let mcuColumn = 0; mcuColumn < mcuColumns; mcuColumn += 1) {
            for (let k = 0; k < componentCount; k += 1) {
              const component = components[k]
              const { h, v, qId } = frameComponents[component.id]
              const quantizationTable = quantizationTables[qId]
              for (let i = 0; i < v; i += 1) {
                for (let j = 0; j < h; j += 1) {
                  // Decode data unit
                  //
                  const qcoeff = decodeCoeff(
                    lastDcs[k],
                    huffmanTablesDC[component.dcId],
                    huffmanTablesAC[component.acId]
                  )
                  lastDcs[k] = qcoeff[0]
                  //
                  const coeff: number[] = []
                  dequantize(quantizationTable.values, qcoeff, coeff)
                  //
                  const values = idct(coeff)
                  // Decenter
                  const dvalues = decenter(values)
                  //
                  yCbCr.set(dvalues, yCbCrOffset)
                  yCbCrOffset += 64
                }
              }
            }
          }
          yCbCr2Rgb()
        }
        break
      }
      case EOI:
        break segmentLoop // TODO remove label?
    }
  }
  if (!frame) {
    throw Error('Missing frame')
  }
  return frame.imageData
}

const createMapIndices = (
  width: number,
  mcuColumns: number,
  mcuHeight: number,
  componentInfo: { h: number; v: number }[],
  maxH: number,
  maxV: number
) => {
  const mapIndices = new Uint32Array(3 * width * mcuHeight)
  let y = 0
  const componentCount = componentInfo.length
  for (let mcuColumn = 0; mcuColumn < mcuColumns; mcuColumn += 1) {
    for (let k = 0; k < componentCount; k += 1) {
      const { h, v } = componentInfo[k]
      const hh = maxH / h
      const vv = maxV / v
      for (let i = 0; i < v; i += 1) {
        for (let j = 0; j < h; j += 1) {
          for (let zy = 0; zy < 8; zy += 1) {
            for (let zx = 0; zx < 8; zx += 1) {
              for (let g = 0; g < vv; g += 1) {
                for (let f = 0; f < hh; f += 1) {
                  mapIndices[
                    (mcuColumn * 8 +
                      i * 64 * maxH * vv +
                      j * 8 * hh +
                      zy * 8 * hh * vv * h * mcuColumns +
                      zx * hh +
                      g * 8 * hh * h +
                      f) *
                      3 +
                      k
                  ] = y
                }
              }
              y += 1
            }
          }
        }
      }
    }
  }
  return mapIndices
}

// TODO: Extract to module
const nextYCbCr2Rgb = (
  source: Float64Array,
  mapIndices: Uint32Array,
  target: Uint8ClampedArray
) => {
  const length = mapIndices.length // width * height * 3
  let offset = 0
  let Y: number
  let Cb: number
  let Cr: number
  return () => {
    for (let i = 0; i < length; ) {
      Y = source[mapIndices[i++]]
      Cb = source[mapIndices[i++]]
      Cr = source[mapIndices[i++]]
      target[offset++] = Y + 1.402 * Cr - 179.456
      target[offset++] = Y - 0.34414 * Cb - 0.71414 * Cr + 135.45984
      target[offset++] = Y + 1.772 * Cb - 226.816
      target[offset++] = 255
    }
  }
}

// [Bitmap] <-> Sampling <-> DCT <-> Quantization <-> Huffman Coding <-> [JPEG]

// 4:4:4 (1x1,1x1,1x1) => Data unit 8x8 pixels
// 4:2:2 (2x1,1x1,1x1) => Data unit 8x16 (Y), 16x16 (Cb, Cr) pixels
// 4:2:0 (2x2,1x1,1x1) => Data unit 8x8 (Y), 16x16 (Cb, Cr) pixels

export const createNextBit = (data: Uint8Array) => {
  // The Position of the next byte in the data
  let offset = 0
  // The current data byte
  let currentByte: number
  // Position of the next bit in the current byte
  let byteOffset = -1
  return () => {
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
}

export const createDecodeCoeff = (data: Uint8Array) => {
  const nextBit = createNextBit(data)

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
  return (
    lastDc: number,
    huffmanTreeDC: HuffmanTree,
    huffmanTreeAC: HuffmanTree
  ) => {
    const coefficients: number[] = []
    coefficients[0] = lastDc + nextDcDiff(huffmanTreeDC)
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
