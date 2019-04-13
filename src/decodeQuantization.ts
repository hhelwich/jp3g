import { DQT, zigZag } from './jpeg'
import { getHiLow, getUint16 } from './decode'
import { InvalidJpegError } from './InvalidJpegError'

const getUint8or16 = (bytes: 1 | 2) =>
  bytes === 1 ? (data: Uint8Array, offset: number) => data[offset] : getUint16

export const decodeDQT = (data: Uint8Array): DQT => {
  // First byte is ignored (length of the segment)
  // The 4 low-order bits are the table identifier (0, 1, 2, or 3).
  // The 4 high-order bits specify the quanization value size
  // (0 = 1 byte, 1 = 2 bytes).
  const [size, id] = <[0 | 1, 0 | 1 | 2 | 3]>getHiLow(data[0])
  if (id < 0 || id > 3) {
    throw new InvalidJpegError('invalid quantization table identifier')
  }
  if (size < 0 || size > 1) {
    throw new InvalidJpegError('invalid quantization value size')
  }
  const bytes = <1 | 2>(size + 1)
  if (bytes * 64 + 1 !== data.length) {
    throw new InvalidJpegError('invalid segment length')
  }
  const values: number[] = Array(64)
  const getUint = getUint8or16(bytes)
  for (let i = 0; i < 64; i += 1) {
    values[zigZag[i]] = getUint(data, i * bytes + 1)
  }
  return {
    type: 'DQT',
    id,
    bytes,
    values,
  }
}
