import { mult8x8, transp8x8 } from './dct.naive-matrix.encode'
const { cos, PI, SQRT2 } = Math

const m = (x: number) => SQRT2 * cos((x / 16) * PI)

const m1 = m(1)
const m2 = m(2)
const m3 = m(3)
const m5 = m(5)
const m6 = m(6)
const m7 = m(7)

// prettier-ignore
const M = mult8x8(
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
  [
     1,   1,   1,   1,   1,   1,   1,   1, // row 1
     1,  -1,  -1,   1,   1,  -1,  -1,   1, // row 5 -> 2

    m2,  m6, -m6, -m2, -m2, -m6,  m6,  m2, // row 3
    m6, -m2,  m2, -m6, -m6,  m2, -m2,  m6, // row 7 -> 4

    m1,  m3,  m5,  m7, -m7, -m5, -m3, -m1, // row 2 -> 5
    m5, -m1,  m7,  m3, -m3, -m7,  m1, -m5, // row 6

    m3, -m7, -m1, -m5,  m5,  m1,  m7, -m3, // row 4 -> 7
    m7, -m5,  m3, -m1,  m1, -m3,  m5, -m7, // row 8
  ]
)

/**
 * TODO: optimize
 */
export const idct = (T: number[]) =>
  mult8x8(transp8x8(M), mult8x8(T, M)).map(x => x / 8)
