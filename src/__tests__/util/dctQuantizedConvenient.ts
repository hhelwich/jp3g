import { qTableId } from './quantization'
import { invDctQuantized as _invDctQuantized } from '../../dctQuantized.decode'
import { dctQuantized as _dctQuantized } from '../../dctQuantized.encode'

/**
 * More convenient signature for the optimized DCT (with quantization).
 */
export const dctQuantized = (
  samples: number[],
  qTable = qTableId,
  qTableBytes: 1 | 2 = 1
) => {
  const offset = Math.floor(Math.random() * 10)
  const outQCoeffs = new Int16Array(64 + offset)
  _dctQuantized(
    new (qTableBytes === 1 ? Uint8Array : Uint16Array)(qTable),
    new Uint8ClampedArray(samples),
    outQCoeffs,
    offset
  )
  return Array.from(outQCoeffs.slice(offset))
}

/**
 * More convenient signature for the optimized DCT (with quantization).
 */
export const invDctQuantized = (
  qCoeffs: number[],
  qTable = qTableId,
  qTableBytes: 1 | 2 = 1
) => {
  const outCoeffsOffset = Math.floor(Math.random() * 10)
  const outCoeffs = new Uint8ClampedArray(64 + outCoeffsOffset)
  _invDctQuantized(
    new (qTableBytes === 1 ? Uint8Array : Uint16Array)(qTable),
    new Int16Array(qCoeffs),
    outCoeffs,
    outCoeffsOffset
  )
  return Array.from(outCoeffs.slice(outCoeffsOffset))
}
