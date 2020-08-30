import { m1, m2, m3, m5, m6, m7 } from './dct.optimized.common'
const { SQRT2 } = Math

/**
 * Calculate B := (M/sqrt(8) * A)^t
 */
const multM = (A: number[], B: number[]) => {
  for (let i = 0; i < 8; i += 1) {
    const a0 = A[0 * 8 + i]
    const a1 = A[1 * 8 + i]
    const a2 = A[2 * 8 + i]
    const a3 = A[3 * 8 + i]
    const a4 = A[4 * 8 + i]
    const a5 = A[5 * 8 + i]
    const a6 = A[6 * 8 + i]
    const a7 = A[7 * 8 + i]
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
    B[i * 8 + 0] = f0 + f1
    B[i * 8 + 1] = m7 * c4 + m1 * c7
    B[i * 8 + 2] = m6 * f2 + m2 * f3
    B[i * 8 + 3] = m3 * c6 - m5 * c5
    B[i * 8 + 4] = f0 - f1
    B[i * 8 + 5] = m3 * c5 + m5 * c6
    B[i * 8 + 6] = m6 * f3 - m2 * f2
    B[i * 8 + 7] = m7 * c7 - m1 * c4
  }
}

const tmp: number[] = []

/**
 * Floating point optimized DCT.
 */
export const dct = (A: number[]) => {
  multM(A, tmp)
  const C: number[] = []
  multM(tmp, C)
  for (let i = 0; i < 64; i += 1) {
    C[i] /= 8
  }
  return C
}
