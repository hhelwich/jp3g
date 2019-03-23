import * as fs from 'fs'
import { decode } from './decode'
import { encode } from './encode'
import { InvalidJpegError } from './InvalidJpegError'

const jpeg = fs.readFileSync('images/8x8.jpg')
const jpegFillBytes = fs.readFileSync('images/8x8-fill-bytes.jpg')
const jpegDataAfterEOI = fs.readFileSync('images/8x8-data-after-eoi.jpg')
const jpegFillBytesBeforeSOI = fs.readFileSync(
  'images/8x8-fill-bytes-before-soi.jpg'
)

describe('decode', () => {
  it('returns correct JPEG structure', () => {
    expect(decode(jpeg).struct).toEqual([
      { type: 0xd8 },
      { type: 0xe0, data: 0 },
      { type: 0xfe, data: 1 },
      { type: 0xdb, data: 2 },
      { type: 0xdb, data: 3 },
      { type: 0xc0, data: 4 },
      { type: 0xc4, data: 5 },
      { type: 0xc4, data: 6 },
      { type: 0xc4, data: 7 },
      { type: 0xc4, data: 8 },
      { type: 0xda, data: 9 },
      { type: 0xd9 },
    ])
  })
  it('can be reencoded to same buffer', () => {
    expect(encode(decode(jpeg))).toEqual(jpeg)
  })
  it('throws for fill bytes before SOI marker', () => {
    expect(() => {
      decode(jpegFillBytesBeforeSOI)
    }).toThrowError(InvalidJpegError)
  })
  it('ignores fill bytes before markers', () => {
    expect(decode(jpegFillBytes)).toEqual(decode(jpeg))
  })
  it('removes fill bytes if reencoded', () => {
    const reencoded = encode(decode(jpegFillBytes))
    expect(reencoded).not.toEqual(jpegFillBytes)
    expect(reencoded).toEqual(jpeg)
  })
  it('ignores content after EOI marker', () => {
    expect(decode(jpegDataAfterEOI)).toEqual(decode(jpeg))
  })
  it('removes content after EOI marker if reencoded', () => {
    const reencoded = encode(decode(jpegDataAfterEOI))
    expect(reencoded).not.toEqual(jpegDataAfterEOI)
    expect(reencoded).toEqual(jpeg)
  })
})
