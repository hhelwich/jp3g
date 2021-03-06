import { round } from '../testUtil'
import { dctIdeal, invDctIdeal } from '../dctIdeal'

// prettier-ignore
export const samples = [
  -76, -73, -67, -62, -58, -67, -64, -55,
  -65, -69, -73, -38, -19, -43, -59, -56,
  -66, -69, -60, -15,  16, -24, -62, -55,
  -65, -70, -57,  -6,  26, -22, -58, -59,
  -61, -67, -60, -24,  -2, -40, -60, -58,
  -49, -63, -68, -58, -51, -60, -70, -53,
  -43, -57, -64, -69, -73, -67, -63, -45,
  -41, -49, -59, -60, -63, -52, -50, -34,
]

// prettier-ignore
export const coeffs = [
  -415.37, -30.19, -61.2 ,  27.24,  56.12, -20.1 , -2.39,  0.46,
     4.47, -21.86, -60.76,  10.25,  13.15,  -7.09, -8.54,  4.88,
   -46.83,   7.37,  77.13, -24.56, -28.91,   9.93,  5.42, -5.65,
   -48.53,  12.07,  34.1 , -14.76, -10.24,   6.3 ,  1.83,  1.95,
    12.12,  -6.55, -13.2 ,  -3.95,  -1.87,   1.75, -2.79,  3.14,
    -7.73,   2.91,   2.38,  -5.94,  -2.38,   0.94,  4.3 ,  1.85,
    -1.03,   0.18,   0.42,  -2.42,  -0.88,  -3.02,  4.12, -0.66,
    -0.17,   0.14,  -1.07,  -4.19,  -1.17,  -0.1 ,  0.5 ,  1.68,
]

describe('ideal DCT', () => {
  it('forward DCT returns the expected result', () => {
    expect(dctIdeal(samples).map(round(2))).toEqual(coeffs)
  })
  it('forward DCT can be inverted', () => {
    const precision = 12
    expect(invDctIdeal(dctIdeal(samples)).map(round(precision))).toEqual(
      samples
    )
  })
  it('inverse DCT can be inverted', () => {
    const precision = 12
    expect(dctIdeal(invDctIdeal(coeffs)).map(round(precision))).toEqual(coeffs)
  })
})
