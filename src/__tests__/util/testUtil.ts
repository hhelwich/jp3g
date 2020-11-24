import fs from 'fs'
import sharp from 'sharp'
import { range } from '../../util'

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
