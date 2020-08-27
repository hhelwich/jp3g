import { dct } from './dct.naive.encode'
import { idct } from './dct.naive.decode'
import { g } from './dct.naive.encode.test'

describe('IDCT (naive)', () => {
  it('inverts naive DCT', () => {
    const G = dct(g)
    const gActual = idct(G).map(Math.round)
    expect(gActual).toEqual(g)
  })
})
