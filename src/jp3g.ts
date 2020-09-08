import { version as _version } from '../package.json'
import { workerFunction } from './workers'
export { setWorker } from './workers'

// Create variable for correct type in d.ts file
export const version = _version

const _decode = async (
  jpegData: ArrayBuffer
): Promise<{
  width: number
  height: number
  data: ArrayBuffer
}> => {
  const width = 8
  const height = 8
  const data = new Uint8ClampedArray(width * height * 4)
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      data[y * width * 4 + x * 4] = Math.floor(Math.random() * 256)
      data[y * width * 4 + x * 4 + 1] = Math.floor(Math.random() * 256)
      data[y * width * 4 + x * 4 + 2] = Math.floor(Math.random() * 256)
      data[y * width * 4 + x * 4 + 3] = 255
    }
  }
  return { width, height, data: data.buffer }
}

export const decode = workerFunction(
  _decode,
  fnIn => fnIn,
  fnOut => [fnOut.data]
)
