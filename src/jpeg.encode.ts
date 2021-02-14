import {
  Marker,
  JPEG,
  Segment,
  SOF,
  SOS,
  DHT,
  SOI,
  EOI,
  APP,
  JFIF,
  COM,
  DQT,
  DRI,
  DAC,
} from './jpeg'
import { getDhtLength, encodeDHT } from './huffmanTable.encode'
import { encodeDQT, getDqtLength } from './quantizationTable.encode'
import { encodeAPP, encodeCOM, encodeJFIF, getJfifLength } from './app.encode'
import { setUint16, setHiLow } from './common.encode'

const createBuffer = (size: number) => new Uint8Array(size)

const getSofLength = (sof: SOF) => 10 + sof.components.length * 3
const getSosLength = (sos: SOS) =>
  sos.components.length * 2 + 8 + sos.data.length

const segmentLength = (segment: Segment): number => {
  switch (segment.type) {
    case SOI:
      return 2
    case EOI:
      return 2 + (segment.data ? segment.data.length : 0)
    case APP:
    case DAC:
      return segment.data.length + 4
    case JFIF:
      return getJfifLength(segment)
    case COM:
      return segment.text.length + 4
    case DQT:
      return getDqtLength(segment)
    case SOF:
      return getSofLength(segment)
    case DHT:
      return getDhtLength(segment)
    case DRI:
      return 6
    case SOS:
      return getSosLength(segment)
  }
}

const encodeSOF = (segment: SOF, offset: number, buffer: Uint8Array) => {
  buffer[offset++] = 0xff
  buffer[offset++] = Marker.SOF0 | segment.frameType
  offset = setUint16(buffer, offset, getSofLength(segment) - 2)
  buffer[offset++] = segment.precision
  offset = setUint16(buffer, offset, segment.height)
  offset = setUint16(buffer, offset, segment.width)
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
  offset = setUint16(buffer, offset, length)
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

const encodeDRI = (segment: DRI, offset: number, buffer: Uint8Array) => {
  buffer[offset++] = 0xff
  buffer[offset++] = Marker.DRI
  offset = setUint16(buffer, offset, 4)
  return setUint16(buffer, offset, segment.ri)
}

const encodeDAC = ({ data }: DAC, offset: number, buffer: Uint8Array) => {
  buffer[offset++] = 0xff
  buffer[offset++] = Marker.DAC
  offset = setUint16(buffer, offset, data.length + 2)
  buffer.set(data, offset)
  return offset + data.length
}

const encodeSegment = (
  segment: Segment,
  offset: number,
  buffer: Uint8Array
) => {
  switch (segment.type) {
    case SOI:
      buffer[offset++] = 0xff
      buffer[offset++] = Marker.SOI
      break
    case JFIF: {
      offset = encodeJFIF(segment, offset, buffer)
      break
    }
    case APP: {
      offset = encodeAPP(segment, offset, buffer)
      break
    }
    case COM: {
      offset = encodeCOM(segment, offset, buffer)
      break
    }
    case DQT:
      return encodeDQT(segment, offset, buffer)
    case SOF:
      return encodeSOF(segment, offset, buffer)
    case DHT:
      return encodeDHT(segment, offset, buffer)
    case DRI:
      return encodeDRI(segment, offset, buffer)
    case DAC:
      return encodeDAC(segment, offset, buffer)
    case SOS:
      return encodeSOS(segment, offset, buffer)
    case EOI:
      buffer[offset++] = 0xff
      buffer[offset++] = Marker.EOI
      const { data } = segment
      if (data) {
        buffer.set(data, offset)
      }
      break
  }
  return offset
}

export const encodeJpeg = (jpeg: JPEG): Uint8Array => {
  const size = jpeg.reduce((sum, segment) => sum + segmentLength(segment), 0)
  const buffer = createBuffer(size)
  let offset = 0
  for (const segment of jpeg) {
    offset = encodeSegment(segment, offset, buffer)
  }
  return buffer
}
