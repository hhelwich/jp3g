import { DQT, Marker, zigZag } from './jpeg'
import { setUint16, setHiLow } from './common.encode'

export const getDqtLength = (dqt: DQT) =>
  dqt.tables.reduce((length, { data }) => length + data.byteLength + 1, 4)

const setUint8or16 = (size: 0 | 1) =>
  size
    ? setUint16
    : (data: Uint8Array, offset: number, value: number): number => {
        data[offset++] = value
        return offset
      }

export const encodeDQT = (dqt: DQT, offset: number, buffer: Uint8Array) => {
  buffer[offset++] = 0xff
  buffer[offset++] = Marker.DQT
  const length = getDqtLength(dqt) - 2
  const { tables } = dqt
  offset = setUint16(buffer, offset, length)
  for (const { id, data } of tables) {
    const size = (data.BYTES_PER_ELEMENT - 1) as 0 | 1
    buffer[offset++] = setHiLow(size, id)
    const setUint = setUint8or16(size)
    for (let i = 0; i < 64; i += 1) {
      offset = setUint(buffer, offset, data[zigZag[i]])
    }
  }
  return offset
}
