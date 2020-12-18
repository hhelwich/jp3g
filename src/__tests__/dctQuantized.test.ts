import { dctQuantizedIdeal, invDctQuantizedIdeal } from './util/dctIdeal'
import { dctQuantized, invDctQuantized } from './util/dctQuantizedConvenient'
import { rmse, randomSamples, randomQTable } from './util/testUtil'

const numberOfAttempts = 1

describe('DCT (optimized)', () => {
  describe('full quality quantization table', () => {
    it('forward quantized DCT has expected error', () => {
      const maxError = 0.25
      for (let i = 0; i < numberOfAttempts; i += 1) {
        const samples = randomSamples()
        const coeffsExpected = dctQuantizedIdeal(samples)
        const coeffsActual = dctQuantized(samples)
        expect(rmse(coeffsActual, coeffsExpected)).toBeLessThanOrEqual(maxError)
      }
    })
    it('inverse quantized DCT has expected error', () => {
      const maxError = 0.32
      for (let i = 0; i < numberOfAttempts; i += 1) {
        const coeffs = dctQuantizedIdeal(randomSamples())
        const samplesExpected = invDctQuantizedIdeal(coeffs)
        const samplesActual = invDctQuantized(coeffs)
        expect(rmse(samplesActual, samplesExpected)).toBeLessThanOrEqual(
          maxError
        )
      }
    })
  })
  describe('with random quantization table', () => {
    it('forward quantized DCT has expected error', () => {
      const maxError = 0.25
      for (let i = 0; i < numberOfAttempts; i += 1) {
        const samples = randomSamples()
        const qTable = randomQTable()
        const coeffsExpected = dctQuantizedIdeal(samples, qTable)
        const coeffsActual = dctQuantized(samples, qTable)
        expect(rmse(coeffsActual, coeffsExpected)).toBeLessThanOrEqual(maxError)
      }
    })
    it('inverse quantized DCT has expected error', () => {
      const maxError = 30.2
      for (let i = 0; i < numberOfAttempts; i += 1) {
        const qTable = randomQTable()
        const coeffs = dctQuantizedIdeal(randomSamples(), qTable)
        const samplesExpected = invDctQuantizedIdeal(coeffs, qTable)
        const samplesActual = invDctQuantized(coeffs, qTable)
        const error = rmse(samplesActual, samplesExpected)
        expect(error).toBeLessThanOrEqual(maxError)
      }
    })
  })
})
