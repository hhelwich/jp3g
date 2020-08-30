const { cos, PI, SQRT2 } = Math

const m = (x: number) => SQRT2 * cos((x / 16) * PI)

export const m1 = m(1)
export const m2 = m(2)
export const m3 = m(3)
export const m5 = m(5)
export const m6 = m(6)
export const m7 = m(7)

const tmp: number[] = []

/**
 * Apply function multM two times and scale by 1/8.
 */
export const multSym = (multM: (A: number[], B: number[]) => void) => (
  A: number[]
) => {
  multM(A, tmp)
  const C: number[] = []
  multM(tmp, C)
  for (let i = 0; i < 64; i += 1) {
    C[i] /= 8
  }
  return C
}
