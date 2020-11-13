import { DQT, Marker, zigZag } from './jpeg'
import { setUint16, setHiLow } from './jpeg.encode'

export const getDqtLength = (dqt: DQT) =>
  dqt.tables.reduce((length, { bytes }) => length + bytes * 64 + 1, 4)

const setUint8or16 = (bytes: 1 | 2) =>
  bytes === 1
    ? (data: Uint8Array, offset: number, value: number) => {
        data[offset] = value
      }
    : setUint16

export const encodeDQT = (dqt: DQT, offset: number, buffer: Uint8Array) => {
  buffer[offset++] = 0xff
  buffer[offset++] = Marker.DQT
  const length = getDqtLength(dqt) - 2
  const { tables } = dqt
  setUint16(buffer, offset, length)
  offset += 2
  for (const { id, bytes, values } of tables) {
    buffer[offset++] = setHiLow(bytes - 1, id)
    const setUint = setUint8or16(bytes)
    for (let i = 0; i < 64; i += 1) {
      setUint(buffer, offset + i * bytes, values[zigZag[i]])
    }
    offset += bytes * 64
  }
  return offset
}
