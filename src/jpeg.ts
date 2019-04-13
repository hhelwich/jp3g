export const MARKER_SOI = 0xd8 // Start of image
export const MARKER_COM = 0xfe // Comment
export const MARKER_DQT = 0xdb // Define quantization tables
export const MARKER_DHT = 0xc4 // Define huffman table
export const MARKER_SOS = 0xda // Start of scan
export const MARKER_EOI = 0xd9 // End of image
export const MARKER_SOF0 = 0xc0 // Start of frame, baseline

// Map zigzag ordered list index to original 8x8 matrix index
// prettier-ignore
export const zigZag = new Uint8Array([
   0,  1,  8, 16,  9,  2,  3, 10,
  17, 24, 32, 25, 18, 11,  4,  5,
  12, 19, 26, 33, 40, 48, 41, 34,
  27, 20, 13,  6,  7, 14, 21, 28,
  35, 42, 49, 56, 57, 50, 43, 36,
  29, 22, 15, 23, 30, 37, 44, 51,
  58, 59, 52, 45, 38, 31, 39, 46,
  53, 60, 61, 54, 47, 55, 62, 63,
])

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
  text: string
}

export interface DQT_TABLE {
  id: 0 | 1 | 2 | 3
  bytes: 1 | 2
  values: number[]
}

export interface DQT {
  type: 'DQT'
  tables: DQT_TABLE[]
}

/**
 * Huffman tree realized as interleaved arrays. The array indices are the code
 * bits and the number nodes are the 1-byte symbols.
 */
export interface HuffmanTree extends Array<HuffmanTree | number> {}

export interface DHT_TABLE {
  cls: number
  id: number
  tree: HuffmanTree
}

export interface DHT {
  type: 'DHT'
  tables: DHT_TABLE[]
}

export interface SOF {
  type: 'SOF'
  frameType: number
  precision: number
  width: number
  height: number
  components: ({
    id: number
    h: number
    v: number
    qId: number
  })[]
}

export interface SOS {
  type: 'SOS'
  data: Uint8Array
  components: { id: number; dcTbl: number; acTbl: number }[]
  specStart: number
  specEnd: number
  ah: number
  al: number
}

export interface EOI {
  type: 'EOI'
}

export type Segment = SOI | APP | COM | DQT | DHT | SOF | SOS | EOI

export type Jpeg = Segment[]
