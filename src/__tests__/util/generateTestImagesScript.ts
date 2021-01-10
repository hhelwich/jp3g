import { readFileSync, writeFileSync } from 'fs'
import { createCanvas } from 'canvas'
import { decodeJpeg } from '../../jpeg.decode'
import { decodeFrame } from '../../frame.decode'
import { distanceRgb } from './distanceRgb'
import sharp from 'sharp'
import { JFIFUnits, Jpeg, QuantizationTable } from '../../jpeg'
import { createImageData } from '../../util'

const imageDir = 'src/__tests__/images/'

const { round } = Math

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

type FileInfo = {
  name: string
  downScale?: 1 | 8
  diff: { max: number; mean: number }
}
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
      [35, 35],
      [64, 64],
      */
    ] as [number, number][]) {
      await writeImageData(
        createTestImage(width, height),
        `${imageDir}original/${width}x${height}.png`
      )
    }
    // Iterate all JPEG images which are used to test the decoder and create a
    // PNG image to hold the expected result.
    const diffs: FileInfo[] = []
    let differentDiff = false
    let aboveDiff = false
    for (const jpegFile of [
      { name: '8x8', diff: { max: 0.3, mean: 0.02 } },
      { name: '8x16', diff: { max: 15.15, mean: 2.67 } },
      { name: '16x8', diff: { max: 18.07, mean: 2.5 } },
      { name: '16x16', diff: { max: 0.37, mean: 0.01 } },
      {
        name: '32x32-subsampling-221221-mcu-2x2',
        diff: { max: 18.81, mean: 1.06 },
      },
      {
        name: '35x35-subsampling-122111-partial-mcu-3x3',
        diff: { max: 28.81, mean: 2.05 },
      },
      { name: 'subsampling-8x16-121111', diff: { max: 15.2, mean: 2.4 } },
      { name: 'subsampling-8x16-121211', diff: { max: 6.41, mean: 1.17 } },
      { name: 'subsampling-8x16-121212', diff: { max: 0.36, mean: 0.01 } },
      { name: 'subsampling-8x32-121214', diff: { max: 20.55, mean: 2.03 } },
      { name: 'subsampling-16x16-212222', diff: { max: 11.41, mean: 1.7 } },
      { name: 'subsampling-16x8-211111', diff: { max: 22.68, mean: 2.66 } },
      { name: 'subsampling-16x16-212211', diff: { max: 23.59, mean: 3.39 } },
      { name: 'subsampling-16x16-212212', diff: { max: 18.1, mean: 2.95 } },
      { name: 'subsampling-16x16-221111', diff: { max: 22.31, mean: 3.66 } },
      { name: 'subsampling-32x16-222141', diff: { max: 24.98, mean: 2.78 } },
      { name: 'subsampling-16x16-222211', diff: { max: 22.24, mean: 2.4 } },
      { name: 'subsampling-16x32-211414', diff: { max: 22.79, mean: 1.94 } },
      { name: 'subsampling-16x32-241111', diff: { max: 0.35, mean: 0.02 } },
      { name: 'subsampling-32x8-114121', diff: { max: 15.63, mean: 1.33 } },
      { name: 'subsampling-32x8-411111', diff: { max: 0.43, mean: 0.01 } },
      { name: 'subsampling-32x16-221141', diff: { max: 22.45, mean: 1.61 } },
      { name: 'subsampling-32x32-111441', diff: { max: 0.44, mean: 0.02 } },
      { name: 'subsampling-8x24-131311', diff: { max: 0.58, mean: 0.03 } },
      { name: 'subsampling-16x24-112313', diff: { max: 21.22, mean: 1.74 } },
      { name: 'subsampling-24x8-111131', diff: { max: 0.87, mean: 0.02 } },
      { name: 'subsampling-24x16-121232', diff: { max: 0.68, mean: 0.01 } },
      { name: 'subsampling-24x16-111231', diff: { max: 19.84, mean: 1.09 } },
      { name: 'subsampling-24x16-113211', diff: { max: 1.24, mean: 0.03 } },
      { name: 'subsampling-24x16-121132', diff: { max: 0.74, mean: 0.02 } },
      { name: 'subsampling-24x16-311231', diff: { max: 21.7, mean: 2.26 } },
      { name: 'subsampling-24x24-131331', diff: { max: 0.49, mean: 0.02 } },
      { name: 'subsampling-24x32-311114', diff: { max: 1.12, mean: 0.04 } },
      { name: '64x64', downScale: 8, diff: { max: 9.03, mean: 1.33 } },
    ] as FileInfo[]) {
      // Decode with libjpeg for reference
      const fileName = `${imageDir}${jpegFile.name}.jpg`
      const downScale = jpegFile.downScale ?? 1
      let sharpImage = sharp(fileName)
      if (downScale > 1) {
        const metaData = await sharpImage.metadata()
        // TODO Check that rounding is the same as in libjpeg downscaling
        sharpImage = sharpImage.resize({
          width: round(metaData.width! / downScale),
        })
      }
      const referenceImage = await sharpImage
        .raw()
        .toBuffer({ resolveWithObject: true })
      // Decode image with decoder under test
      const jpeg = decodeJpeg(new Uint8Array(readFileSync(fileName)))
      const [imageData, imageWidth, imageHeight] = decodeFrame(jpeg, {
        downScale,
      })
      // Verify metadata
      const { width, height } = referenceImage.info
      if (imageHeight !== height || imageWidth !== width) {
        throw Error(`Unexpected image dimension: ${jpegFile.name}`)
      }
      // Verify pixel data is very similar to libjpeg decoder result
      let maxDistance = 0
      let meanDistance = 0
      const count = width * height
      for (let x = 0; x < width; x += 1) {
        for (let y = 0; y < height; y += 1) {
          const i = (x + y * width) * 4
          const alpha = imageData[i + 3]
          if (alpha !== 255) {
            throw Error('Unexpected alpha')
          }
          const rgb = [imageData[i], imageData[i + 1], imageData[i + 2]]
          const j = (x + y * width) * 3
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
      maxDistance = ceil2(maxDistance)
      meanDistance = ceil2(meanDistance)
      diffs.push({
        name: jpegFile.name,
        downScale: jpegFile.downScale,
        diff: { max: maxDistance, mean: meanDistance },
      })
      if (
        maxDistance !== jpegFile.diff.max ||
        meanDistance !== jpegFile.diff.mean
      ) {
        differentDiff = true
        if (
          maxDistance > jpegFile.diff.max ||
          meanDistance > jpegFile.diff.mean
        ) {
          aboveDiff = true
        }
      }
      // Write expected decoder result which is used in decoder tests
      await writeImageData(
        createImageData(imageData, imageWidth, imageHeight),
        `${imageDir}${jpegFile.name}-${
          downScale > 1 ? `scale${downScale}-` : ''
        }expected.png`
      )
    }
    if (differentDiff) {
      console.log(`Changed pixel difference ${JSON.stringify(diffs)}`)
      if (aboveDiff) {
        throw Error('Pixel difference is to high')
      }
    }
    console.log('OK')
  } catch (e) {
    console.log(e)
  }
})()

