import { DQT, MARKER_DQT, zigZag } from './jpeg'
import { setUint16, setHiLow } from './encode'

export const getDqtLength = (dqt: DQT) => dqt.bytes * 64 + 5

const setUint8or16 = (bytes: 1 | 2) =>
  bytes === 1
    ? (data: Uint8Array, offset: number, value: number) => {
        data[offset] = value
      }
    : setUint16

export const encodeDQT = (
  { id, bytes, values }: DQT,
  offset: number,
  buffer: Uint8Array
) => {
  buffer[offset++] = 0xff
  buffer[offset++] = MARKER_DQT
  const length = bytes * 64 + 3
  setUint16(buffer, offset, length)
  offset += 2
  buffer[offset++] = setHiLow(bytes - 1, id)
  const setUint = setUint8or16(bytes)
  for (let i = 0; i < 64; i += 1) {
    setUint(buffer, offset + i * bytes, values[zigZag[i]])
  }
  return offset + length - 3
}
