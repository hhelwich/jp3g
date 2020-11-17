import { Marker, Jpeg, Segment, SOF, SOS } from './jpeg'
import { getDhtLength, encodeDHT } from './huffmanTable.encode'
import { encodeDQT, getDqtLength } from './quantizationTable.encode'

export const setUint16 = (data: Uint8Array, offset: number, value: number) => {
  data[offset] = value >> 8
  data[offset + 1] = value & 0xff
}

export const setHiLow = (high: number, low: number) => (high << 4) | low

const createBuffer = (size: number) => new Uint8Array(size)

const getSofLength = (sof: SOF) => 10 + sof.components.length * 3
const getSosLength = (sos: SOS) =>
  sos.components.length * 2 + 8 + sos.data.length

const segmentLength = (segment: Segment): number => {
  switch (segment.type) {
    case 'SOI':
    case 'EOI':
      return 2
    case 'APP':
      return segment.data.length + 4
    case 'COM':
      return segment.text.length + 4
    case 'DQT':
      return getDqtLength(segment)
    case 'SOF':
      return getSofLength(segment)
    case 'DHT':
      return getDhtLength(segment)
    case 'SOS':
      return getSosLength(segment)
  }
}

const encodeSOF = (segment: SOF, offset: number, buffer: Uint8Array) => {
  buffer[offset++] = 0xff
  buffer[offset++] = Marker.SOF0 | segment.frameType
  setUint16(buffer, offset, getSofLength(segment) - 2)
  offset += 2
  buffer[offset++] = segment.precision
  setUint16(buffer, offset, segment.height)
  offset += 2
  setUint16(buffer, offset, segment.width)
  offset += 2
  buffer[offset++] = segment.components.length
  for (const component of segment.components) {
    buffer[offset++] = component.id
    buffer[offset++] = setHiLow(component.h, component.v)
    buffer[offset++] = component.qId
  }
  return offset
}

const encodeSOS = (segment: SOS, offset: number, buffer: Uint8Array) => {
  buffer[offset++] = 0xff
  buffer[offset++] = Marker.SOS
  const length = segment.components.length * 2 + 6
  setUint16(buffer, offset, length)
  offset += 2
  buffer[offset++] = segment.components.length
  for (const { id, dcId, acId } of segment.components) {
    buffer[offset++] = id
    buffer[offset++] = setHiLow(dcId, acId)
  }
  buffer[offset++] = segment.specStart
  buffer[offset++] = segment.specEnd
  buffer[offset++] = setHiLow(segment.ah, segment.al)
  buffer.set(segment.data, offset)
  return offset + segment.data.length
}

const encodeSegment = (
  segment: Segment,
  offset: number,
  buffer: Uint8Array
) => {
  switch (segment.type) {
    case 'SOI':
      buffer[offset++] = 0xff
      buffer[offset++] = Marker.SOI
      break
    case 'APP': {
      buffer[offset++] = 0xff
      buffer[offset++] = 0xe0 | segment.appType
      const length = segment.data.length + 2
      setUint16(buffer, offset, length)
      buffer.set(segment.data, offset + 2)
      offset += length
      break
    }
    case 'COM': {
      buffer[offset++] = 0xff
      buffer[offset++] = Marker.COM
      const length = segment.text.length
      setUint16(buffer, offset, length + 2)
      offset += 2
      for (let i = 0; i < length; i += 1) {
        buffer[offset + i] = segment.text.charCodeAt(i)
      }
      offset += length
      break
    }
    case 'DQT':
      return encodeDQT(segment, offset, buffer)
    case 'SOF':
      return encodeSOF(segment, offset, buffer)
    case 'DHT':
      return encodeDHT(segment, offset, buffer)
    case 'SOS':
      return encodeSOS(segment, offset, buffer)
    case 'EOI':
      buffer[offset++] = 0xff
      buffer[offset++] = Marker.EOI
      break
  }
  return offset
}

export const encodeJpeg = (jpeg: Jpeg): Uint8Array => {
  const size = jpeg.reduce((sum, segment) => sum + segmentLength(segment), 0)
  const buffer = createBuffer(size)
  let offset = 0
  for (const segment of jpeg) {
    offset = encodeSegment(segment, offset, buffer)
  }
  return buffer
}