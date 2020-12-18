import { quantize, deQuantize, qTableId } from './quantization'

const { cos, PI, SQRT2 } = Math

const C = (u: number) => (u === 0 ? 1 / SQRT2 : 1)

/**
 * The ideal functional definition of the forward DCT taken from the JPEG
 * specification (A.3.3).
 * We will use it as reference for optimized implementations.
 *
 * See: https://www.w3.org/Graphics/JPEG/itu-t81.pdf
 */
export const dctIdeal = (s: number[]) => {
  const _S = S(s)
  const result: number[] = []
  for (let u = 0; u < 8; u += 1) {
    for (let v = 0; v < 8; v += 1) {
      result[u * 8 + v] = _S(u, v)
    }
  }
  return result
}

const S = (s: number[]) => (u: number, v: number) => {
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

/**
 * The ideal functional definition of the inverse DCT taken from the JPEG
 * specification (A.3.3).
 * We will use it as reference for optimized implementations.
 *
 * See: https://www.w3.org/Graphics/JPEG/itu-t81.pdf
 */
export const invDctIdeal = (g: number[]) => {
  const _s = s(g)
  const result: number[] = []
  for (let u = 0; u < 8; u += 1) {
    for (let v = 0; v < 8; v += 1) {
      result[u * 8 + v] = _s(u, v)
    }
  }
  return result
}

const s = (S: number[]) => (x: number, y: number) => {
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

/**
 * Add scalar to 8x8 matrix.
 */
const add64 = (x: number) => (input: number[]) => {
  const output: number[] = []
  for (let i = 0; i < 64; i += 1) {
    output[i] = input[i] + x
  }
  return output
}

const center = add64(-128)
const deCenter = (bits: number) => add64(2 ** (bits - 1))

export const dctQuantizedIdeal = (samples: number[], qTable = qTableId) =>
  quantize(qTable)(dctIdeal(center(samples)))

/**
 * Combination of ideal variants of dequantization, forward DCT and decentering.
 * This function is used as a reference for the optimized forward DCT, which
 * combines the mentioned operations for optimization reasons.
 */
export const invDctQuantizedIdeal = (qCoeffs: number[], qTable = qTableId) =>
  deCenter(8)(invDctIdeal(deQuantize(qTable)(qCoeffs)))
