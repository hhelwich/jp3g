import { dct as dctReference } from '../dctReference.encode'
import { s } from './dct.reference.test'
import { dct } from '../dctNaiveMatrix.encode'
import { idct as idctReference } from '../dctReference.decode'
import { S } from './dct.reference.test'
import { idct } from '../dctNaiveMatrix.decode'

describe('DCT (naive matrix form)', () => {
  it('equals result of reference DCT', () => {
    const precision = 1
    const G = dctReference(s).map(x => +x.toFixed(precision))
    const G2 = dct(8)(s).map(x => +x.toFixed(precision))
    expect(G).toEqual(G2)
  })
  it('equals result of reference IDCT', () => {
    const precision = 11
    const g = idctReference(S).map(x => +x.toFixed(precision))
    const g2 = idct(8)(S).map(x => +x.toFixed(precision))
    expect(g).toEqual(g2)
  })
})
