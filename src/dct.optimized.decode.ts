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
export const M = mult8x8(
  [
    1, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 1, 0, 0, 0, // Row 5 -> 2
    0, 0, 1, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 1, 0, // Row 7 -> 4
    0, 1, 0, 0, 0, 0, 0, 0, // Row 2 -> 5
    0, 0, 0, 0, 0, 1, 0, 0,
    0, 0, 0, 1, 0, 0, 0, 0, // Row 4 -> 7
    0, 0, 0, 0, 0, 0, 0, 1,
  ],
  mult8x8(
    [
       1,   1,   0,   0,   0,   0,   0,   0,
       1,  -1,   0,   0,   0,   0,   0,   0,
       0,   0,  m6,  m2,   0,   0,   0,   0,
       0,   0, -m2,  m6,   0,   0,   0,   0,
       0,   0,   0,   0,  m7,  m5,  m3,  m1,
       0,   0,   0,   0,  m3,  m7, -m1,  m5,
       0,   0,   0,   0, -m5, -m1, -m7,  m3,
       0,   0,   0,   0, -m1,  m3, -m5,  m7,
    ],
    mult8x8(
      transp8x8(
        [ 
          1,  0,  0,  1,  0,  0,  0,  0, // new col 1 + new col 4 -> col 1
          0,  1,  1,  0,  0,  0,  0,  0, // new col 2 + new col 3 -> col 2
          0,  1, -1,  0,  0,  0,  0,  0, // new col 2 - new col 3 -> col 3
          1,  0,  0, -1,  0,  0,  0,  0, // new col 1 - new col 4 -> col 4
          0,  0,  0,  0,  1,  0,  0,  0,
          0,  0,  0,  0,  0,  1,  0,  0,
          0,  0,  0,  0,  0,  0,  1,  0,
          0,  0,  0,  0,  0,  0,  0,  1,
        ]
      ),
      transp8x8(
        [ 
          1,  0,  0,  0,  0,  0,  0,  1, // new col 1 + new col 8 -> col 1
          0,  1,  0,  0,  0,  0,  1,  0, // new col 2 + new col 7 -> col 2
          0,  0,  1,  0,  0,  1,  0,  0, // ...
          0,  0,  0,  1,  1,  0,  0,  0,
          0,  0,  0,  1, -1,  0,  0,  0, // new col 4 - new col 5 -> col 5
          0,  0,  1,  0,  0, -1,  0,  0, // ...
          0,  1,  0,  0,  0,  0, -1,  0,
          1,  0,  0,  0,  0,  0,  0, -1,
        ]
      )
    )
  )
)

/**
 * TODO: optimize
 */
export const idct = (T: number[]) =>
  mult8x8(transp8x8(M), mult8x8(T, M)).map(x => x / 8)
