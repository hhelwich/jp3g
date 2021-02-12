import { JPEG } from '..'
import { decodeFrame } from '../frame.decode'
import { decodeJpeg } from '../jpeg.decode'
import { encodeJpeg } from '../jpeg.encode'
import { subarray } from '../util'
import {
  getExpectedImageData,
  getExpectedJpeg,
  getJpegBuffer,
  getTestImageSpecs,
} from './util/testUtil'

describe('test images', () => {
  const testImages = getTestImageSpecs()
  for (const testImage of testImages) {
    describe(testImage.name, () => {
      const jpegBuffer = subarray(getJpegBuffer(testImage.name))
      if (testImage.errorMessageForGetObject != null) {
        it(`decoding throws "${testImage.errorMessageForGetObject}"`, () => {
          expect(() => {
            decodeJpeg(jpegBuffer)
          }).toThrow(testImage.errorMessageForGetObject)
        })
      } else {
        let expectedJpeg: JPEG
        beforeAll(async () => {
          expectedJpeg = await getExpectedJpeg(testImage.name)
        })
        it('decodes to expected object', () => {
          const jpeg = decodeJpeg(jpegBuffer)
          expect(jpeg).toEqual(expectedJpeg)
        })
        it('re-encodes object to the same JPEG', () => {
          const jpegBufferAgain = encodeJpeg(expectedJpeg)
          expect(jpegBufferAgain).toEqual(jpegBuffer)
        })
        if (testImage.errorMessageForGetImageData != null) {
          it(`image decoding throws "${testImage.errorMessageForGetImageData}"`, () => {
            expect(() => {
              decodeFrame(expectedJpeg)
            }).toThrow(testImage.errorMessageForGetImageData)
          })
        } else {
          it('decodes to expected image', async () => {
            const expectedImageData = await getExpectedImageData(testImage.name)
            const [data, width, height] = decodeFrame(expectedJpeg)
            expect(width).toBe(expectedImageData.width)
            expect(height).toBe(expectedImageData.height)
            expect(data).toEqual(expectedImageData.data)
          })
        }
      }
    })
  }
})
