import { APP, COM, JFIF, Marker } from './jpeg'
import { setUint16 } from './common.encode'

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

export const getJfifLength = (segment: JFIF) =>
  (segment.thumbnail?.data.length ?? 0) + 18

/**
 * Encode a JFIF APP0 segment.
 */
export const encodeJFIF = (jfif: JFIF, offset: number, buffer: Uint8Array) => {
  const data = new Uint8Array(getJfifLength(jfif) - 4)
  const { version, units, density, thumbnail } = jfif
  let offset2 = setStringToBuffer(jfifStr, 0, data)
  data[offset2++] = version[0]
  data[offset2++] = version[1]
  data[offset2++] = units
  offset2 = setUint16(data, offset2, density.x)
  offset2 = setUint16(data, offset2, density.y)
  if (thumbnail) {
    data[offset2++] = thumbnail.x
    data[offset2++] = thumbnail.y
    data.set(thumbnail.data, offset2)
  } else {
    setUint16(data, offset2, 0)
  }
  return encodeAPP({ type: 'APP', appType: 0, data }, offset, buffer)
}
