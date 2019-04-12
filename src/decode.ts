import { InvalidJpegError } from './InvalidJpegError'
import {
  APP,
  COM,
  SOF,
  Jpeg,
  MARKER_SOI,
  MARKER_COM,
  MARKER_DQT,
  MARKER_DHT,
  MARKER_SOF0,
  MARKER_SOS,
  MARKER_EOI,
} from './jpeg'
import { decodeDHT } from './huffman-decode'
import { decodeDQT } from './decodeQuantization'

export const getUint16 = (data: Uint8Array, offset: number) =>
  (data[offset] << 8) | data[offset + 1]

const isRestartMarker = (marker: number) => 0xd0 <= marker && marker <= 0xd7

/**
 * Returns true if marker is APP0-APP15 (application-specific data)
 */
const isAppMarker = (marker: number) => 0xe0 <= marker && marker <= 0xef

const isMarkerSOF = (marker: number) =>
  MARKER_SOF0 <= marker &&
  marker <= 0xcf &&
  marker !== MARKER_DHT &&
  marker !== 0xc8 /* Reserved */ &&
  marker !== 0xcc /* DAC (Define arithmetic coding conditions) */

/**
 * Split a byte in high and low part
 */
export const getHiLow = (byte: number) => [byte >> 4, byte & 0xf]

export const decodeAPP = (appType: number, data: Uint8Array): APP => ({
  type: 'APP',
  appType,
  data,
})

export const decodeCOM = (data: Uint8Array): COM => ({
  type: 'COM',
  text: String.fromCharCode.apply(null, <any>data),
})

/**
 * Decode SOF (Start of frame) segment
 */
export const decodeSOF = (frameType: number, data: Uint8Array): SOF => {
  const precision = data[0] // Sample precision in bits (can be 8 or 12)
  const height = getUint16(data, 1) // Image height in pixels
  const width = getUint16(data, 3) // Image width in pixels
  const compCount = data[5] // Number of components in the image
  if (data.length !== compCount * 3 + 6) {
    throw new InvalidJpegError('Invalid segment length')
  }
  let offset = 6
  const components = []
  for (let i = 0; i < compCount; i += 1) {
    // Component identifier
    // JPEG allows this to be 0 to 255. JFIF restricts it to 1 (Y), 2 (Cb), or 3 (Cr)
    const id = data[offset++]
    // The 4 high-order bits specify the horizontal sampling for the component
    // The 4 low-order bits specify the vertical sampling
    // Either value can be 1-4 according to the standard
    const [h, v] = getHiLow(data[offset++])
    // The quantization table identifier for the component. Corresponds to the identifier in a DQT marker. Can be 0, 1, 2, or 3
    const qId = data[offset++]
    components.push({ id, h, v, qId })
  }
  return {
    type: 'SOF',
    frameType,
    precision,
    width,
    height,
    components,
  }
}

/**
 * Converts the partially decoded diff value with given bit length to final
 * diff value. See figure F.12 in [1]
 *
 * So e.g. for bitLength := 2 this maps values 0-3 to -3, -2, 2, 3
 *
 * @param partialDiff Integer 0 <= partialDiff < 2^bitLength
 * @param bitLength Must be 0 <= bitLength <= 31 here otherwise result is
 *                  wrong.
 * TODO Can bitLength be higher? Spec says byte value (0-255)
 */
export const getDiff = (partialDiff: number, bitLength: number) =>
  partialDiff < 1 << (bitLength - 1)
    ? partialDiff + ((-1 << bitLength) + 1)
    : partialDiff

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
  const result: Jpeg = [{ type: 'SOI' }]
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
        const headerLength = getUint16(jpeg, offset)
        offset += 2
        const componentCount = jpeg[offset++]
        const components: ({ id: number; dcTbl: number; acTbl: number })[] = []
        for (let i = 0; i < componentCount; i += 1) {
          const id = jpeg[offset++]
          const [dcTbl, acTbl] = getHiLow(jpeg[offset++])
          components.push({ id, dcTbl, acTbl })
        }
        // Next 3 bytes are only used in progressive mode
        const specStart = jpeg[offset++] // Spectral selection start (0-63)
        const specEnd = jpeg[offset++] // Spectral selection end (0-63)
        // Successive approximation (two 4-bit fields, each with a value in the range 0-13)
        const [ah, al] = getHiLow(jpeg[offset++])

        // offset === segStart + headerLength
        for (; offset < length; offset += 1) {
          byte = jpeg[offset]
          if (byte === 0xff) {
            byte = jpeg[offset + 1]
            if (byte === 0 || isRestartMarker(byte)) {
              // ff00 is used to represent the value ff in the output stream => no marker
              continue
            }
            segEnd = offset
            result.push({
              type: 'SOS',
              components,
              specStart,
              specEnd,
              ah,
              al,
              data: jpeg.subarray(segStart + headerLength, segEnd),
            })
            continue outer
          }
        }
        break
      } else if (byte === MARKER_EOI) {
        result.push({ type: 'EOI' })
        // TODO Add segment if data after EOI
        return result
      } else {
        const segLength = getUint16(jpeg, offset)
        if (segLength < 2) {
          throw new InvalidJpegError('Invalid segment length')
        }
        offset = segEnd = segStart + segLength
        const d = jpeg.subarray(segStart + 2, segEnd)
        if (byte === MARKER_DQT) {
          result.push(decodeDQT(d))
        } else if (byte === MARKER_DHT) {
          result.push(decodeDHT(d))
        } else if (byte === MARKER_COM) {
          result.push(decodeCOM(d))
        } else if (isAppMarker(byte)) {
          result.push(decodeAPP(byte & 0xf, d))
        } else if (isMarkerSOF(byte)) {
          result.push(decodeSOF(byte & 0xf, d))
        } else {
          throw new InvalidJpegError('Unknown marker')
        }
      }
    }
  }
  throw new InvalidJpegError('Unexpected end of buffer')
}

// Sources:
// [1] https://www.w3.org/Graphics/JPEG/itu-t81.pdf
