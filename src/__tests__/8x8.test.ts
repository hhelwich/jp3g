import {
  getJpegBuffer,
  getExpectedJpeg,
  getExpectedImageData,
} from './util/testUtil'
import { decodeJpeg } from '../jpeg.decode'
import { decodeFrame } from '../frame.decode'

describe('images', () => {
  it('8x8.jpg decodes to expected image', async () => {
    const jpegData = new Uint8Array(getJpegBuffer('8x8'))
    const jpeg = decodeJpeg(jpegData)
    expect(jpeg).toEqual(await getExpectedJpeg('8x8'))
    const imageData = decodeFrame(jpeg)
    expect(
      Buffer.from(imageData[0]).compare(
        Buffer.from((await getExpectedImageData('8x8')).data)
      )
    ).toBe(0)
  })
  it('8x16.jpg decodes to expected image', async () => {
    const jpegData = new Uint8Array(getJpegBuffer('8x16'))
    const jpeg = decodeJpeg(jpegData)
    expect(jpeg).toEqual(await getExpectedJpeg('8x16'))
    const imageData = decodeFrame(jpeg)
    expect(
      Buffer.from(imageData[0]).compare(
        Buffer.from((await getExpectedImageData('8x16')).data)
      )
    ).toBe(0)
  })
  it('down scale 8', async () => {
    const jpegData = getJpegBuffer('64x64')
    const jpeg = decodeJpeg(jpegData)
    const imageData = decodeFrame(jpeg, { downScale: 8 })
    expect(
      Buffer.from(imageData[0]).compare(
        Buffer.from((await getExpectedImageData('64x64-scale8')).data)
      )
    ).toBe(0)
  })
  it('16x8.jpg decodes to expected image', async () => {
    const jpegData = new Uint8Array(getJpegBuffer('16x8'))
    const jpeg = decodeJpeg(jpegData)
    expect(jpeg).toEqual(await getExpectedJpeg('16x8'))
    const imageData = decodeFrame(jpeg)
    expect(
      Buffer.from(imageData[0]).compare(
        Buffer.from((await getExpectedImageData('16x8')).data)
      )
    ).toBe(0)
    /*
    expect(imageData).toEqual(
      await readImageDataFromPng('src/__tests__/images/16x8-expected.png')
    )
    */
  })
  it('16x16.jpg decodes to expected image', async () => {
    const jpegData = new Uint8Array(getJpegBuffer('16x16'))
    const jpeg = decodeJpeg(jpegData)
    expect(jpeg).toEqual(await getExpectedJpeg('16x16'))
    const imageData = decodeFrame(jpeg)
    expect(
      Buffer.from(imageData[0]).compare(
        Buffer.from((await getExpectedImageData('16x16')).data)
      )
    ).toBe(
      0
      //await readImageDataFromPng('src/__tests__/images/16x16-expected.png')
    )
  })

  it('32x32-subsampling-221221-mcu-2x2-expected.jpg decodes to expected image', async () => {
    const jpegData = new Uint8Array(
      getJpegBuffer('32x32-subsampling-221221-mcu-2x2')
    )
    const jpeg = decodeJpeg(jpegData)
    expect(jpeg).toEqual(
      await getExpectedJpeg('32x32-subsampling-221221-mcu-2x2')
    )
    const imageData = decodeFrame(jpeg)

    expect(
      Buffer.from(imageData[0]).compare(
        Buffer.from(
          (await getExpectedImageData('32x32-subsampling-221221-mcu-2x2')).data
        )
      )
    ).toBe(
      0
      //await readImageDataFromPng('src/__tests__/images/16x16-expected.png')
    )
  })

  it('35x35-subsampling-122111-partial-mcu-3x3-expected.jpg decodes to expected image', async () => {
    const jpegData = new Uint8Array(
      getJpegBuffer('35x35-subsampling-122111-partial-mcu-3x3')
    )
    const jpeg = decodeJpeg(jpegData)
    expect(jpeg).toEqual(
      await getExpectedJpeg('35x35-subsampling-122111-partial-mcu-3x3')
    )
    const imageData = decodeFrame(jpeg)
    /*
    await writeImageDataToPng(
      imageData,
      '35x35-subsampling-122111-partial-mcu-3x3-foo'
    )
    */

    expect(
      Buffer.from(imageData[0]).compare(
        Buffer.from(
          (
            await getExpectedImageData(
              '35x35-subsampling-122111-partial-mcu-3x3'
            )
          ).data
        )
      )
    ).toBe(
      0
      //await readImageDataFromPng('src/__tests__/images/16x16-expected.png')
    )
  })

  for (const fileName of [
    'subsampling-8x16-121111',
    'subsampling-8x16-121211',
    'subsampling-16x8-211111',
    'subsampling-16x16-221111',
    'subsampling-16x16-222211',
    'subsampling-32x8-411111',
    'subsampling-8x32-121214',
    'subsampling-16x16-212222',
    'subsampling-16x16-212211',
    'subsampling-16x16-212212',
    'subsampling-32x16-222141',
    'subsampling-16x32-211414',
    'subsampling-16x32-241111',
    'subsampling-32x8-114121',
    'subsampling-32x16-221141',
    'subsampling-32x32-111441',
    'subsampling-8x24-131311',
    'subsampling-16x24-112313',
    'subsampling-24x8-111131',
    'subsampling-24x16-121232',
    'subsampling-24x16-111231',
    'subsampling-24x16-113211',
    'subsampling-24x16-121132',
    'subsampling-24x16-311231',
    'subsampling-24x24-131331',
    'subsampling-24x32-311114',
  ]) {
    it(`${fileName}.jpg decodes to expected image`, async () => {
      const jpegData = getJpegBuffer(fileName)
      const jpeg = decodeJpeg(jpegData)
      //expect(jpeg).toEqual(jpeg8x8Expected)
      const imageData = decodeFrame(jpeg)
      /*
      if (fileName === 'subsampling-8x32-121214') {
        await writeImageDataToPng(imageData, fileName + 'fooo')
      }
      */
      expect(
        Buffer.from(imageData[0]).compare(
          Buffer.from((await getExpectedImageData(fileName)).data)
        )
      ).toBe(0)
    })
  }
  xit('7x11.jpg decodes to expected image', async () => {
    const jpegData = getJpegBuffer('7x11')
    const jpeg = decodeJpeg(jpegData)
    expect(jpeg).toEqual(await getExpectedJpeg('7x11'))
    /*
    const imageData = decodeFrame(jpeg)
    expect(imageData).toEqual(
      await readImageDataFromPng('src/__tests__/images/16x16-expected.png')
    )
    */
  })
  xit('11x7.jpg decodes to expected image', async () => {
    const jpegData = getJpegBuffer('11x7')
    const jpeg = decodeJpeg(jpegData)
    expect(jpeg).toEqual(await getExpectedJpeg('11x7'))
    /*
    const imageData = decodeFrame(jpeg)
    expect(imageData).toEqual(
      await readImageDataFromPng('src/__tests__/images/16x16-expected.png')
    )
    */
  })
  xit('8x8-cmyk.jpg decodes to expected image', async () => {
    const jpegData = getJpegBuffer('8x8-cmyk')
    const jpeg = decodeJpeg(jpegData)
    expect(jpeg).toEqual(await getExpectedJpeg('8x8-cmyk'))
    //const imageData = decodeFrame(jpeg)
    /*
    expect(imageData).toEqual(
      await readImageDataFromPng('src/__tests__/images/32x32-expected.png')
    )
    */
  })
  xit('8x8-gray.jpg decodes to expected image', async () => {
    const jpegData = getJpegBuffer('8x8-gray')
    const jpeg = decodeJpeg(jpegData)
    //writeFileSync('src/__tests__/images/8x8-gray.ts', JSON.stringify(jpeg))
    expect(jpeg).toEqual(await getExpectedJpeg('8x8-gray'))
    //const imageData = decodeFrame(jpeg)
    /*
    expect(imageData).toEqual(
      await readImageDataFromPng('src/__tests__/images/32x32-expected.png')
    )
    */
  })
  xit('32x32.jpg decodes to expected image', async () => {
    const jpegData = getJpegBuffer('32x32')
    const jpeg = decodeJpeg(jpegData)
    expect(jpeg).toEqual(await getExpectedJpeg('32x32'))
    const imageData = decodeFrame(jpeg)
    /*
    expect(imageData).toEqual(
      await readImageDataFromPng('src/__tests__/images/32x32-expected.png')
    )
    */
  })
})
