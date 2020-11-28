import { decodeJpeg, getDiff } from '../jpeg.decode'
import { encodeJpeg } from '../jpeg.encode'
import { InvalidJpegError } from '../InvalidJpegError'
import jpegSmallExpected from '../../images/small'
import jpegSmallGuetzliExpected from '../../images/small-guetzli'
import { readImageFile } from './util/testUtil'
import jpegLotti8 from './images/lotti-8-4:4:4-90'

/*
const jpeg8x8 = readImageFile('8x8')
const jpegFillBytes = readImageFile('8x8-fill-bytes')
const jpegDataAfterEOI = readImageFile('8x8-data-after-eoi')
const jpegFillBytesBeforeSOI = readImageFile(
  'invalid/8x8-fill-bytes-before-soi'
)
const smallDataAfterDqt = readImageFile('invalid/small-data-after-dqt')
const smallDataAfterSof = readImageFile('invalid/small-data-after-sof')
const smallDataAfterDht = readImageFile('invalid/small-data-after-dht')
const jpegSmall = readImageFile('small')
const jpegSmallGuetzli = readImageFile('small-guetzli')
*/
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
/*
describe('decode', () => {
  it('returns correct JPEG structure', () => {
    expect(decode(jpegSmall)).toEqual(jpegSmallExpected)
  })
  it('can be reencoded to same buffer', () => {
    expect(encode(decode(jpegSmall))).toEqual(jpegSmall)
  })
  it('returns correct JPEG structure for multiple tables in DQT and DHT', () => {
    expect(decode(jpegSmallGuetzli)).toEqual(jpegSmallGuetzliExpected)
  })
  it('can reencoded multiple tables in DQT and DHT to the same buffer', () => {
    expect(encode(decode(jpegSmallGuetzli))).toEqual(jpegSmallGuetzli)
  })
  it('throws for fill bytes before SOI marker', () => {
    expect(() => {
      decode(jpegFillBytesBeforeSOI)
    }).toThrowError(InvalidJpegError)
  })
  it('throws for fill bytes after DQT segment', () => {
    expect(() => {
      decode(smallDataAfterDqt)
    }).toThrowError(InvalidJpegError)
  })
  it('throws for fill bytes after SOF segment', () => {
    expect(() => {
      decode(smallDataAfterSof)
    }).toThrowError(InvalidJpegError)
  })
  it('throws for fill bytes after DHT segment', () => {
    expect(() => {
      decode(smallDataAfterDht)
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
describe('8x8 test', () => {
  it('returns correct JPEG structure', () => {
    expect(decode(readImageFile('lotti-8-4:4:4-90'))).toEqual(jpegLotti8)
  })
})
*/
