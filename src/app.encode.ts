import { APP, COM, JFIF, Marker } from './jpeg'
import { setUint16 } from './jpeg.encode'

/**
 * Set given string to a buffer.
 */
const setStringToBuffer = (str: string, offset: number, buffer: Uint8Array) => {
  for (let i = 0; i < str.length; i += 1) {
    buffer[offset++] = str.charCodeAt(i)
  }
  return offset
}

/**
 * Encode a comment segment.
 */
export const encodeCOM = (segment: COM, offset: number, buffer: Uint8Array) => {
  buffer[offset++] = 0xff
  buffer[offset++] = Marker.COM
  const length = segment.text.length
  offset = setUint16(buffer, offset, length + 2)
  return setStringToBuffer(segment.text, offset, buffer)
}

/**
 * Encode an APP segment
 */
export const encodeAPP = (segment: APP, offset: number, buffer: Uint8Array) => {
  buffer[offset++] = 0xff
  buffer[offset++] = 0xe0 | segment.appType
  const length = segment.data.length
  offset = setUint16(buffer, offset, length + 2)
  buffer.set(segment.data, offset)
  return offset + length
}

const jfifStr = `${JFIF}\0`

/**
 * Encode a JFIF APP0 segment.
 */
export const encodeJFIF = (
  { version, units, density, thumbnail }: JFIF,
  offset: number,
  buffer: Uint8Array
) => {
  offset = setStringToBuffer(jfifStr, offset, buffer)
  buffer[offset++] = version[0]
  buffer[offset++] = version[1]
  buffer[offset++] = units
  offset = setUint16(buffer, offset, density.x)
  offset = setUint16(buffer, offset, density.y)
  if (thumbnail) {
    buffer[offset++] = thumbnail.x
    buffer[offset++] = thumbnail.y
    buffer.set(thumbnail.data, offset)
    return offset + thumbnail.data.length
  } else {
    return setUint16(buffer, offset, 0)
  }
}
