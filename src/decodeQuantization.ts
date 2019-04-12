import { DQT } from './jpeg'
import { getHiLow, getUint16 } from './decode'
import { InvalidJpegError } from './InvalidJpegError'

export const decodeDQT = (data: Uint8Array): DQT => {
  // First byte is ignored (length of the segment)
  // The 4 low-order bits are the table identifier (0, 1, 2, or 3).
  // The 4 high-order bits specify the quanization value size
  // (0 = 1 byte, 1 = 2 bytes).
  const [size, id] = <[0 | 1, 0 | 1 | 2 | 3]>getHiLow(data[2])
  if (id < 0 || id > 3) {
    throw new InvalidJpegError('invalid quantization table identifier')
  }
  if (size < 0 || size > 1) {
    throw new InvalidJpegError('invalid quantization value size')
  }
  const bytes = <1 | 2>(size + 1)
  let values: number[]
  if (bytes === 1) {
    values = Array.from(data.subarray(3))
  } else {
    values = Array(64)
    for (let i = 0; i < 64; i += 1) {
      values[i] = getUint16(data, 3 + i * 2)
    }
  }
  return {
    type: 'DQT',
    id,
    bytes,
    values,
  }
}
