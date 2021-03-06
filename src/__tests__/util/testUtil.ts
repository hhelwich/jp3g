import { readFileSync } from 'fs'
import sharp from 'sharp'
import { JPEG } from '../../jpeg'

const { abs } = Math

export const imageDir = 'src/__tests__/images'

export const range = (length: number) => {
  const result: number[] = []
  for (let i = 0; i < length; i += 1) {
    result.push(i)
  }
  return result
}

export const getJpegBuffer = (fileName: string) =>
  readFileSync(`${imageDir}/${fileName}.jpg`)

export const writeImageDataToPng = async (
  { data, width, height }: ImageData,
  fileName: string
) => {
  await sharp(Buffer.from(data), { raw: { width, height, channels: 4 } })
    .removeAlpha()
    .toFile(`${imageDir}/${fileName}.png`)
}

export const getExpectedImageData = async (
  fileName: string
): Promise<ImageData> => {
  fileName = `${imageDir}/${fileName}.png`
  const image = sharp(fileName).raw().ensureAlpha()
  const [{ width, height }, data] = await Promise.all([
    image.metadata(),
    image.toBuffer(),
  ])
  return {
    width: width!,
    height: height!,
    data: new Uint8ClampedArray(data),
  }
}

export const getExpectedJpeg = async (fileName: string): Promise<JPEG> =>
  (await import(`../images/${fileName}`)).default

/**
 * Return a list of integers, evenly scaled from 0 to max.
 */
export const scaledRange = (max: number) => (count: number) =>
  range(count).map(i => Math.round((max * i) / (count - 1)))

export const round = (precision: number) => (x: number) => +x.toFixed(precision)

/**
 * Root mean squared error
 */
export const rmse = (xs: number[], ys: number[]) => {
  const { length } = xs
  if (ys.length !== length) {
    throw Error('Invalid vector sizes')
  }
  return Math.sqrt(xs.reduce((s, x, i) => s + (x - ys[i]) ** 2, 0) / length)
}

/**
 * Returns random 8x8 matrix with values in the range 0...255.
 */
export const randomSamples = () =>
  [...Array(64)].map(() => Math.floor(Math.random() * 256))

export const randomQTable = (bytes: 1 | 2 = 1) =>
  [...Array(64)].map(() => {
    let q: number
    do {
      q = Math.floor(Math.random() * 2 ** (8 * bytes))
    } while (q === 0)
    return q
  })

/**
 * Convert a callback style function to a Promise style function.
 */
export const promisify = (fn: (...args: any[]) => any) => (...args: any[]) =>
  new Promise<any>((resolve, reject) => {
    fn(...args, (error: any, result: any) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })

export const greatestCommonDivisor = (a: number, b: number) => {
  if (a === 0) {
    return abs(b)
  }
  if (b === 0) {
    return abs(a)
  }
  do {
    ;[a, b] = [b, a % b]
  } while (b !== 0)
  return abs(a)
}

export const reduceFraction = (a: number, b: number) => {
  const gcd = greatestCommonDivisor(a, b)
  return [a / gcd, b / gcd]
}

export const sleep = (ms?: number) =>
  new Promise(resolve => {
    setTimeout(resolve, ms)
  })

export const getTime = () => process.hrtime.bigint()

/**
 * Get all ArrayBuffers used in a JPEG object.
 */
export const getJpegArrayBuffers = (jpeg: JPEG): ArrayBuffer[] => {
  const buffers: Set<ArrayBuffer> = new Set()
  const iterate = (obj: any) => {
    Object.keys(obj).forEach(key => {
      const child = obj[key]
      if (child instanceof Uint8Array) {
        buffers.add(child.buffer)
      } else if (typeof child === 'object') {
        iterate(child)
      }
    })
  }
  iterate(jpeg)
  return Array.from(buffers)
}

const testImageReadmeFileName = `${imageDir}/README.md`

export type TestImageSpec = {
  name: string
  description: string
  errorMessageForGetObject?: string
  errorMessageForGetImageData?: string
}

const getTestImageSpec = ([
  name,
  description,
  actualJPEG,
  expectedImage,
  expectedObject,
]: string[]): TestImageSpec => {
  const errorGetObject = expectedObject.match(/⚠️ (.*)/)?.[1]
  const errorGetImageData = expectedImage.match(/⚠️ (.*)/)?.[1]
  return {
    name,
    description,
    errorMessageForGetObject: errorGetObject,
    errorMessageForGetImageData: errorGetImageData,
  }
}

export const getTestImageSpecs = () =>
  readFileSync(testImageReadmeFileName)
    .toString()
    .split('\n') // Get rows
    .filter(row => row.trim().length > 0) // Remove empty rows
    .slice(3) // Remove table header
    .map(
      row =>
        row
          .split('|') // Get columns
          .slice(1, 6) // Get real columns
          .map(col => col.trim()) // Trim
    )
    .map(getTestImageSpec)
