import { readFileSync } from 'fs'
import { createCanvas } from 'canvas'
import { decodeJpeg } from '../../jpeg.decode'
import { decodeFrame } from '../../frame.decode'
import { distanceRgb } from './distanceRgb'
import sharp from 'sharp'

/**
 * Create test image data which has full red, green, blue (when square), black
 * and white pixels and fades between them.
 */
const createTestImage = (width: number, height: number) => {
  // Create canvas
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')
  // Center of the image
  const cx = (width - 1) / 2
  const cy = (height - 1) / 2
  // Region which has black and white
  const sx0 = Math.round(width / 4)
  const sx1 = Math.round((width / 4) * 3)
  const sy0 = Math.round(height / 4)
  const sy1 = Math.round((height / 4) * 3)
  // Calculate pixels
  for (let x = 0; x < width; x += 1) {
    for (let y = 0; y < height; y += 1) {
      const a = ((Math.atan2(y - cy, x - cx) / Math.PI) * 180 + 495) % 360
      // Stretch angle so red, green and blue are in the corners
      const h = a <= 180 ? (a / 3) * 4 : (a / 3) * 2 + 120
      let l = 50
      let s = 100
      // Fade lightness in the middle of image to have black and white pixel
      if (x >= sx0 && x < sx1 && y >= sy0 && y < sy1) {
        const nx = (x - sx0) / (sx1 - sx0 - 1)
        const ny = (y - sy0) / (sy1 - sy0 - 1)
        l = Math.sqrt((nx + ny) ** 2 / 4) * 100
        s = 50
      }
      ctx.fillStyle = `hsl(${h},${s}%,${l}%)`
      ctx.fillRect(x, y, 1, 1)
    }
  }
  return ctx.getImageData(0, 0, width, height)
}

const writeImageData = ({ width, height, data }: ImageData, fileName: string) =>
  sharp(Buffer.from(data), { raw: { width, height, channels: 4 } })
    .removeAlpha()
    .toFile(fileName)

;(async () => {
  try {
    // Generate some images which are used as source to create JPEG test images
    for (const [width, height] of [
      [8, 8],
      [16, 8],
      [16, 16],
      [32, 32],
      [7, 11],
    ]) {
      await writeImageData(
        createTestImage(width, height),
        `src/__tests__/images/${width}x${height}-original.png`
      )
    }
    // Iterate all JPEG images which are used to test the decoder and create a
    // PNG image to hold the expected result.
    for (const jpegFileName of ['8x8']) {
      // Decode with libjpeg for reference
      const fileName = `src/__tests__/images/${jpegFileName}.jpg`
      const referenceImage = await sharp(fileName)
        .raw()
        .toBuffer({ resolveWithObject: true })
      // Decode image with decoder under test
      const jpeg = decodeJpeg(new Uint8Array(readFileSync(fileName)))
      const image = decodeFrame(jpeg)
      // Verify metadata
      if (
        image.height !== referenceImage.info.height ||
        image.width !== referenceImage.info.width
      ) {
        throw Error('Unexpected image dimension')
      }
      // Verify pixel data is very similar to libjpeg decoder result
      let maxDistance = 0
      let meanDistance = 0
      const count = image.width * image.height
      for (let x = 0; x < image.width; x += 1) {
        for (let y = 0; y < image.height; y += 1) {
          const i = (x + y * image.width) * 4
          const alpha = image.data[i + 3]
          if (alpha !== 255) {
            throw Error('Unexpected alpha')
          }
          const rgb = [image.data[i], image.data[i + 1], image.data[i + 2]]
          const j = (x + y * image.width) * 3
          const rgbReference = [
            referenceImage.data[j],
            referenceImage.data[j + 1],
            referenceImage.data[j + 2],
          ]
          const distance = distanceRgb(rgb, rgbReference)
          maxDistance = Math.max(maxDistance, distance)
          meanDistance += distance / count
        }
      }
      if (maxDistance > 4 || meanDistance > 0.3) {
        throw Error('Unexpected pixel color')
      }
      // Write expected decoder result which is used in decoder tests
      await writeImageData(
        image,
        `src/__tests__/images/${jpegFileName}-expected.png`
      )
    }
    console.log('OK')
  } catch (e) {
    console.log(e)
  }
})()
