import { version as _version } from '../package.json'

// Create variable for correct type in d.ts file
export const version = _version

export const decode = async (buffer: ArrayBuffer) => {
  const width = 8
  const height = 8
  const imageData = new ImageData(width, height)
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      imageData.data[y * width * 4 + x * 4] = Math.floor(Math.random() * 256)
      imageData.data[y * width * 4 + x * 4 + 1] = Math.floor(
        Math.random() * 256
      )
      imageData.data[y * width * 4 + x * 4 + 2] = Math.floor(
        Math.random() * 256
      )
      imageData.data[y * width * 4 + x * 4 + 3] = 255
    }
  }
  return imageData
}
