const { cos, PI, SQRT2 } = Math

const m = (x: number) => SQRT2 * cos((x / 16) * PI)

const m1 = m(1)
const m2 = m(2)
const m3 = m(3)
const m5 = m(5)
const m6 = m(6)
const m7 = m(7)

/**
 * Calculate B := (A * M/sqrt(8))^t
 */
const multM = (A: number[], B: number[]) => {
  // TODO Use scaled integers in IDCT to speed up decoding?
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

const tmp: number[] = []

/**
 * Floating point optimized IDCT.
 */
export const idct = (A: number[]) => {
  multM(A, tmp)
  const C: number[] = []
  multM(tmp, C)
  for (let i = 0; i < 64; i += 1) {
    C[i] /= 8
  }
  return C
}
