import sharp from 'sharp'
import { readImageFile, writeImageFile } from './testUtil'
import { decodeJpeg } from '../jpeg.decode'
import { decodeFrame } from '../frame.decode'

describe('image 8x8', () => {
  it('decodes to expected image', async () => {
    const jpegData = readImageFile('8x8.jpg')
    const jpeg = decodeJpeg(jpegData)
    const imageData = decodeFrame(jpeg)
    const expectedData = await sharp('src/__tests__/images/8x8-expected.png')
      .raw()
      .ensureAlpha()
      .toBuffer()
    expect(Array.from(imageData.data)).toEqual(Array.from(expectedData))
  })
})
