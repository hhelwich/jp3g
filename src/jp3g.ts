import { version as _version } from '../package.json'
import { isWorker } from './isNodeOrWorker'

// Create variable for correct type in d.ts file
export const version = _version

export const decode = async (buffer: ArrayBuffer) => {
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

if (isWorker) {
  onmessage = async ({ data: { action, buffer } }) => {
    if (action === 'decode') {
      const { width, height, data } = await decode(buffer)
      postMessage({ msg: 'foo', width, height, data }, [data])
    }
  }
}
