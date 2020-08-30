import { idct as idctReference } from '../dct.naive.decode'
import { M as MReference } from '../dct.naive-matrix.encode'
import { G } from './dct.naive.encode.test'
import { idct, M8 } from '../dct.optimized.decode'

describe('IDCT (optimized)', () => {
  it('equals result of reference IDCT', () => {
    const precision = 10
    const g = idctReference(G).map(x => +x.toFixed(precision))
    const g2 = idct(G).map(x => +x.toFixed(precision))
    expect(g).toEqual(g2)
  })
  it('optimized matrix div sqrt(8) is naive matrix', () => {
    const precision = 2
    const _MReference = MReference.map(x => x * Math.sqrt(8)).map(
      x => +x.toFixed(precision)
    )
    const _M8 = M8.map(x => +x.toFixed(precision))
    expect(_M8).toEqual(_MReference)
  })
})
