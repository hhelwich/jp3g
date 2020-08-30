import { mult8x8 } from './dct.naive-matrix.encode'

const { cos, PI, SQRT2 } = Math

const m = (x: number) => SQRT2 * cos((x / 16) * PI)

const m1 = m(1)
const m2 = m(2)
const m3 = m(3)
const m5 = m(5)
const m6 = m(6)
const m7 = m(7)

// prettier-ignore
export const M8 = mult8x8(
  // A
  [
    1, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 1, 0, 0, 0,
    0, 0, 1, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 1, 0,
    0, 1, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 1, 0, 0,
    0, 0, 0, 1, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1,
  ],
  // B
  [
    1,   1,   0,   0,   0,   0,   0,   0,
    1,  -1,   0,   0,   0,   0,   0,   0,
    0,   0,  m6,  m2,   0,   0,   0,   0,
    0,   0, -m2,  m6,   0,   0,   0,   0,
    0,   0,   0,   0,  m7,   0,   0,  m1,
    0,   0,   0,   0,   0,  m3,  m5,   0,
    0,   0,   0,   0,   0, -m5,  m3,   0,
    0,   0,   0,   0, -m1,   0,   0,  m7,
  ],
  // C
  [
    1, 0, 0, 0, 0, 0, 0, 0,
    0, 1, 0, 0, 0, 0, 0, 0,
    0, 0, 1, 0, 0, 0, 0, 0,
    0, 0, 0, 1, 0, 0, 0, 0,
    0, 0, 0, 0, 1,-1, 0, 0,
    0, 0, 0, 0, 1, 1, 0, 0,
    0, 0, 0, 0, 0, 0,-1, 1,
    0, 0, 0, 0, 0, 0, 1, 1,
  ],
  // D
  [
    1, 0, 0, 0, 0, 0, 0, 0,
    0, 1, 0, 0, 0, 0, 0, 0,
    0, 0, 1, 0, 0, 0, 0, 0,
    0, 0, 0, 1, 0, 0, 0, 0,
    0, 0, 0, 0, 1, 0, 0, 0,
    0, 0, 0, 0, 0, 1,-1, 0,
    0, 0, 0, 0, 0, 1, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 1,
  ],
  // E
  [
    1, 0, 0, 0, 0,       0,       0, 0,
    0, 1, 0, 0, 0,       0,       0, 0,
    0, 0, 1, 0, 0,       0,       0, 0,
    0, 0, 0, 1, 0,       0,       0, 0,
    0, 0, 0, 0, 1,       0,       0, 0,
    0, 0, 0, 0, 0, 1/SQRT2,       0, 0,
    0, 0, 0, 0, 0,       0, 1/SQRT2, 0,
    0, 0, 0, 0, 0,       0,       0, 1,
  ],
  // F
  [ 
    1,  0,  0,  1,  0,  0,  0,  0,
    0,  1,  1,  0,  0,  0,  0,  0,
    0,  1, -1,  0,  0,  0,  0,  0,
    1,  0,  0, -1,  0,  0,  0,  0,
    0,  0,  0,  0,  1,  0,  0,  0,
    0,  0,  0,  0,  0,  1,  0,  0,
    0,  0,  0,  0,  0,  0,  1,  0,
    0,  0,  0,  0,  0,  0,  0,  1,
  ],
  // G
  [
    1,  0,  0,  0,  0,  0,  0,  1,
    0,  1,  0,  0,  0,  0,  1,  0,
    0,  0,  1,  0,  0,  1,  0,  0,
    0,  0,  0,  1,  1,  0,  0,  0,
    0,  0,  0,  1, -1,  0,  0,  0,
    0,  0,  1,  0,  0, -1,  0,  0,
    0,  1,  0,  0,  0,  0, -1,  0,
    1,  0,  0,  0,  0,  0,  0, -1,
  ]
)

/**
 * TODO: Calculate B := (M/sqrt(8) * A)^t
 */
export const multM = (A: number[], B: number[]) => {
  for (let i = 0; i < 8; i += 1) {
    const a0 = A[0 * 8 + i]
    const a1 = A[1 * 8 + i]
    const a2 = A[2 * 8 + i]
    const a3 = A[3 * 8 + i]
    const a4 = A[4 * 8 + i]
    const a5 = A[5 * 8 + i]
    const a6 = A[6 * 8 + i]
    const a7 = A[7 * 8 + i]
    // Apply matrix G
    const g0 = a0 + a7
    const g1 = a1 + a6
    const g2 = a2 + a5
    const g3 = a3 + a4
    const g4 = a3 - a4
    const g5 = a2 - a5
    const g6 = a1 - a6
    const g7 = a0 - a7
    // Apply matrix F
    const f0 = g0 + g3
    const f1 = g1 + g2
    const f2 = g1 - g2
    const f3 = g0 - g3
    const f4 = g4
    const f5 = g5
    const f6 = g6
    const f7 = g7
    // Apply matrix E
    const e0 = f0
    const e1 = f1
    const e2 = f2
    const e3 = f3
    const e4 = f4
    const e5 = f5 / SQRT2
    const e6 = f6 / SQRT2
    const e7 = f7
    // Apply matrix D
    const d0 = e0
    const d1 = e1
    const d2 = e2
    const d3 = e3
    const d4 = e4
    const d5 = e5 - e6
    const d6 = e5 + e6
    const d7 = e7
    // Apply matrix C
    const c0 = d0
    const c1 = d1
    const c2 = d2
    const c3 = d3
    const c4 = d4 - d5
    const c5 = d4 + d5
    const c6 = -d6 + d7
    const c7 = d6 + d7
    // Apply matrix B
    const b0 = c0 + c1
    const b1 = c0 - c1
    const b2 = m6 * c2 + m2 * c3
    const b3 = -m2 * c2 + m6 * c3
    const b4 = m7 * c4 + m1 * c7
    const b5 = m3 * c5 + m5 * c6
    const b6 = -m5 * c5 + m3 * c6
    const b7 = -m1 * c4 + m7 * c7
    // Apply matrix A
    B[i * 8 + 0] = b0
    B[i * 8 + 1] = b4
    B[i * 8 + 2] = b2
    B[i * 8 + 3] = b6
    B[i * 8 + 4] = b1
    B[i * 8 + 5] = b5
    B[i * 8 + 6] = b3
    B[i * 8 + 7] = b7
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
