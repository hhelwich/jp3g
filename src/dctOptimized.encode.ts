import { m1, m2, m3, m5, m6, m7, multSym } from './dctOptimized.common'
const { SQRT2 } = Math

/**
 * Calculate B := (M/sqrt(8) * A)^t
 */
const multM = (A: number[], B: number[]) => {
  for (let j = 0, i = 0; j < 8; j += 1) {
    const a0 = A[j]
    const a1 = A[j + 8]
    const a2 = A[j + 16]
    const a3 = A[j + 24]
    const a4 = A[j + 32]
    const a5 = A[j + 40]
    const a6 = A[j + 48]
    const a7 = A[j + 56]
    const g0 = a0 + a7
    const g1 = a1 + a6
    const g2 = a2 + a5
    const g3 = a3 + a4
    const g4 = a3 - a4
    const g7 = a0 - a7
    const f0 = g0 + g3
    const f1 = g1 + g2
    const f2 = g1 - g2
    const f3 = g0 - g3
    const e5 = (a2 - a5) / SQRT2
    const e6 = (a1 - a6) / SQRT2
    const d5 = e5 - e6
    const d6 = e5 + e6
    const c4 = g4 - d5
    const c5 = g4 + d5
    const c6 = g7 - d6
    const c7 = d6 + g7
    B[i++] = f0 + f1
    B[i++] = m7 * c4 + m1 * c7
    B[i++] = m6 * f2 + m2 * f3
    B[i++] = m3 * c6 - m5 * c5
    B[i++] = f0 - f1
    B[i++] = m3 * c5 + m5 * c6
    B[i++] = m6 * f3 - m2 * f2
    B[i++] = m7 * c7 - m1 * c4
  }
}

/**
 * Floating point optimized DCT.
 */
export const dct = multSym(multM)
