export const MARKER_SOI = 0xd8 // Start of image
export const MARKER_COM = 0xfe // Comment
export const MARKER_DQT = 0xdb // Define quantization tables
export const MARKER_DHT = 0xc4 // Define huffman table
export const MARKER_SOS = 0xda // Start of scan
export const MARKER_EOI = 0xd9 // End of image
export const MARKER_SOF0 = 0xc0 // Start of frame, baseline

export interface SOI {
  type: 'SOI'
}

export interface APP {
  type: 'APP'
  appType: number
  data: Uint8Array
}

export interface COM {
  type: 'COM'
  data: Uint8Array
}

export interface DQT {
  type: 'DQT'
  data: Uint8Array
}

export interface DHT {
  type: 'DHT'
  data: Uint8Array
}

export interface SOF {
  type: 'SOF'
  frameType: number
  precision: number
  width: number
  height: number
  components: ({
    id: number
    hs: number
    vs: number
    qId: number
  })[]
}

export interface SOS {
  type: 'SOS'
  data: Uint8Array
}

export interface EOI {
  type: 'EOI'
}

export type Segment = SOI | APP | COM | DQT | DHT | SOF | SOS | EOI

export type Jpeg = Segment[]
