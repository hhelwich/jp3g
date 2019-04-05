import fs from 'fs'
import { decode, getDiff } from './decode'
import { encode } from './encode'
import { InvalidJpegError } from './InvalidJpegError'
import jpeg8x8Expected from '../images/8x8'

const jpeg8x8 = fs.readFileSync('images/8x8.jpg')
const jpegFillBytes = fs.readFileSync('images/8x8-fill-bytes.jpg')
const jpegDataAfterEOI = fs.readFileSync('images/8x8-data-after-eoi.jpg')
const jpegFillBytesBeforeSOI = fs.readFileSync(
  'images/invalid/8x8-fill-bytes-before-soi.jpg'
)

describe('getDiff', () => {
  it('returns correct result up to bit length 31', () => {
    expect(getDiff(0, 0)).toBe(0)
    for (let i = 1; i <= 31; i += 1) {
      const maxValue = 2 ** i - 1
      const flipValue = 2 ** (i - 1)
      expect(getDiff(0, i)).toBe(-maxValue)
      expect(getDiff(flipValue - 1, i)).toBe(-flipValue)
      expect(getDiff(flipValue, i)).toBe(flipValue)
      expect(getDiff(maxValue, i)).toBe(maxValue)
    }
  })
})

describe('decode', () => {
  it('returns correct JPEG structure', () => {
    expect(decode(jpeg8x8)).toEqual(jpeg8x8Expected)
  })
  it('can be reencoded to same buffer', () => {
    expect(encode(decode(jpeg8x8))).toEqual(jpeg8x8)
  })
  it('throws for fill bytes before SOI marker', () => {
    expect(() => {
      decode(jpegFillBytesBeforeSOI)
    }).toThrowError(InvalidJpegError)
  })
  it('ignores fill bytes before markers', () => {
    expect(decode(jpegFillBytes)).toEqual(decode(jpeg8x8))
  })
  it('removes fill bytes if reencoded', () => {
    const reencoded = encode(decode(jpegFillBytes))
    expect(reencoded).not.toEqual(jpegFillBytes)
    expect(reencoded).toEqual(jpeg8x8)
  })
  it('ignores content after EOI marker', () => {
    expect(decode(jpegDataAfterEOI)).toEqual(decode(jpeg8x8))
  })
  it('removes content after EOI marker if reencoded', () => {
    const reencoded = encode(decode(jpegDataAfterEOI))
    expect(reencoded).not.toEqual(jpegDataAfterEOI)
    expect(reencoded).toEqual(jpeg8x8)
  })
})
