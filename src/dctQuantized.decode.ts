import { QuantizationTable } from './jpeg'
import { m1, m2, m3, m5, m6, m7 } from './dctQuantized.common'

const { SQRT2 } = Math

/**
 * Calculate B := (A * M/sqrt(8))^t
 */
const multM = (A: Int16Array | Float64Array, B: Float64Array) => {
  // TODO Use scaled integers to speed up decoding?
  for (let i = 0, j = 0; i < 8; i += 1) {
    const a0 = A[j++]
    const a4 = A[j++]
    const a2 = A[j++]
    const a6 = A[j++]
    const a1 = A[j++]
    const a5 = A[j++]
    const a3 = A[j++]
    const a7 = A[j++]
    const b0 = a0 + a1
    const b1 = a0 - a1
    /* TODO Faster to reduce one multiplication for three additions like this?:
    const r0 = m6 * (a2 + a3)
    const b2 = r0 - (m6 + m2) * a3
    const b3 = r0 - (m6 - m2) * a2 */
    const b2 = m6 * a2 - m2 * a3
    const b3 = m2 * a2 + m6 * a3
    const b4 = m7 * a4 - m1 * a7
    const b5 = m3 * a5 - m5 * a6
    const b6 = m5 * a5 + m3 * a6
    const b7 = m1 * a4 + m7 * a7
    const c4 = b4 + b5
    const c5 = b5 - b4
    const c6 = b7 - b6
    const c7 = b6 + b7
    const e5 = (c5 + c6) / SQRT2
    const e6 = (c6 - c5) / SQRT2
    const f0 = b0 + b3
    const f1 = b1 + b2
    const f2 = b1 - b2
    const f3 = b0 - b3
    B[i] = f0 + c7
    B[i + 8] = f1 + e6
    B[i + 16] = f2 + e5
    B[i + 24] = f3 + c4
    B[i + 32] = f3 - c4
    B[i + 40] = f2 - e5
    B[i + 48] = f1 - e6
    B[i + 56] = f0 - c7
  }
}

const coeffs = new Int16Array(64)
const a = new Float64Array(64)
const b = new Float64Array(64)

/**
 * - Dequantize coefficients
 * - Floating point optimized IDCT.
 * - Decenter by adding 128
 */
export const invDctQuantized = (
  qTable: QuantizationTable,
  qCoeffs: Int16Array,
  outSamples: Uint8ClampedArray,
  outOffset: number
) => {
  for (let i = 0; i < 64; i += 1) {
    coeffs[i] = qCoeffs[i] * qTable[i]
  }
  multM(coeffs, a)
  multM(a, b)
  for (let i = 0; i < 64; i += 1) {
    outSamples[outOffset++] = b[i] / 8 + 128
  }
}
