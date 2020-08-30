import { dct } from '../dct.naive.encode'
import { idct } from '../dct.naive.decode'
import { g } from './dct.naive.encode.test'

describe('IDCT (naive)', () => {
  it('inverts naive DCT', () => {
    const precision = 12
    const G = dct(g)
    const gActual = idct(G).map(x => +x.toFixed(precision))
    expect(gActual).toEqual(g)
  })
})
