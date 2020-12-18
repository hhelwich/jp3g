import { zigZag } from '../jpeg'
import { range } from './util/testUtil'

describe('jpeg', () => {
  describe('zigZag indices', () => {
    // prettier-ignore
    const zigZagOrderedRange = [
      0, 1, 8, 16, 9, 2, 3, 10, 17, 24, 32, 25, 18, 11, 4, 5, 12, 19, 26, 33,
      40, 48, 41, 34, 27, 20, 13, 6, 7, 14, 21, 28, 35, 42, 49, 56, 57, 50, 43,
      36, 29, 22, 15, 23, 30, 37, 44, 51, 58, 59, 52, 45, 38, 31, 39, 46, 53,
      60, 61, 54, 47, 55, 62, 63,
    ]
    it('can be used to revert zigzag ordering', () => {
      const result = Array(64)
      for (let i = 0; i < 64; i += 1) {
        result[zigZag[i]] = zigZagOrderedRange[i]
      }
      expect(result).toEqual(range(64))
    })
    it('can be used apply zigzag order', () => {
      const range64 = range(64)
      const result = Array(64)
      for (let i = 0; i < 64; i += 1) {
        result[i] = range64[zigZag[i]]
      }
      expect(result).toEqual(zigZagOrderedRange)
    })
  })
})
