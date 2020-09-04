/**
 * Reverse quantization by getting the DCT coefficients from the quantized
 * coefficients.
 */
export const dequantize = (
    quantumValues: number[],
    quantizedCoeff: number[],
    outCoeff: number[]
  ) => {
    for (let i = 0; i < 64; i += 1) {
      outCoeff[i] = quantizedCoeff[i] * quantumValues[i]
    }
  }
  