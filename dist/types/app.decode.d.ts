import { APP, COM, JFIF } from './jpeg';
/**
 * Returns true if marker is APP0-APP15 (application-specific data)
 */
export declare const isAppMarker: (marker: number) => boolean;
/**
 * Returns true if the APP segment is of type APP0 and starts with the given
 * identifier terminated by zero.
 */
export declare const isCustomApp0: (identifier: string) => ({ appType, data }: APP) => boolean;
/**
 * Returns true if the given APP segment is a JFIF segment.
 */
export declare const isJFIF: ({ appType, data }: APP) => boolean;
/**
 * Decode a comment segment.
 */
export declare const decodeCOM: (data: Uint8Array) => COM;
/**
 * Decode an APP segment.
 */
export declare const decodeAPP: (appType: number, data: Uint8Array) => APP | JFIF;
