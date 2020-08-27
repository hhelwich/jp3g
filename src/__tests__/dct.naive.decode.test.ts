import { dct } from '../dct.naive.encode'
import { idct } from '../dct.naive.decode'
import { g } from './dct.naive.encode.test'

describe('IDCT (naive)', () => {
  it('inverts naive DCT', () => {
    const G = dct(g)
    const gActual = idct(G).map(x => +x.toFixed(12))
    expect(gActual).toEqual(g)
  })
})
