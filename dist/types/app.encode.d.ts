import { APP, COM, JFIF } from './jpeg';
/**
 * Encode a comment segment.
 */
export declare const encodeCOM: (segment: COM, offset: number, buffer: Uint8Array) => number;
/**
 * Encode an APP segment
 */
export declare const encodeAPP: (segment: APP, offset: number, buffer: Uint8Array) => number;
export declare const getJfifLength: (segment: JFIF) => number;
/**
 * Encode a JFIF APP0 segment.
 */
export declare const encodeJFIF: (jfif: JFIF, offset: number, buffer: Uint8Array) => number;
