import { mult, transp, M } from './dctNaiveMatrix.encode'

/**
 * Naive matrix form of the inverse DCT: M^T * T * M
 */
export const idct = (n: number) => (T: number[]) =>
  mult(transp(M(n)), mult(T, M(n)))