const list2ts = (list: any, indent: string, width = 80): string =>
  (Array.from(list) as any[])
    .reduce(
      (lines: string[], element) => {
        let value = `${JSON.stringify(element)},`
        let line = lines[0]
        if ((line + ' ' + value).length > width) {
          lines.unshift(indent + value)
        } else {
          lines[0] += (line === indent ? '' : ' ') + value
        }
        return lines
      },
      [indent]
    )
    .reverse()
    .join('\n')

const dqt2ts = (values: QuantizationTable, indent: string) => {
  const maxLength = Math.max(
    ...Array.from(values.map((s: number) => `${s}`.length))
  )
  let line = ''
  for (let row = 0; row < 8; row += 1) {
    line += indent + '  '
    const vals: string[] = []
    for (let col = 0; col < 8; col += 1) {
      let nbr = `${values[col + row * 8]}`
      while (nbr.length < maxLength) {
        nbr = ' ' + nbr
      }
      vals.push(nbr)
    }
    line += vals.join(', ') + ',\n'
  }
  return (
    `\n${indent}// prettier-ignore\n` +
    `${indent}values: new ${values.constructor.name}([\n` +
    `${line}${indent}])`
  )
}

const jpegValue2ts = (value: any): string =>
  Array.isArray(value)
    ? `[${value.map(jpegValue2ts).join(',')}]`
    : typeof value === 'object' && value !== null
    ? `{${Object.entries(value)
        .map(([key, value]: [any, any]) => {
          if (key === 'data' && value instanceof Uint8Array) {
            return (
              '\n' +
              [
                '    // prettier-ignore',
                '    data: new Uint8Array([',
                list2ts(value, '      '),
                '    ])',
              ].join('\n')
            )
          }
          if (key === 'values' && value?.length === 64) {
            return dqt2ts(value, '        ')
          }
          if (key === 'units') {
            return `${key}: ${
              value === JFIFUnits.PixelAspectRatio
                ? 'JFIFUnits.PixelAspectRatio'
                : value === JFIFUnits.DotsPerInch
                ? 'JFIFUnits.DotsPerInch'
                : value === JFIFUnits.DotsPerCm
                ? 'JFIFUnits.DotsPerCm'
                : jpegValue2ts(value)
            }`
          }
          return `${key}: ${jpegValue2ts(value)}`
        })
        .join(',')}}`
    : JSON.stringify(value)

const jpeg2ts = (jpeg: Jpeg) => `
  import { ${
    jpeg.find(({ type }) => type === 'JFIF') ? 'JFIFUnits, ' : ''
  }Jpeg } from '../../jpeg'

  const jpeg: Jpeg = ${jpegValue2ts(jpeg)}

  export default jpeg`

/**
 * Generate expected object files from images.
 */
for (const jpegFileName of [
  '7x11',
  '8x8',
  '8x8-cmyk',
  '8x8-gray',
  '8x8-thumbnail',
  '8x8-with-thumbnail',
  '8x16',
  '11x7',
  '16x8',
  '16x16',
  '32x32',
  'lotti-8-4:4:4-90',
  '32x32-subsampling-221221-mcu-2x2',
  '35x35-subsampling-122111-partial-mcu-3x3',
]) {
  const fileName = `${imageDir}${jpegFileName}.jpg`
  const jpeg = decodeJpeg(new Uint8Array(readFileSync(fileName)))
  writeFileSync(`${imageDir}${jpegFileName}.ts`, jpeg2ts(jpeg))
}
