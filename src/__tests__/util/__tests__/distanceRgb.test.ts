import { distanceRgb } from '../distanceRgb'
import distanceRgbValues from '../distanceRgbValues'

describe('distanceRgb', () => {
  it('returns expected distances', () => {
    for (const distanceRgbValue of distanceRgbValues) {
      let { rgb1, rgb2, distance: expectedDistance } = distanceRgbValue
      // Randomly swap colors to make sure difference is symmetric.
      if (Math.random() > 0.5) {
        ;[rgb1, rgb2] = [rgb2, rgb1]
      }
      const distance = distanceRgb(rgb1, rgb2)
      expect(distance).toBe(expectedDistance)
    }
  })
})
