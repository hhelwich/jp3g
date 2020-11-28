import { readImageFile, readImageDataFromPng } from './util/testUtil'
import { decodeJpeg } from '../jpeg.decode'
import { decodeFrame } from '../frame.decode'
import jpeg8x8Expected from './images/8x8'
import jpeg8x16Expected from './images/8x16'
import jpeg16x8Expected from './images/16x8'

describe('images', () => {
  it('8x8.jpg decodes to expected image', async () => {
    const jpegData = readImageFile('8x8.jpg')
    const jpeg = decodeJpeg(jpegData)
    expect(jpeg).toEqual(jpeg8x8Expected)
    const imageData = decodeFrame(jpeg)
    expect(imageData).toEqual(
      await readImageDataFromPng('src/__tests__/images/8x8-expected.png')
    )
  })
  it('8x16.jpg decodes to expected image', async () => {
    const jpegData = readImageFile('8x16.jpg')
    const jpeg = decodeJpeg(jpegData)
    expect(jpeg).toEqual(jpeg8x16Expected)
    const imageData = decodeFrame(jpeg)
    expect(imageData).toEqual(
      await readImageDataFromPng('src/__tests__/images/8x16-expected.png')
    )
  })
  it('16x8.jpg decodes to expected image', async () => {
    const jpegData = readImageFile('16x8.jpg')
    const jpeg = decodeJpeg(jpegData)
    expect(jpeg).toEqual(jpeg16x8Expected)
    const imageData = decodeFrame(jpeg)
    expect(imageData).toEqual(
      await readImageDataFromPng('src/__tests__/images/16x8-expected.png')
    )
  })
})
