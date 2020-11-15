import sharp from 'sharp'
import { idct } from '../dctReference.decode'
import coeff from './images/lotti-8-4:4:4-90.coeff'
import { yCbCr2Rgb } from '../colorRgb.decode'
import { decenter } from '../dctCenter.decode'
import { readImageFile } from './testUtil'
import { decodeJpeg } from '../jpeg.decode'
import { decodeFrame } from '../frame.decode'

describe('Test image', () => {
  it('baz', async () => {
    const jpegData = readImageFile('lotti-8-4:4:4-90.jpg')
    const jpeg = decodeJpeg(jpegData)
    const imageData = decodeFrame(jpeg)
    const expectedData = await sharp(
      'src/__tests__/images/lotti-8-4:4:4-90.png'
    )
      .raw()
      .ensureAlpha()
      .toBuffer()
    expect(Array.from(imageData.data)).toEqual(Array.from(expectedData))
  })

  it('foo', async () => {
    const yActual = decenter(idct(coeff[0]))
    const cbActual = decenter(idct(coeff[1]))
    const crActual = decenter(idct(coeff[2]))
    const data = new Uint8ClampedArray(8 * 8 * 4)
    for (let i = 0; i < 64; i += 1) {
      const [r, g, b] = yCbCr2Rgb([yActual[i], cbActual[i], crActual[i]])
      data[i * 4 + 0] = r
      data[i * 4 + 1] = g
      data[i * 4 + 2] = b
      data[i * 4 + 3] = 255
    }

    const expectedData = await sharp(
      'src/__tests__/images/lotti-8-4:4:4-90.png'
    )
      .raw()
      .ensureAlpha()
      .toBuffer()
    expect(Array.from(data)).toEqual(Array.from(expectedData))
  })
})
