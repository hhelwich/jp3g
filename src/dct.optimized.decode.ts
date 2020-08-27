import { mult8x8, transp8x8 } from './dct.naive-matrix.encode'
const { cos, PI } = Math

export const M = (() => {
  const M: number[] = []
  for (let i = 0; i < 8; i += 1) {
    for (let j = 0; j < 8; j += 1) {
      M[i * 8 + j] =
        i === 0 ? 1 : Math.sqrt(2) * cos(((2 * j + 1) * i * PI) / 16)
    }
  }
  return M
})()

/**
 * TODO: optimize
 */
export const idct = (T: number[]) =>
  mult8x8(transp8x8(M), mult8x8(T, M)).map(x => x / 8)
