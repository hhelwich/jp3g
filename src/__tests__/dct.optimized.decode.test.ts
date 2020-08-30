import { idct as idctReference } from '../dct.naive.decode'
import { G } from './dct.naive.encode.test'
import { idct } from '../dct.optimized.decode'

describe('IDCT (optimized)', () => {
  it('equals result of reference IDCT', () => {
    const precision = 11
    const g = idctReference(G).map(x => +x.toFixed(precision))
    const g2 = idct(G).map(x => +x.toFixed(precision))
    expect(g).toEqual(g2)
  })
})
