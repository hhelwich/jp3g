import { readImageFile, readImageDataFromPng } from './testUtil'
import { decodeJpeg } from '../jpeg.decode'
import { decodeFrame } from '../frame.decode'

describe('image 8x8', () => {
  it('decodes to expected image', async () => {
    const jpegData = readImageFile('8x8.jpg')
    const jpeg = decodeJpeg(jpegData)
    const imageData = decodeFrame(jpeg)
    expect(imageData).toEqual(
      await readImageDataFromPng('src/__tests__/images/8x8-expected.png')
    )
  })
})
