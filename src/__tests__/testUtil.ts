import fs from 'fs'
import sharp from 'sharp'

export const readImageFile = (fileName: string) =>
  new Uint8Array(fs.readFileSync(`src/__tests__/images/${fileName}`))

export const writeImageFile = async (
  { data, width, height }: ImageData,
  fileName: string
) => {
  await sharp(Buffer.from(data), { raw: { width, height, channels: 4 } })
    .removeAlpha()
    .toFile(`src/__tests__/images/${fileName}.png`)
}
