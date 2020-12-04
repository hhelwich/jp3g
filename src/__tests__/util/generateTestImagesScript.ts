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

const ceil2 = (x: number) => Math.ceil(x * 100) / 100

const writeImageData = ({ width, height, data }: ImageData, fileName: string) =>
  sharp(Buffer.from(data), { raw: { width, height, channels: 4 } })
    .removeAlpha()
    .toFile(fileName)

;(async () => {
  try {
    // Generate some images which are used as source to create JPEG test images
    for (const [width, height] of [
      /*
      [7, 11],
      [8, 8],
      [8, 16],
      [8, 24],
      [8, 32],
      [11, 7],
      [16, 8],
      [16, 16],
      [16, 24],
      [16, 32],
      [24, 8],
      [24, 16],
      [24, 24],
      [24, 32],
      [32, 8],
      [32, 16],
      [32, 24],
      [32, 32],
      */
    ] as [number, number][]) {
      await writeImageData(
        createTestImage(width, height),
        `src/__tests__/images/original/${width}x${height}.png`
      )
    }
    // Iterate all JPEG images which are used to test the decoder and create a
    // PNG image to hold the expected result.
    for (const jpegFile of [
      // No subsampling here. Error because of libjpeg perf. optimizations?
      { name: '8x8', diff: { max: 3.63, mean: 0.22 } },
      // Halved chroma pixels. Libjpeg seems to do some interpolation?
      { name: '8x16', diff: { max: 14.82, mean: 2.68 } },
      { name: '16x8', diff: { max: 18.07, mean: 2.52 } },
      // Quatered chroma pixels
      { name: '16x16', diff: { max: 22.28, mean: 3.74 } },
      // RGB Subsampling
      { name: 'subsampling-8x8-121212', diff: { max: 0.73, mean: 0.15 } },
      { name: 'subsampling-8x16-121111', diff: { max: 15.2, mean: 2.42 } },
      { name: 'subsampling-8x16-121211', diff: { max: 6.41, mean: 1.18 } },
      //{ name: 'subsampling-8x16-121214', diff: { max: 42.4, mean: 15.56 } },// wrong
      //{ name: 'subsampling-8x16-212222', diff: { max: 92.03, mean: 43.43 } },// wrong
      { name: 'subsampling-16x8-211111', diff: { max: 22.68, mean: 2.66 } },
      //{ name: 'subsampling-16x16-212211', diff: { max: 49.79, mean: 10.39 } },// wrong
      // { name: 'subsampling-16x16-212212', diff: { max: 54.02, mean: 15.97 } },// wrong
      { name: 'subsampling-16x16-221111', diff: { max: 22.37, mean: 3.68 } },
      //{ name: 'subsampling-16x16-222141', diff: { max: 94.52, mean: 43.89 } },// wrong
      { name: 'subsampling-16x16-222211', diff: { max: 22.24, mean: 2.42 } },
      //{ name: 'subsampling-16x32-211414', diff: { max: 54.51, mean: 9.24 } },// wrong
      //{ name: 'subsampling-16x32-241111', diff: { max: 41.72, mean: 10.16 } },// wrong
      //{ name: 'subsampling-32x8-114121', diff: { max: 84.24, mean: 19.78 } },// wrong
      { name: 'subsampling-32x8-411111', diff: { max: 2.43, mean: 0.19 } },
      //{ name: 'subsampling-32x16-221141', diff: { max: 83.7, mean: 27.1 } },// wrong
      //{ name: 'subsampling-32x32-111441', diff: { max: 97.2, mean: 44.89 } },// wrong
      /* Samplin factor 3 not implemented yet
      { name: 'subsampling-8x24-131311', diff: { max: 0, mean: 0 } },
      { name: 'subsampling-16x24-112313', diff: { max: 0, mean: 0 } },
      { name: 'subsampling-24x8-111131', diff: { max: 0, mean: 0 } },
      { name: 'subsampling-24x8-121232', diff: { max: 0, mean: 0 } },
      { name: 'subsampling-24x16-111231', diff: { max: 0, mean: 0 } },
      { name: 'subsampling-24x16-113211', diff: { max: 0, mean: 0 } },
      { name: 'subsampling-24x16-121132', diff: { max: 0, mean: 0 } },
      { name: 'subsampling-24x16-311231', diff: { max: 0, mean: 0 } },
      { name: 'subsampling-24x24-131331', diff: { max: 0, mean: 0 } },
      { name: 'subsampling-24x32-311114', diff: { max: 0, mean: 0 } },
      */
    ]) {
      // Decode with libjpeg for reference
      const fileName = `src/__tests__/images/${jpegFile.name}.jpg`
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
      if (
        maxDistance > jpegFile.diff.max ||
        meanDistance > jpegFile.diff.mean
      ) {
        throw Error(
          `Unexpected pixel color diff { name: '${
            jpegFile.name
          }', diff: { max: ${ceil2(maxDistance)}, mean: ${ceil2(
            meanDistance
          )} } }`
        )
      }
      // Write expected decoder result which is used in decoder tests
      await writeImageData(
        image,
        `src/__tests__/images/${jpegFile.name}-expected.png`
      )
    }
    console.log('OK')
  } catch (e) {
    console.log(e)
  }
})()
