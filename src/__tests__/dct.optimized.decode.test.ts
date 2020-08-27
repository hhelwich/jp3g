import { dct } from '../dct.naive.encode'
import { idct } from '../dct.optimized.decode'
import { g } from './dct.naive.encode.test'

describe('IDCT (optimized)', () => {
  it('inverts DCT', () => {
    const G = dct(g)
    const gActual = idct(G).map(Math.round)
    expect(gActual).toEqual(g)
  })
})
