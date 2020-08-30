const { cos, sqrt, PI } = Math

/**
 * Multiply 8x8 matrices.
 */
export const mult8x8 = (...As: number[][]) =>
  As.reduce((A, B): number[] => {
    const C = [...Array(64)].map(_ => 0)
    for (let i = 0; i < 8; i += 1) {
      for (let j = 0; j < 8; j += 1) {
        for (let k = 0; k < 8; k += 1) {
          C[i * 8 + j] += A[i * 8 + k] * B[k * 8 + j]
        }
      }
    }
    return C
  })

/**
 * Transpose an 8x8 matrix.
 */
export const transp8x8 = (A: number[]) => {
  const B: number[] = []
  for (let i = 0; i < 8; i += 1) {
    for (let j = 0; j < 8; j += 1) {
      B[i * 8 + j] = A[j * 8 + i]
    }
  }
  return B
}

export const M = (() => {
  const M: number[] = []
  for (let i = 0; i < 8; i += 1) {
    for (let j = 0; j < 8; j += 1) {
      M[i * 8 + j] =
        i === 0 ? 1 / sqrt(8) : sqrt(2 / 8) * cos(((2 * j + 1) * i * PI) / 16)
    }
  }
  return M
})()

/**
 * Naive matrix form of the DCT: M * V * M^T
 */
export const dct = (V: number[]) => mult8x8(mult8x8(M, V), transp8x8(M))
