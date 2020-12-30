import jp3g from '..'
import {
  promisify,
  getExpectedImageData,
  getExpectedJpeg,
  getJpegBuffer,
} from './util/testUtil'

describe('index', () => {
  it('has version', () => {
    expect(jp3g.version).toMatch(/^\d+\.\d+\.\d+$/)
  })
  const jpegData = getJpegBuffer('8x8')
  describe('toJPEG', () => {
    it('decodes ArrayBuffer to JPEG struct', async () => {
      const jpegArrayBuffer = new Uint8Array(jpegData).buffer
      expect(jpegArrayBuffer).toBeInstanceOf(ArrayBuffer)
      const jpeg = await jp3g(jpegArrayBuffer).toJPEG()
      expect(jpeg).toEqual(await getExpectedJpeg('8x8'))
    })
    it('decodes node.js Buffer to JPEG struct', async () => {
      expect(jpegData).toBeInstanceOf(Buffer)
      const jpeg = await jp3g(jpegData).toJPEG()
      expect(jpeg).toEqual(await getExpectedJpeg('8x8'))
    })
    it('returns JPEG struct used for construction', async () => {
      const jpeg0 = await jp3g(jpegData).toJPEG()
      const jpeg = await jp3g(jpeg0).toJPEG()
      expect(jpeg).toBe(jpeg0)
    })
    it('can be used with callback', async () => {
      const jpeg = await promisify(jp3g(jpegData).toJPEG)()
      expect(jpeg).toEqual(await getExpectedJpeg('8x8'))
    })
  })
  describe('toImageData', () => {
    it('returns ImageData', async () => {
      const imageData = await jp3g(jpegData).toImageData()
      expect(imageData).toEqual(await getExpectedImageData('8x8'))
    })
    it('can be used with callback', async () => {
      const imageData = await promisify(jp3g(jpegData).toImageData)()
      expect(imageData).toEqual(await getExpectedImageData('8x8'))
    })
  })
  describe('scale', () => {
    it('can scale down by 1 / 8', async () => {
      const imageData = await jp3g(jpegData)
        .scale(1 / 8)
        .toImageData()
      expect(imageData).toEqual(await getExpectedImageData('8x8-scaled-1-8'))
    })
  })
})
