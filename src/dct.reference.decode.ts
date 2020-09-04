const { cos, PI } = Math
import { C } from './dct.reference.encode'

/**
 * The ideal functional definition of the inverse DCT taken from the JPEG
 * specification (A.3.3).
 * We will use it as reference for optimized implementations.
 *
 * See: https://www.w3.org/Graphics/JPEG/itu-t81.pdf
 */
export const idct = (g: number[]) => {
  const result: number[] = []
  for (let u = 0; u < 8; u += 1) {
    for (let v = 0; v < 8; v += 1) {
      result[u * 8 + v] = s(g, u, v)
    }
  }
  return result
}

const s = (S: number[], x: number, y: number) => {
  let sum = 0
  for (let u = 0; u < 8; u += 1) {
    for (let v = 0; v < 8; v += 1) {
      sum +=
        C(u) *
        C(v) *
        S[u * 8 + v] *
        cos(((2 * x + 1) * u * PI) / 16) *
        cos(((2 * y + 1) * v * PI) / 16)
    }
  }
  return 0.25 * sum
}
