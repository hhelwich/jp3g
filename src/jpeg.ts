export const enum Marker {
  SOI = 0xd8, // Start of image
  COM = 0xfe, // Comment
  DQT = 0xdb, // Define quantization tables
  DHT = 0xc4, // Define huffman table
  SOS = 0xda, // Start of scan
  EOI = 0xd9, // End of image
  SOF0 = 0xc0, // Start of frame, baseline
}

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

export const SOI = 'SOI'
export const EOI = 'EOI'
export const COM = 'COM'
export const APP = 'APP'
export const JFIF = 'JFIF'
export const DHT = 'DHT'
export const DQT = 'DQT'
export const SOF = 'SOF'
export const SOS = 'SOS'

export const enum JFIFUnits {
  PixelAspectRatio = 0,
  DotsPerInch = 1,
  DotsPerCm = 2,
}

export type SOI = {
  type: typeof SOI
}

export type JFIF = {
  type: typeof JFIF
  version: [number, number]
  units: number
  density: { x: number; y: number }
  thumbnail?: { x: number; y: number; data: Uint8Array }
}

export type APP = {
  type: typeof APP
  appType: number
  data: Uint8Array
}

export type COM = {
  type: typeof COM
  text: string
}

export type QuantizationTable = Uint8Array | Uint16Array

export type DQT = {
  type: typeof DQT
  tables: {
    id: 0 | 1 | 2 | 3
    values: QuantizationTable
  }[]
}

/**
 * Huffman tree realized as interleaved arrays. The array indices are the code
 * bits and the number nodes are the 1-byte symbols.
 */
export interface HuffmanTree extends Array<HuffmanTree | number> {}

export type DHT_TABLE = {
  /**
   * Can store integers from 0 to 15 but only 0 (DC) or 1 (AC) are valid.
   */
  cls: number
  /**
   * Can store integers from 0 to 15 but only 0, 1 are valid for baseline frames
   * and 0 to 3 are valid for extended and progressive frames.
   */
  id: number
  tree: HuffmanTree
}

export type DHT = {
  type: typeof DHT
  tables: DHT_TABLE[]
}

export type SOF = {
  type: typeof SOF
  frameType: number
  /** Sample precision in bits (8, 12). */
  precision: number
  /** Image width in pixels */
  width: number
  /** Image height in pixels */
  height: number
  components: {
    /**
     * Component id (0,1,…,255).
     * For JFIF they have the order and id Y=1, Cb=2, Cr=3. But not all encoders
     * follow the spec for the ids so we will only use the order to determine
     * the component.
     */
    id: number
    /**
     * Horizontal sampling factor. Can encode/decode integers from 0 to 15 but
     * only values 1-4 are allowed.
     * h * v = Number of data units that are used for that component in one MCU
     * for an interleaved scan.
     */
    h: number
    /**
     * Vertical sampling factor. Can encode/decode integers from 0 to 15 but
     * only values 1-4 are allowed.
     */
    v: number
    /** The id of the quantization table for this component. */
    qId: number
  }[]
}

export type SOS = {
  type: typeof SOS
  data: Uint8Array
  components: { id: number; dcId: number; acId: number }[]
  specStart: number
  specEnd: number
  ah: number
  al: number
}

export type EOI = {
  type: typeof EOI
}

export type Segment = SOI | JFIF | APP | COM | DQT | DHT | SOF | SOS | EOI

export type Jpeg = Segment[]
