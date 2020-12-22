import { invDctQuantized } from './dctQuantized.decode'
import { QuantizationTable } from './jpeg'

const invDctQuantizedDownScale8 = (
  qTable: QuantizationTable,
  qCoeffs: Int16Array,
  outSamples: Uint8ClampedArray,
  outOffset: number
) => {
  outSamples[outOffset] = (qCoeffs[0] * qTable[0]) / 8 + 128
}

/**
 * - Dequantize coefficients
 * - Floating point optimized IDCT.
 * - Decenter by adding 128
 */
export const invDctQuantizedScaled = (downScale: number) =>
  downScale === 8 ? invDctQuantizedDownScale8 : invDctQuantized
