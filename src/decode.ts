import { InvalidJpegError } from './InvalidJpegError'

const getUint16 = (data: Uint8Array, offset: number) =>
  (data[offset] << 8) | data[offset + 1]

const isRestartMarker = (marker: number) => 0xd0 <= marker && marker <= 0xd7

const MARKER_SOI = 0xd8 // Start of image
const MARKER_COM = 0xfe // Comment
const MARKER_DQT = 0xdb // Define quantization tables
const MARKER_DHT = 0xc4 // Define huffman table
const MARKER_SOS = 0xda // Start of scan
const MARKER_EOI = 0xd9 // End of image

/**
 * Returns true if marker is APP0-APP15 (application-specific data)
 */
const isAppMarker = (marker: number) => 0xe0 <= marker && marker <= 0xef

const isMarkerSOF = (marker: number) =>
  0xc0 <= marker &&
  marker <= 0xcf &&
  marker !== MARKER_DHT &&
  marker !== 0xc8 /* Reserved */ &&
  marker !== 0xcc /* DAC (Define arithmetic coding conditions) */

export interface Jpeg {
  struct: {
    type: number
    data?: number
  }[]
  data: Uint8Array[]
}

/**
 *
 * @param jpeg
 */
export const decode = (jpeg: Uint8Array): Jpeg => {
  // JPEG must start with a SOI marker
  if (jpeg[0] !== 0xff || jpeg[1] !== MARKER_SOI) {
    throw new InvalidJpegError('Missing SOI marker')
  }

  // The last marker in the file must be an EOI, and it must immediately follow
  // the compressed data of the last scan in the image.
  const struct: ({ type: number; data?: number })[] = [{ type: MARKER_SOI }]
  let data: Uint8Array[] = []
  let segEnd = 2 // End of the current segment
  const { length } = jpeg

  outer: for (let offset = segEnd; offset < length; offset += 1) {
    let byte = jpeg[offset]
    if (byte !== 0xff) {
      if (offset === segEnd) {
        // First byte of marker must be ff
        throw new InvalidJpegError('Invalid marker')
      }
      // Set segment start after marker so segStart + segLength === segEnd
      const segStart = ++offset
      if (byte === MARKER_SOS) {
        for (; offset < length; offset += 1) {
          byte = jpeg[offset]
          if (byte === 0xff) {
            byte = jpeg[offset + 1]
            if (byte === 0 || isRestartMarker(byte)) {
              // ff00 is used to represent the value ff in the output stream => no marker
              continue
            }
            segEnd = offset
            struct.push({ type: MARKER_SOS, data: data.length })
            data.push(jpeg.subarray(segStart, segEnd))
            continue outer
          }
        }
        break
      } else if (byte === MARKER_EOI) {
        struct.push({ type: byte })
        return {
          struct,
          data,
        }
      } else {
        const segLength = getUint16(jpeg, offset)
        offset = segEnd = segStart + segLength
        const dataRef = data.length
        data.push(jpeg.subarray(segStart, segEnd))
        struct.push({ type: byte, data: dataRef })
      }
    }
  }
  throw new InvalidJpegError('Unexpected end of buffer')
}
