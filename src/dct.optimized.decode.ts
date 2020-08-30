import { mult8x8 } from './dct.naive-matrix.encode'
const { cos, PI, SQRT2 } = Math

const m = (x: number) => SQRT2 * cos((x / 16) * PI)

const m1 = m(1)
const m2 = m(2)
const m3 = m(3)
const m5 = m(5)
const m6 = m(6)
const m7 = m(7)

const s = 1 / SQRT2

// prettier-ignore
export const M = mult8x8(
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

export const idct = (input: number[]) => {
  const output: number[] = []
  const tmp: number[] = []
  // Calculate input * M
  for (let i = 0; i < 8; i += 1) {
    // Apply matrix A
    const a0 = input[i * 8 + 0]
    const a1 = input[i * 8 + 4]
    const a2 = input[i * 8 + 2]
    const a3 = input[i * 8 + 6]
    const a4 = input[i * 8 + 1]
    const a5 = input[i * 8 + 5]
    const a6 = input[i * 8 + 3]
    const a7 = input[i * 8 + 7]
    // Apply matrix B
    const b0 = a0 + a1
    const b1 = a0 - a1
    const b2 = m6 * a2 - m2 * a3
    const b3 = m2 * a2 + m6 * a3
    const b4 = m7 * a4 - m1 * a7
    const b5 = m3 * a5 - m5 * a6
    const b6 = m5 * a5 + m3 * a6
    const b7 = m1 * a4 + m7 * a7
    // Apply matrix C
    const c0 = b0
    const c1 = b1
    const c2 = b2
    const c3 = b3
    const c4 = b4 + b5
    const c5 = -b4 + b5
    const c6 = -b6 + b7
    const c7 = b6 + b7
    // Apply matrix D
    const d0 = c0
    const d1 = c1
    const d2 = c2
    const d3 = c3
    const d4 = c4
    const d5 = c5 + c6
    const d6 = -c5 + c6
    const d7 = c7
    // Apply matrix E
    const e0 = d0
    const e1 = d1
    const e2 = d2
    const e3 = d3
    const e4 = d4
    const e5 = d5 / SQRT2
    const e6 = d6 / SQRT2
    const e7 = d7
    // Apply matrix F
    const f0 = e0 + e3
    const f1 = e1 + e2
    const f2 = e1 - e2
    const f3 = e0 - e3
    const f4 = e4
    const f5 = e5
    const f6 = e6
    const f7 = e7
    // Apply matrix G
    const g0 = f0 + f7
    const g1 = f1 + f6
    const g2 = f2 + f5
    const g3 = f3 + f4
    const g4 = f3 - f4
    const g5 = f2 - f5
    const g6 = f1 - f6
    const g7 = f0 - f7
    tmp.push(g0, g1, g2, g3, g4, g5, g6, g7)
  }
  // Calculate M^t * tmp
  for (let j = 0; j < 8; j += 1) {
    // Apply matrix A
    const a0 = tmp[0 * 8 + j]
    const a1 = tmp[4 * 8 + j]
    const a2 = tmp[2 * 8 + j]
    const a3 = tmp[6 * 8 + j]
    const a4 = tmp[1 * 8 + j]
    const a5 = tmp[5 * 8 + j]
    const a6 = tmp[3 * 8 + j]
    const a7 = tmp[7 * 8 + j]
    // Apply matrix B
    const b0 = a0 + a1
    const b1 = a0 - a1
    const b2 = m6 * a2 - m2 * a3
    const b3 = m2 * a2 + m6 * a3
    const b4 = m7 * a4 - m1 * a7
    const b5 = m3 * a5 - m5 * a6
    const b6 = m5 * a5 + m3 * a6
    const b7 = m1 * a4 + m7 * a7
    // Apply matrix C
    const c0 = b0
    const c1 = b1
    const c2 = b2
    const c3 = b3
    const c4 = b4 + b5
    const c5 = -b4 + b5
    const c6 = -b6 + b7
    const c7 = b6 + b7
    // Apply matrix D
    const d0 = c0
    const d1 = c1
    const d2 = c2
    const d3 = c3
    const d4 = c4
    const d5 = c5 + c6
    const d6 = -c5 + c6
    const d7 = c7
    // Apply matrix E
    const e0 = d0
    const e1 = d1
    const e2 = d2
    const e3 = d3
    const e4 = d4
    const e5 = d5 / SQRT2
    const e6 = d6 / SQRT2
    const e7 = d7
    // Apply matrix F
    const f0 = e0 + e3
    const f1 = e1 + e2
    const f2 = e1 - e2
    const f3 = e0 - e3
    const f4 = e4
    const f5 = e5
    const f6 = e6
    const f7 = e7
    // Apply matrix G
    const g0 = f0 + f7
    const g1 = f1 + f6
    const g2 = f2 + f5
    const g3 = f3 + f4
    const g4 = f3 - f4
    const g5 = f2 - f5
    const g6 = f1 - f6
    const g7 = f0 - f7
    output[0 * 8 + j] = g0 / 8
    output[1 * 8 + j] = g1 / 8
    output[2 * 8 + j] = g2 / 8
    output[3 * 8 + j] = g3 / 8
    output[4 * 8 + j] = g4 / 8
    output[5 * 8 + j] = g5 / 8
    output[6 * 8 + j] = g6 / 8
    output[7 * 8 + j] = g7 / 8
  }
  return output
}
