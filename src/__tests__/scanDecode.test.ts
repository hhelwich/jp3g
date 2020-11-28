import * as fs from 'fs'
import { promisify } from 'util'
import { range } from '../util'
import { SOS, DHT } from '../jpeg'
import { extend, decodeFns } from '../frame.decode'
import jpegLotti8Struct from './images/lotti-8-4:4:4-90'
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
      expect(getCoeff(0, ht00, ht01)).toEqual(jpegLotti8Coeff[0])
      expect(getCoeff(0, ht10, ht11)).toEqual(jpegLotti8Coeff[1])
      expect(getCoeff(0, ht10, ht11)).toEqual(jpegLotti8Coeff[2])
    })
  })
})
