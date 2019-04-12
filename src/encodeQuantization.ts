import { DQT, MARKER_DQT } from './jpeg'
import { setUint16, setHiLow } from './encode'

export const encodeDQT = (segment: DQT, offset: number, buffer: Uint8Array) => {
  buffer[offset++] = 0xff
  buffer[offset++] = MARKER_DQT
  const length = segment.bytes * 64 + 3
  setUint16(buffer, offset, length)
  offset += 2
  buffer[offset++] = setHiLow(segment.bytes - 1, segment.id)
  if (segment.bytes === 1) {
    buffer.set(segment.values, offset)
  } else {
    for (let i = 0; i < 64; i += 1) {
      setUint16(buffer, offset + i * 2, segment.values[i])
    }
  }
  return offset + length - 3
}
