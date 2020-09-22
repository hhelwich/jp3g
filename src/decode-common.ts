export const getUint16 = (data: Uint8Array, offset: number) =>
  (data[offset] << 8) | data[offset + 1]

/**
 * Split a byte in high and low part
 */
export const getHiLow = (byte: number) => [byte >> 4, byte & 0xf]
