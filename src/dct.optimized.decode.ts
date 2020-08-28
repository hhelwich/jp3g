import { mult8x8, transp8x8 } from './dct.naive-matrix.encode'
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
  mult8x8(
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
    [
      1,  0,  0,  1,  1,  0,  0,  1, 
      0,  1,  1,  0,  0,  1,  1,  0,       
      0,  1, -1,  0,  0, -1,  1,  0,
      1,  0,  0, -1, -1,  0,  0,  1,    
      0,  s, -s,  1, -1,  s, -s,  0,   
      0, -s,  s,  1, -1, -s,  s,  0,
      1, -s, -s,  0,  0,  s,  s, -1,
      1,  s,  s,  0,  0, -s, -s, -1,
    ]
  )
)

/**
 * TODO: optimize
 */
export const idct = (T: number[]) =>
  mult8x8(transp8x8(M), mult8x8(T, M)).map(x => x / 8)
