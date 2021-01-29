import { decodeAPP } from '../app.decode'
import { encodeJFIF, getJfifLength } from '../app.encode'
import { JFIF, JFIFUnits } from '../jpeg'

const jfifWithoutThumbnailData = new Uint8Array([
  74,
  70,
  73,
  70,
  0,
  1,
  1,
  1,
  0,
  72,
  0,
  72,
  0,
  0,
])

const jfifWithThumbnailData = new Uint8Array([
  74,
  70,
  73,
  70,
  0,
  1,
  1,
  1,
  0,
  72,
  0,
  72,
  2,
  3,
  4,
  5,
  6,
])

describe('APP', () => {
  describe('JFIF', () => {
    it('decodes JFIF segment without thumbnail', () => {
      const jfif = decodeAPP(0, jfifWithoutThumbnailData)
      expect(jfif).toEqual({
        type: 'JFIF',
        version: [1, 1],
        units: JFIFUnits.DotsPerInch,
        density: { x: 72, y: 72 },
      })
    })
    it('encodes JFIF segment without thumbnail', () => {
      const jfif: JFIF = {
        type: 'JFIF',
        version: [1, 1],
        units: JFIFUnits.DotsPerInch,
        density: { x: 72, y: 72 },
      }
      const buffer = new Uint8Array(getJfifLength(jfif))
      encodeJFIF(jfif, 0, buffer)
      expect(buffer.slice(0, 4)).toEqual(new Uint8Array([0xff, 0xe0, 0, 16]))
      expect(buffer.slice(4)).toEqual(jfifWithoutThumbnailData)
    })
    it('decodes JFIF segment with thumbnail data', () => {
      const jfif = decodeAPP(0, jfifWithThumbnailData)
      expect(jfif).toEqual({
        type: 'JFIF',
        version: [1, 1],
        units: JFIFUnits.DotsPerInch,
        density: { x: 72, y: 72 },
        thumbnail: {
          x: 2,
          y: 3,
          data: new Uint8Array([4, 5, 6]),
        },
      })
    })
    it('encodes JFIF segment with thumbnail data', () => {
      const thumbnail = new Uint8Array([4, 5, 6])
      const jfif: JFIF = {
        type: 'JFIF',
        version: [1, 1],
        units: JFIFUnits.DotsPerInch,
        density: { x: 72, y: 72 },
        thumbnail: {
          x: 2,
          y: 3,
          data: thumbnail,
        },
      }
      const buffer = new Uint8Array(getJfifLength(jfif))
      encodeJFIF(jfif, 0, buffer)
      expect(buffer.slice(0, 4)).toEqual(
        new Uint8Array([0xff, 0xe0, 0, 16 + thumbnail.length])
      )
      expect(buffer.slice(4)).toEqual(jfifWithThumbnailData)
    })
  })
})
