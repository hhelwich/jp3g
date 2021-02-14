import {
  existsSync,
  readdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from 'fs'
import { createCanvas } from 'canvas'
import { decodeJpeg } from '../../jpeg.decode'
import { decodeFrame, ImageDataArgs } from '../../frame.decode'
import { distanceRgb } from './distanceRgb'
import sharp from 'sharp'
import { JFIFUnits, JPEG, QuantizationTable } from '../../jpeg'
import { createImageData, subarray } from '../../util'
import {
  getTestImageSpecs,
  TestImageSpec,
  imageDir,
  getExpectedJpeg,
} from './testUtil'
import { encodeJpeg } from '../../jpeg.encode'

const originalImageDir = `${imageDir}/original`

const referenceImageNameSuffix = '-ref'

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

const buildReadme = (testInfo: TestImageSpec[]) => {
  const header = [
    'Name',
    'Description',
    'Actual JPEG',
    'Expected Image',
    'Expected Object',
  ]
  const headerLines = [
    '# JPEG test images',
    '',
    `| ${header.join(' | ')} |`,
    `| ${header.map(() => '---').join(' | ')} |`,
  ]
  const lines = headerLines.concat(
    testInfo.map(
      ({
        name,
        errorMessageForGetObject,
        errorMessageForGetImageData,
        description,
      }) =>
        `| ${[
          name,
          description,
          `![${name}.jpg](${name}.jpg)`,
          errorMessageForGetObject != null
            ? ''
            : errorMessageForGetImageData != null
            ? `⚠️ ${errorMessageForGetImageData}`
            : `![${name}.png](${name}.png)`,
          errorMessageForGetObject != null
            ? `⚠️ ${errorMessageForGetObject}`
            : `[TS](${name}.ts)`,
        ].join(' | ')} |`
    )
  )
  return lines.join('\n')
}

const difference = <T>(setA: Set<T>, setB: Set<T>): Set<T> => {
  const _difference = new Set(setA)
  for (const elem of setB) {
    _difference.delete(elem)
  }
  return _difference
}

type FileInfo = {
  name: string
  downScale?: 1 | 8
  diff: { max: number; mean: number }
}

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

const dqt2ts = (data: QuantizationTable, indent: string) => {
  const maxLength = Math.max(
    ...Array.from(data.map((s: number) => `${s}`.length))
  )
  let line = ''
  for (let row = 0; row < 8; row += 1) {
    line += indent + '  '
    const vals: string[] = []
    for (let col = 0; col < 8; col += 1) {
      let nbr = `${data[col + row * 8]}`
      while (nbr.length < maxLength) {
        nbr = ' ' + nbr
      }
      vals.push(nbr)
    }
    line += vals.join(', ') + ',\n'
  }
  return (
    `\n${indent}// prettier-ignore\n` +
    `${indent}data: new ${data.constructor.name}([\n` +
    `${line}${indent}])`
  )
}

const jpegValue2ts = (value: any): string =>
  Array.isArray(value)
    ? `[${value.map(jpegValue2ts).join(',')}]`
    : typeof value === 'object' && value !== null
    ? `{${Object.entries(value)
        .map(([key, value]: [any, any]) => {
          if (
            key === 'data' &&
            value instanceof Uint8Array &&
            value.length !== 64
          ) {
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
          if (key === 'data' && value?.length === 64) {
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

const jpeg2ts = (jpeg: JPEG) => `
  import { ${
    jpeg.find(({ type }) => type === 'JFIF') ? 'JFIFUnits, ' : ''
  }JPEG } from '../../jpeg'

  const jpeg: JPEG = ${jpegValue2ts(jpeg)}

  export default jpeg`

// Generate some images which are used as source to create JPEG test images
const updateOriginalImages = async () => {
  const originalWantedSizes = new Set([
    '7x11',
    '8x8',
    '8x16',
    '8x24',
    '8x32',
    '11x7',
    '16x8',
    '16x16',
    '16x24',
    '16x32',
    '24x8',
    '24x16',
    '24x24',
    '24x32',
    '32x8',
    '32x16',
    '32x24',
    '32x32',
    '35x35',
    '64x64',
  ])
  const originalExistingSizes = new Set(
    readdirSync(originalImageDir)
      .filter(fileName => fileName.match(/^\d+x\d+\.png$/))
      .map(fileName => fileName.slice(0, -4))
  )
  // Delete unwanted original files
  for (const fileName of difference(
    originalExistingSizes,
    originalWantedSizes
  )) {
    unlinkSync(`${originalImageDir}/${fileName}.png`)
  }
  // Generate wanted original files
  for (const fileName of difference(
    originalWantedSizes,
    originalExistingSizes
  )) {
    const match = fileName.match(/^(\d+)x(\d+)$/)
    if (!match) {
      throw Error('Should not be possible')
    }
    await writeImageData(
      createTestImage(+match[1], +match[2]),
      `${originalImageDir}/${fileName}.png`
    )
  }
}

const verifyImageData = async (jpegFile: {
  name: string
  downScale: number
  maxMean: number
  max: number
}) => {
  // Decode with libjpeg for reference
  const fileName = `${imageDir}/${jpegFile.name}.jpg`
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
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  // Decode image with decoder under test
  const jpeg = decodeJpeg(subarray(readFileSync(fileName)))
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
      const rgbReference = [
        referenceImage.data[i],
        referenceImage.data[i + 1],
        referenceImage.data[i + 2],
      ]
      const distance = distanceRgb(rgb, rgbReference)
      maxDistance = Math.max(maxDistance, distance)
      meanDistance += distance / count
    }
  }
  maxDistance = ceil2(maxDistance)
  meanDistance = ceil2(meanDistance)
  if (maxDistance > jpegFile.max || meanDistance > jpegFile.maxMean) {
    console.log(
      `Diff too much for "${jpegFile.name}": mean=${meanDistance}, max=${maxDistance}`
    )
    writeImageData(
      { width, height, data: new Uint8ClampedArray(referenceImage.data) },
      `${imageDir}/${jpegFile.name}${referenceImageNameSuffix}.png`
    )
  }
}

;(async () => {
  try {
    await updateOriginalImages()

    const testJPEGs = new Set(
      readdirSync(imageDir)
        .filter(fileName => fileName.match(/\.jpg$/))
        .map(fileName => fileName.slice(0, -4))
    )
    const expectedJPEGObjects = new Set(
      readdirSync(imageDir)
        .filter(fileName => fileName.match(/\.ts$/))
        .map(fileName => fileName.slice(0, -3))
    )
    const pngNames = readdirSync(imageDir)
      .filter(fileName => fileName.match(/\.png$/))
      .map(fileName => fileName.slice(0, -4))

    const expectedJPEGImageData = new Set(
      pngNames.filter(name => !name.endsWith(referenceImageNameSuffix))
    )
    const refPngs = pngNames.filter(name =>
      name.endsWith(referenceImageNameSuffix)
    )

    // Delete previous refercence PNGs
    for (const fileName of refPngs) {
      unlinkSync(`${imageDir}/${fileName}.png`)
    }

    // Create JPEG files from JPEG objects if missing
    for (const fileName of difference(expectedJPEGObjects, testJPEGs)) {
      const jpeg = await getExpectedJpeg(fileName)
      const jpegBuf = encodeJpeg(jpeg)
      writeFileSync(`${imageDir}/${fileName}.jpg`, jpegBuf)
      testJPEGs.add(fileName)
    }

    const testInfo = getTestImageSpecs()
      // Remove README entries without test image
      .filter(({ name }) => testJPEGs.has(name))

    // Remove expected image data files without test image
    for (const fileName of difference(expectedJPEGImageData, testJPEGs)) {
      unlinkSync(`${imageDir}/${fileName}.png`)
    }

    const jpegNames = testInfo
      .map(({ name, description }) => ({ name, description }))
      .concat(
        [...difference(testJPEGs, new Set(testInfo.map(({ name }) => name)))]
          .sort()
          .map(name => ({ name, description: '?' }))
      )

    const newTestInfo: TestImageSpec[] = []
    for (const { name, description } of jpegNames) {
      const fileName = `${imageDir}/${name}.jpg`
      const objectFileName = `${imageDir}/${name}.ts`
      const pngFileName = `${imageDir}/${name}.png`
      let errorMessageForGetObject: string | undefined
      let errorMessageForGetImageData: string | undefined
      // Generate expected JPEG object file
      let jpeg: JPEG | undefined
      try {
        jpeg = decodeJpeg(new Uint8Array(readFileSync(fileName)))
      } catch (error) {
        errorMessageForGetObject = (error as Error).message ?? ''
      }
      if (jpeg) {
        writeFileSync(objectFileName, jpeg2ts(jpeg))
        // Generate expected image data file
        // TODO Generate down scaled versions?
        const downScale = 1
        let imageDataArgs: ImageDataArgs | undefined
        try {
          imageDataArgs = decodeFrame(jpeg, {
            downScale,
          })
        } catch (error) {
          errorMessageForGetImageData = (error as Error).message ?? ''
        }
        if (imageDataArgs) {
          const [imageData, imageWidth, imageHeight] = imageDataArgs

          if (false) {
            await verifyImageData({ name, downScale, maxMean: 2.3, max: 2.3 })
          }

          await writeImageData(
            createImageData(imageData, imageWidth, imageHeight),
            pngFileName
          )
        }
      }
      if (errorMessageForGetObject != null) {
        if (existsSync(objectFileName)) {
          unlinkSync(objectFileName)
        }
      }
      if (
        errorMessageForGetObject != null ||
        errorMessageForGetImageData != null
      ) {
        if (existsSync(pngFileName)) {
          unlinkSync(pngFileName)
        }
      }
      newTestInfo.push({
        name,
        description,
        errorMessageForGetObject,
        errorMessageForGetImageData,
      })
    }

    const readme = buildReadme(newTestInfo)
    writeFileSync(`${imageDir}/README.md`, readme)

    console.log('OK')
  } catch (e) {
    console.log(e)
  }
})()
