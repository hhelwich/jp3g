export const setUint16 = (data: Uint8Array, offset: number, value: number) => {
  data[offset++] = value >> 8
  data[offset++] = value & 0xff
  return offset
}

export const setHiLow = (high: number, low: number) => (high << 4) | low
