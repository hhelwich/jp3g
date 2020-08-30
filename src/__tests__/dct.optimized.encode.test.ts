import { dct as dctReference } from '../dct.naive.encode'
import { g } from './dct.naive.encode.test'
import { dct, multM, M8 } from '../dct.optimized.encode'
import { mult8x8, transp8x8 } from '../dct.naive-matrix.encode'

describe('DCT (optimized)', () => {
  xit('equals result of reference DCT', () => {
    const precision = 10
    const G = dctReference(g).map(x => +x.toFixed(precision))
    const G2 = dct(g).map(x => +x.toFixed(precision))
    expect(G).toEqual(G2)
  })
  it('foo', () => {
    const precision = 2
    const G: number[] = []
    multM(g, G)
    expect(G.map(x => +x.toFixed(precision))).toEqual(
      transp8x8(mult8x8(M8, g)).map(x => +x.toFixed(precision))
    )
  })
})
