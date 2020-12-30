import { enablePromise, Callback } from '../util'
import { promisify } from './util/testUtil'

describe('util', () => {
  describe('enablePromise', () => {
    it('result can be used with and without callback', async () => {
      const fn = enablePromise((callback: Callback<number>) => {
        setTimeout(() => {
          callback(null, 42)
        })
      })
      expect(await promisify(fn)()).toBe(42)
      expect(await fn()).toBe(42)
    })
    it('can use parameters and can throw', async () => {
      const fn = enablePromise(
        (a: number, b: number, callback: Callback<number>) => {
          setTimeout(() => {
            if (b === 0) {
              ;(callback as any)(Error('ooops'))
            } else {
              callback(null, a / b)
            }
          })
        }
      )
      expect(await promisify(fn)(2, 8)).toBe(1 / 4)
      expect(await fn(2, 8)).toBe(1 / 4)
      await expect(promisify(fn)(2, 0)).rejects.toThrow('ooops')
      await expect(fn(2, 0)).rejects.toThrow('ooops')
    })
    it('can handle optional parameters', async () => {
      const fn: {
        (callback: Callback<number>): void
        (a: number | undefined, callback: Callback<number>): void
        (
          a: number | undefined,
          b: number | undefined,
          callback: Callback<number>
        ): void
        (
          a: number | undefined,
          b: number | undefined,
          c: number | undefined,
          callback: Callback<number>
        ): void
        (
          a?: number | undefined,
          b?: number | undefined,
          c?: number | undefined
        ): Promise<number>
      } = enablePromise((...args: any[]) => {
        const callback: Callback<number> = args[args.length - 1]
        const xs: (number | undefined)[] = args.slice(0, args.length - 1)
        setTimeout(() => {
          callback(
            null,
            xs.reduce((sum: number, x) => sum + (x ?? 0), 0)
          )
        })
      }) as any
      expect(await promisify(fn)(4, -3, 5, 0)).toBe(6)
      expect(await promisify(fn)(4, -3)).toBe(1)
      expect(await promisify(fn)(4)).toBe(4)
      expect(await promisify(fn)()).toBe(0)
      expect(await fn(4, -3, 5)).toBe(6)
      expect(await fn(4, -3)).toBe(1)
      expect(await fn(4)).toBe(4)
      expect(await fn()).toBe(0)
    })
  })
})
