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
      [7, 11],
      [8, 8],
      [8, 16],
      [8, 24],
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
      [32, 32],
    ]) {
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
          `Unexpected pixel color diff (max=${maxDistance}, mean=${meanDistance})`
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

const possibleSamplingFrequencies = [1, 2, 3, 4]

const samplingFerquencies = new Map<number, Map<string, number[][]>>()
for (const yh of possibleSamplingFrequencies) {
  for (const yv of possibleSamplingFrequencies) {
    for (const cbh of possibleSamplingFrequencies) {
      for (const cbv of possibleSamplingFrequencies) {
        for (const crh of possibleSamplingFrequencies) {
          for (const crv of possibleSamplingFrequencies) {
            const dataUnitCount = yh * yv + cbh * cbv + crh * crv
            if (dataUnitCount > 10) {
              continue
            }
            let sfs = samplingFerquencies.get(dataUnitCount)
            if (!sfs) {
              sfs = new Map()
              samplingFerquencies.set(dataUnitCount, sfs)
            }
            const value = [yh, yv, cbh, cbv, crh, crv]
            const key = value.slice().sort().join(',')
            let values = sfs.get(key)
            if (values == null) {
              values = []
              sfs.set(key, values)
            }
            values.push(value)
          }
        }
      }
    }
  }
}
for (const count of Array.from(samplingFerquencies.keys()).sort(
  (a, b) => a - b
)) {
  const exampleSFreq: number[][] = []
  samplingFerquencies.get(count).forEach((a, b) => {
    exampleSFreq.push(a[Math.floor(Math.random() * a.length)])
  })
  console.log(count, exampleSFreq)
}

const exampleSubSamplingFactors3Comps = [
  // 4 data units
  [1, 2, 1, 1, 1, 1], // 4:2:2 vertical
  [2, 1, 1, 1, 1, 1], // 4:2:2 horizontal
  // 5 data units
  [1, 1, 1, 1, 3, 1],
  [1, 2, 1, 2, 1, 1],
  // 6 data units
  [2, 2, 1, 1, 1, 1], // 4:2:0 (chroma quartered)
  [4, 1, 1, 1, 1, 1],
  [1, 1, 1, 2, 3, 1],
  [1, 2, 1, 2, 1, 2],
  // 7 data units
  [1, 1, 4, 1, 2, 1],
  [2, 1, 2, 2, 1, 1],
  [1, 3, 1, 3, 1, 1],
  // [3, 1, 2, 1, 1, 2], // fractional sampling
  // 8 data units
  [1, 1, 3, 2, 1, 1],
  [3, 1, 1, 1, 1, 4],
  // [3, 1, 2, 2, 1, 1], // fractional sampling
  [1, 2, 1, 2, 1, 4],
  [2, 1, 2, 2, 1, 2],
  [3, 1, 1, 2, 3, 1],
  // 9 data units
  [1, 2, 1, 1, 3, 2],
  [1, 1, 1, 4, 4, 1],
  [2, 2, 1, 1, 4, 1],
  [2, 2, 2, 2, 1, 1],
  // [3, 1, 4, 1, 1, 2], // fractional sampling
  // [1, 2, 3, 1, 2, 2], // fractional sampling
  [1, 3, 1, 3, 3, 1],
  // 10 data units (allowed maximum)
  [2, 4, 1, 1, 1, 1],
  [1, 1, 2, 3, 1, 3],
  [1, 2, 1, 2, 3, 2],
  [2, 1, 1, 4, 1, 4],
  [2, 2, 2, 1, 4, 1],
  [2, 1, 2, 2, 2, 2],
  // [3, 1, 4, 1, 1, 3], // fractional sampling
  // [1, 3, 3, 1, 2, 2], // fractional sampling
]

const foo = exampleSubSamplingFactors3Comps.map(
  ([yh, yv, cbh, cbv, crh, crv]) => {
    const maxH = Math.max(yh, cbh, crh)
    const maxV = Math.max(yv, cbv, crv)
    // Size of the MCU in pixels
    const mcuWidth = 8 * maxH
    const mcuHeight = 8 * maxV
    const fileName = `subsampling-${mcuWidth}x${mcuHeight}-${yh}${yv}${cbh}${cbv}${crh}${crv}`
    return [
      `convert -define jpeg:dct-method=float -sampling-factor ${yh}x${yv},${cbh}x${cbv},${crh}x${crv} -quality 85 original/${mcuWidth}x${mcuHeight}.png ${fileName}.jpg`,
      `| [${fileName}.jpg](${fileName}.jpg) | [${fileName}.ts](${fileName}.ts) | [${fileName}-expected.png](${fileName}-expected.png) | RGB image with subsampling ${yh}x${yv},${cbh}x${cbv},${crh}x${crv} and single MCU (Quality 85, Optimized, Floating point baseline DCT). |`,
    ]
  }
)
console.log(foo.map(([cmd]) => cmd).join('\n'))
console.log(foo.map(([, md]) => md).join('\n'))
