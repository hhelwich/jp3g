import * as fs from 'fs'
import { promisify } from 'util'
import { range } from '../util'
import { HuffmanTree, zigZag, SOS, DHT } from '../jpeg'
import jpegLotti8Struct from './images/lotti-8-4:4:4-90.struct'
import jpegLotti8Coeff from './images/lotti-8-4:4:4-90.qcoeff'

const readFile = promisify(fs.readFile)

describe('decode scan', () => {
  describe('extend', () => {
    it('extends to expected DC difference', () => {
      const diff = extend(0b0110110, 7)
      expect(diff).toBe(-73)
    })
    it('returns expected min and max values', () => {
      range(12).forEach(magnitude => {
        const ones = 2 ** magnitude - 1
        expect(extend(0, magnitude) === -ones).toBe(true)
        expect(extend(ones, magnitude)).toBe(ones)
      })
    })
  })
  describe('nextBit', () => {
    it('returns data bits', () => {
      const { nextBit } = decodeFns(
        new Uint8Array([0b11001101, 0b10111000, 0b11101100, 0b01001011])
      )
      let bits = ''
      for (let i = 0; i < 32; i += 1) {
        bits += nextBit()
      }
      expect(bits).toBe('11001101101110001110110001001011')
    })
    it('reads ff00 as ff', () => {
      const { nextBit } = decodeFns(
        new Uint8Array([0b11001101, 0xff, 0, 0b11101100])
      )
      let bits = ''
      for (let i = 0; i < 24; i += 1) {
        bits += nextBit()
      }
      expect(bits).toBe('110011011111111111101100')
    })
    it('throws for non zero value following ff', () => {
      const { nextBit } = decodeFns(
        new Uint8Array([0b11001101, 0xff, 1, 0b11101100])
      )
      expect(() => {
        for (let i = 0; i < 24; i += 1) {
          nextBit()
        }
      }).toThrow('Unexpected marker in compressed data')
    })
    it('returns 0 if reading over end', () => {
      const { nextBit } = decodeFns(new Uint8Array([0b11001101]))
      let bits = ''
      for (let i = 0; i < 16; i += 1) {
        bits += nextBit()
      }
      expect(bits).toBe('1100110100000000')
    })
  })
  describe('testimage', () => {
    it('foo', async () => {
      const scan = (<SOS>jpegLotti8Struct[9]).data
      const ht00 = (<DHT>jpegLotti8Struct[5]).tables[0].tree
      const ht01 = (<DHT>jpegLotti8Struct[6]).tables[0].tree
      const ht10 = (<DHT>jpegLotti8Struct[7]).tables[0].tree
      const ht11 = (<DHT>jpegLotti8Struct[8]).tables[0].tree
      const { getCoeff } = decodeFns(scan)
      expect(getCoeff(ht00, ht01)).toEqual(jpegLotti8Coeff[0])
      expect(getCoeff(ht10, ht11)).toEqual(jpegLotti8Coeff[1])
      expect(getCoeff(ht10, ht11)).toEqual(jpegLotti8Coeff[2])
    })
  })
})
// [Bitmap] <-> Sampling <-> DCT <-> Quantization <-> Huffman Coding <-> [JPEG]

// 4:4:4 (1x1,1x1,1x1) => Data unit 8x8 pixels
// 4:2:2 (2x1,1x1,1x1) => Data unit 8x16 (Y), 16x16 (Cb, Cr) pixels
// 4:2:0 (2x2,1x1,1x1) => Data unit 8x8 (Y), 16x16 (Cb, Cr) pixels

const decodeFns = (data: Uint8Array) => {
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
const extend = (v: number, t: number) => {
  const v_t = 1 << (t - 1) // 2^(t-1)
  if (v < v_t) {
    return v + (-1 << t) + 1
  } else {
    return v
  }
}
