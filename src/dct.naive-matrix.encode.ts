import { range } from './util'

const { cos, sqrt, PI } = Math

/**
 * Multiply two square matrices of the same size.
 */
export const mult = (...As: number[][]) =>
  As.reduce((A, B): number[] => {
    const n = sqrt(A.length)
    const C = range(n ** 2).map(() => 0)
    for (let i = 0; i < n; i += 1) {
      for (let j = 0; j < n; j += 1) {
        for (let k = 0; k < n; k += 1) {
          C[i * n + j] += A[i * n + k] * B[k * n + j]
        }
      }
    }
    return C
  })

/**
 * Transpose a square matrix.
 */
export const transp = (A: number[]) => {
  const n = sqrt(A.length)
  const B: number[] = []
  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j < n; j += 1) {
      B[i * n + j] = A[j * n + i]
    }
  }
  return B
}

/**
 * Return the square orthonormal DCT matrix of size n.
 */
export const M = (n: number) => {
  const M: number[] = []
  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j < n; j += 1) {
      M[i * n + j] =
        i === 0
          ? sqrt(1 / n)
          : sqrt(2 / n) * cos(((2 * j + 1) * i * PI) / (2 * n))
    }
  }
  return M
}

/**
 * Naive matrix form of the DCT: M * V * M^T
 */
export const dct = (n: number) => (V: number[]) => mult(M(n), V, transp(M(n)))
