import { dct as dctReference } from '../dct.naive.encode'
import { g } from './dct.naive.encode.test'
import { dct } from '../dct.optimized.encode'

describe('DCT (optimized)', () => {
  it('equals result of reference DCT', () => {
    const precision = 10
    const G = dctReference(g).map(x => +x.toFixed(precision))
    const G2 = dct(g).map(x => +x.toFixed(precision))
    expect(G).toEqual(G2)
  })
})
