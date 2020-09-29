import sharp from 'sharp'
import { idct } from '../dct.reference.decode'
import coeff from './images/lotti-8-4:4:4-90.coeff'
import { yCbCr2Rgb } from '../color-rgb.decode'
import { decenter } from '../dct.center.decode'

const clampByte = (x: number) => (x < 0 ? 0 : x > 255 ? 255 : Math.round(x))

describe('Test image', () => {
  it('foo', async () => {
    const yActual = decenter(idct(coeff[0]))
    const cbActual = decenter(idct(coeff[1]))
    const crActual = decenter(idct(coeff[2]))
    const data = []
    for (let i = 0; i < 64; i += 1) {
      const [r, g, b] = yCbCr2Rgb([yActual[i], cbActual[i], crActual[i]])
      data[i * 4 + 0] = clampByte(r)
      data[i * 4 + 1] = clampByte(g)
      data[i * 4 + 2] = clampByte(b)
      data[i * 4 + 3] = 255
    }

    const expectedData = await sharp(
      'src/__tests__/images/lotti-8-4:4:4-90.png'
    )
      .raw()
      .ensureAlpha()
      .toBuffer()
    expect(data).toEqual(Array.from(expectedData))
  })
})
