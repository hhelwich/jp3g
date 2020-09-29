import { C } from './dct.reference.common'

const { cos, PI } = Math

/**
 * The ideal functional definition of the forward DCT taken from the JPEG
 * specification (A.3.3).
 * We will use it as reference for optimized implementations.
 *
 * See: https://www.w3.org/Graphics/JPEG/itu-t81.pdf
 */
export const dct = (s: number[]) => {
  const result: number[] = []
  for (let u = 0; u < 8; u += 1) {
    for (let v = 0; v < 8; v += 1) {
      result[u * 8 + v] = S(s, u, v)
    }
  }
  return result
}

const S = (s: number[], u: number, v: number) => {
  let sum = 0
  for (let x = 0; x < 8; x += 1) {
    for (let y = 0; y < 8; y += 1) {
      sum +=
        s[x * 8 + y] *
        cos(((2 * x + 1) * u * PI) / 16) *
        cos(((2 * y + 1) * v * PI) / 16)
    }
  }
  return 0.25 * C(u) * C(v) * sum
}
