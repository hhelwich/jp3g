/**
 * Quantizate DCT coefficients in encoding.
 */
export const quantize = (qTable: number[]) => (coeff: number[]) => {
  const outQCoeff: number[] = []
  for (let i = 0; i < 64; i += 1) {
    outQCoeff[i] = Math.round(coeff[i] / qTable[i])
  }
  return outQCoeff
}

/**
 * Reverse quantization by getting the DCT coefficients from the quantized
 * coefficients while decoding.
 */
export const deQuantize = (qTable: number[]) => (qCoeff: number[]) => {
  const outCoeff: number[] = []
  for (let i = 0; i < 64; i += 1) {
    outCoeff[i] = qCoeff[i] * qTable[i]
  }
  return outCoeff
}

/**
 * Quantization table, which causes only rounding and thus maximum quality.
 */
export const qTableId: number[] = Array(64).fill(1)
