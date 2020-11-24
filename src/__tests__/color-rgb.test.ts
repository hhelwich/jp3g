import { rgb2YCbCr } from '../colorRgb.encode'
import { yCbCr2Rgb } from '../colorRgb.decode'
import { scaledRange } from './util/testUtil'

/**
 * Use scope = 256 to cover all possible values of a byte. Use smaller
 * values >= 2 if the tests take too long.
 */
const scope = 20

describe('RGB <-> YCbCr', () => {
  it('YCbCr is in expected range', () => {
    const range = scaledRange(255)(scope)
    for (const r of range) {
      for (const g of range) {
        for (const b of range) {
          const [y, cb, cr] = rgb2YCbCr([r, g, b])
          if (
            y < 0 ||
            cb < 0.5 ||
            cr < 0.5 ||
            y > 255 ||
            cb > 255.5 ||
            cr > 255.5
          ) {
            throw `Unexpected RGB=${r},${g},${b} -> YCbCr=${y},${cb},${cr}`
          }
        }
      }
    }
  })
  it('round(yCbCr2Rgb ∘ rgb2YCbCr) is identity', () => {
    const range = scaledRange(255)(scope)
    for (const r of range) {
      for (const g of range) {
        for (const b of range) {
          const [r2, g2, b2] = yCbCr2Rgb(rgb2YCbCr([r, g, b])).map(Math.round)
          if (r !== r2 || g !== g2 || b !== b2) {
            throw `Unexpected RGB=${r},${g},${b} -> RGB=${r2},${g2},${b2}`
          }
        }
      }
    }
  })
})
