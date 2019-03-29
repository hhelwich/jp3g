import {
  Jpeg,
  Segment,
  MARKER_SOI,
  MARKER_EOI,
  MARKER_COM,
  MARKER_DQT,
  MARKER_DHT,
  MARKER_SOF0,
  SOF,
  MARKER_SOS,
} from './jpeg'
import { isNode } from './isNode'

const setUint16 = (data: Uint8Array, offset: number, value: number) => {
  data[offset] = value >> 8
  data[offset + 1] = value & 0xff
}

const setHiLow = (high: number, low: number) => (high << 4) | low

const createBuffer = (size: number) =>
  isNode ? Buffer.alloc(size) : new Uint8Array(size)

const sofLength = (sof: SOF) => 4 + 6 + sof.components.length * 3

const segmentLength = (segment: Segment): number => {
  switch (segment.type) {
    case 'SOI':
    case 'EOI':
      return 2
    case 'APP':
      return segment.data.length + 4
    case 'COM':
      return segment.data.length + 4
    case 'DQT':
      return segment.data.length + 4
    case 'SOF':
      return sofLength(segment)
    case 'DHT':
      return segment.data.length + 4
    case 'SOS':
      return segment.data.length + 2
  }
}

const encodeSOF = (segment: SOF, offset: number, buffer: Uint8Array) => {
  buffer[offset++] = 0xff
  buffer[offset++] = MARKER_SOF0 | segment.frameType
  setUint16(buffer, offset, sofLength(segment) - 2)
  offset += 2
  buffer[offset++] = segment.precision
  setUint16(buffer, offset, segment.height)
  offset += 2
  setUint16(buffer, offset, segment.width)
  offset += 2
  buffer[offset++] = segment.components.length
  for (const component of segment.components) {
    buffer[offset++] = component.id
    buffer[offset++] = setHiLow(component.hs, component.vs)
    buffer[offset++] = component.qId
  }
  return offset
}

const encodeSegment = (
  segment: Segment,
  offset: number,
  buffer: Uint8Array
) => {
  switch (segment.type) {
    case 'SOI':
      buffer[offset++] = 0xff
      buffer[offset++] = MARKER_SOI
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
      buffer[offset++] = MARKER_COM
      const length = segment.data.length + 2
      setUint16(buffer, offset, length)
      buffer.set(segment.data, offset + 2)
      offset += length
      break
    }
    case 'DQT': {
      buffer[offset++] = 0xff
      buffer[offset++] = MARKER_DQT
      const length = segment.data.length + 2
      setUint16(buffer, offset, length)
      buffer.set(segment.data, offset + 2)
      offset += length
      break
    }
    case 'SOF':
      return encodeSOF(segment, offset, buffer)
    case 'DHT': {
      buffer[offset++] = 0xff
      buffer[offset++] = MARKER_DHT
      const length = segment.data.length + 2
      setUint16(buffer, offset, length)
      buffer.set(segment.data, offset + 2)
      offset += length
      break
    }
    case 'SOS': {
      buffer[offset++] = 0xff
      buffer[offset++] = MARKER_SOS
      const length = segment.data.length
      buffer.set(segment.data, offset)
      offset += length
      break
    }
    case 'EOI':
      buffer[offset++] = 0xff
      buffer[offset++] = MARKER_EOI
      break
  }
  return offset
}

export const encode = (jpeg: Jpeg): Uint8Array => {
  const size = jpeg.reduce((sum, segment) => sum + segmentLength(segment), 0)
  const buffer = createBuffer(size)
  let offset = 0
  for (const segment of jpeg) {
    offset = encodeSegment(segment, offset, buffer)
  }
  return buffer
}
