import qcoeff from './images/lotti-8-4:4:4-90.qcoeff'
import struct from './images/lotti-8-4:4:4-90.struct'
import coeff from './images/lotti-8-4:4:4-90.coeff'
import { DQT } from '../jpeg'
import { dequantize } from '../quantization.decode'
import { quantize } from '../quantization.encode'

describe('quantization', () => {
  it('dequantization', () => {
    const qt0 = (struct[2] as DQT).tables[0]
    const qt1 = (struct[3] as DQT).tables[0]
    const r1: number[] = []
    const r2: number[] = []
    const r3: number[] = []
    dequantize(qt0.values, qcoeff[0], r1)
    dequantize(qt1.values, qcoeff[1], r2)
    dequantize(qt1.values, qcoeff[2], r3)
    expect(r1).toEqual(coeff[0])
    expect(r2).toEqual(coeff[1])
    expect(r3).toEqual(coeff[2])
  })
  it('quantization', () => {
    const qt0 = (struct[2] as DQT).tables[0]
    const qt1 = (struct[3] as DQT).tables[0]
    const qCoeff1: number[] = []
    const qCoeff2: number[] = []
    const qCoeff3: number[] = []
    quantize(qt0.values, coeff[0], qCoeff1)
    quantize(qt1.values, coeff[1], qCoeff2)
    quantize(qt1.values, coeff[2], qCoeff3)
    expect(qCoeff1).toEqual(qcoeff[0])
    expect(qCoeff2).toEqual(qcoeff[1])
    expect(qCoeff3).toEqual(qcoeff[2])
  })
})
