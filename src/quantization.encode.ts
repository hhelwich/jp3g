const { round } = Math

/**
 * Quantizate DCT coefficients.
 */
export const quantize = (
  quantumValues: number[],
  coeff: number[],
  outQCoeff: number[]
) => {
  for (let i = 0; i < 64; i += 1) {
    outQCoeff[i] = round(coeff[i] / quantumValues[i])
  }
}
