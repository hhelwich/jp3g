const { cos, PI } = Math
import { a } from './dct.naive.encode'

/**
 * TODO optimize
 */
export const idct = (g: number[]) => {
  const result: number[] = []
  for (let u = 0; u < 8; u += 1) {
    for (let v = 0; v < 8; v += 1) {
      result[u * 8 + v] = f(g, u, v)
    }
  }
  return result
}

const f = (F: number[], x: number, y: number) => {
  let sum = 0
  for (let u = 0; u < 8; u += 1) {
    for (let v = 0; v < 8; v += 1) {
      sum +=
        a(u) *
        a(v) *
        F[u * 8 + v] *
        cos(((2 * x + 1) * u * PI) / 16) *
        cos(((2 * y + 1) * v * PI) / 16)
    }
  }
  return 0.25 * sum
}
