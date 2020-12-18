import { round } from '../testUtil'
import { dctIdeal, invDctIdeal } from '../dctIdeal'
import { dctMatrix, invDctMatrix } from '../dctMatrix'
import { samples, coeffs } from './dctIdeal.test'

describe('DCT (naive matrix form)', () => {
  it('forward DCT equals ideal forward DCT', () => {
    const precision = 12
    const coeffsExpected = dctIdeal(samples)
    const coeffsActual = dctMatrix(8)(samples)
    expect(coeffsActual.map(round(precision))).toEqual(
      coeffsExpected.map(round(precision))
    )
  })
  it('inverse DCT equals ideal inverse DCT', () => {
    const precision = 11
    const samplesExpected = invDctIdeal(coeffs)
    const samplesActual = invDctMatrix(8)(coeffs)
    expect(samplesActual.map(round(precision))).toEqual(
      samplesExpected.map(round(precision))
    )
  })
})
