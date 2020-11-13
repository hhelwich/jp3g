import { dct as dctReference } from '../dctReference.encode'
import { idct as idctReference } from '../dctReference.decode'
import { dct } from '../dctOptimized.encode'
import { idct } from '../dctOptimized.decode'
import { S, s } from './dct.reference.test'

describe('DCT (optimized)', () => {
  it('result of optimized DCT equals result of reference DCT', () => {
    const precision = 12
    const G = dctReference(s).map(x => +x.toFixed(precision))
    const G2 = dct(s).map(x => +x.toFixed(precision))
    expect(G).toEqual(G2)
  })
  it('result of optimized IDCT equals result of reference IDCT', () => {
    const precision = 11
    const g = idctReference(S).map(x => +x.toFixed(precision))
    const g2 = idct(S).map(x => +x.toFixed(precision))
    expect(g).toEqual(g2)
  })
})
