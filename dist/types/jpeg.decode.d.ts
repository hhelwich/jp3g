import { SOF, JPEG } from './jpeg';
/**
 * Decode SOF (Start of frame) segment
 */
export declare const decodeSOF: (frameType: number, data: Uint8Array) => SOF;
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
export declare const getDiff: (partialDiff: number, bitLength: number) => number;
/**
 *
 * @param jpeg
 */
export declare const decodeJpeg: (jpeg: Uint8Array) => JPEG;
