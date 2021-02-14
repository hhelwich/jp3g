import { range } from './util/testUtil'
import { SOS, HuffmanTree } from '../jpeg'
import { extend, createDecodeQCoeffs, createNextBit } from '../frame.decode'
import jpeg from './images/8x8'

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
      const [nextBit] = createNextBit(
        new Uint8Array([0b11001101, 0b10111000, 0b11101100, 0b01001011])
      )
      let bits = ''
      for (let i = 0; i < 32; i += 1) {
        bits += nextBit()
      }
      expect(bits).toBe('11001101101110001110110001001011')
    })
    it('reads ff00 as ff', () => {
      const [nextBit] = createNextBit(
        new Uint8Array([0b11001101, 0xff, 0, 0b11101100])
      )
      let bits = ''
      for (let i = 0; i < 24; i += 1) {
        bits += nextBit()
      }
      expect(bits).toBe('110011011111111111101100')
    })
    it('throws for non zero value following ff', () => {
      const [nextBit] = createNextBit(
        new Uint8Array([0b11001101, 0xff, 1, 0b11101100])
      )
      expect(() => {
        for (let i = 0; i < 24; i += 1) {
          nextBit()
        }
      }).toThrow('Unsupported marker in compressed data')
    })
    it('returns 0 if reading over end', () => {
      const [nextBit] = createNextBit(new Uint8Array([0b11001101]))
      let bits = ''
      for (let i = 0; i < 16; i += 1) {
        bits += nextBit()
      }
      expect(bits).toBe('1100110100000000')
    })
  })
  describe('testimage', () => {
    it('foo', () => {
      const scan = (jpeg.filter(({ type }) => type === 'SOS') as SOS[])[0].data
      const ht = jpeg.reduce((tables, segment) => {
        if (segment.type === 'DHT') {
          for (const { cls, id, tree } of segment.tables) {
            ;(tables[id] ?? (tables[id] = []))[cls] = tree
          }
        }
        return tables
      }, [] as HuffmanTree[][])
      const qCoeffs = new Int16Array(64)
      const [decodeCoeff] = createDecodeQCoeffs(scan, qCoeffs)
      decodeCoeff(0, ht[0][0], ht[0][1])
      // prettier-ignore
      expect([...qCoeffs]).toEqual([
         -35, -67, -35,  28,   4,  -5,   2,  -3,
          88, -81, -13,   1,   4,   1,  -3,   1,
         -13,  42, -20, -17,   2,   3,  -1,   3,
          49,   1, -32,   0,   0,  -1,   3,  -2,
           4,  -4,   2,   0,  -2,   1,  -1,   0,
         -11,   2,   5,  -1,  -1,   0,  -1,   1,
           2,  -2,  -1,   3,  -1,  -1,   0,  -1,
          -5,   1,   3,  -1,   0,   1,  -1,   0,
      ])
      decodeCoeff(0, ht[1][0], ht[1][1])
      // prettier-ignore
      expect([...qCoeffs]).toEqual([
          35,  -3,  17,  -3,   0,   1,  -1,   0,
        -137,  23,  10,   0,   0,   0,   1,   0,
          -5,   2,   0,   1,   0,  -1,   1,   0,
          -5,   0,   2,   0,   0,   0,  -2,   1,
           0,  -1,   0,   1,   0,   0,   0,   0,
           1,   0,  -1,   0,  -1,   0,   1,   0,
          -1,   1,   0,  -1,   0,   0,   0,   1,
           3,   0,  -3,   1,   1,   0,   0,   0,
        ]
      )
      decodeCoeff(0, ht[1][0], ht[1][1])
      // prettier-ignore
      expect([...qCoeffs]).toEqual([
          45, 145,  -2,   5,   0,  -1,  -1,  -3,
         -25,  29,   0,   0,   1,   0,   0,   0,
          17, -10,  -1,  -2,   0,   1,   0,   3,
           3,   0,  -1,   0,  -1,   0,   1,   1,
           0,   0,   0,   0,   0,   1,   0,  -1,
           0,   0,   1,   0,   0,   0,   0,   0,
          -1,  -1,   1,   2,   0,  -1,   0,   0,
           0,   0,   0,   1,   1,   0,  -1,   0,
        ]
      )
    })
  })
})
