import fs from 'fs'
import sharp from 'sharp'

export const range = (length: number) => {
  const result: number[] = []
  for (let i = 0; i < length; i += 1) {
    result.push(i)
  }
  return result
}

export const readImageFile = (fileName: string) =>
  new Uint8Array(fs.readFileSync(`src/__tests__/images/${fileName}`))

export const writeImageDataToPng = async (
  { data, width, height }: ImageData,
  fileName: string
) => {
  await sharp(Buffer.from(data), { raw: { width, height, channels: 4 } })
    .removeAlpha()
    .toFile(`src/__tests__/images/${fileName}.png`)
}

export const readImageDataFromPng = async (
  fileName: string
): Promise<ImageData> => {
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
