// mx := sqrt(2) * cos((x / 16) * PI)
export const m1 = 1.3870398453221475
export const m2 = 1.3065629648763766
export const m3 = 1.1758756024193588
export const m5 = 0.7856949583871023
export const m6 = 0.5411961001461971
export const m7 = 0.2758993792829431

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
