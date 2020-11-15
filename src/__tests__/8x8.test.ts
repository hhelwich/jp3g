import { readImageFile, readImageDataFromPng } from './testUtil'
import { decodeJpeg } from '../jpeg.decode'
import { decodeFrame } from '../frame.decode'
import jpeg8x8Expected from './images/8x8'
import jpeg16x16Expected from './images/16x16'

describe('images', () => {
  it('decodes to expected image', async () => {
    const jpegData = readImageFile('8x8.jpg')
    const jpeg = decodeJpeg(jpegData)
    expect(jpeg).toEqual(jpeg8x8Expected)
    const imageData = decodeFrame(jpeg)
    expect(imageData).toEqual(
      await readImageDataFromPng('src/__tests__/images/8x8-expected.png')
    )
  })
  it('decodes to expected image', async () => {
    const jpegData = readImageFile('16x16.jpg')
    const jpeg = decodeJpeg(jpegData)
    expect(jpeg).toEqual(jpeg16x16Expected)
    // TODO decode image
  })
})
