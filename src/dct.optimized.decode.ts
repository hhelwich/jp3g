import { mult8x8, transp8x8, M } from './dct.naive-matrix.encode'

/**
 * TODO: optimize
 */
export const idct = (T: number[]) => mult8x8(transp8x8(M), mult8x8(T, M))
