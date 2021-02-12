import {
  enablePromise,
  Callback,
  composeAsync,
  toAsync,
  waitState,
  subarray,
} from '../util'
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
  describe('composeAsync', () => {
    const _fn1 = composeAsync(
      (x: number, callback: Callback<string>) => {
        if (!isFinite(x)) {
          ;(callback as any)(Error('oops1'))
        } else {
          callback(null, x.toString(2))
        }
      },
      (s: string, callback: Callback<boolean>) => {
        if (s === '101') {
          ;(callback as any)(Error('oops2'))
        } else {
          callback(null, s.length % 2 === 0)
        }
      }
    )
    const fn1: (x: number) => Promise<boolean> = promisify(_fn1)
    it('composes two async functions', async () => {
      expect(await fn1(1)).toBe(false)
      expect(await fn1(2)).toBe(true)
    })
    it('is synchronous for synchronous functions', () => {
      let isSync = false
      _fn1(3, () => {
        isSync = true
      })
      expect(isSync).toBe(true)
    })
    it('propagates error for first function', async () => {
      await expect(fn1(1 / 0)).rejects.toThrow('oops1')
    })
    it('propagates error for second function', async () => {
      await expect(fn1(5)).rejects.toThrow('oops2')
    })
    it('can have no input for first function', async () => {
      const _fn = composeAsync(
        (callback: Callback<number>) => {
          callback(null, 42)
        },
        (x: number, callback: Callback<string>) => {
          callback(null, x.toString(2))
        }
      )
      const fn: () => Promise<string> = promisify(_fn)
      expect(await fn()).toBe('101010')
    })
    it('can be used with two effects', async () => {
      const callIds: number[] = []
      const _fn = composeAsync(
        (callback: Callback<void>) => {
          callIds.push(1)
          ;(callback as any)()
        },
        (_: void, callback: Callback<void>) => {
          callIds.push(2)
          ;(callback as any)()
        }
      )
      const fn: () => Promise<void> = promisify(_fn)
      expect(callIds).toEqual([])
      await fn()
      expect(callIds).toEqual([1, 2])
    })
    it('can have multiple inputs for first function', async () => {
      const _fn = composeAsync(
        (x: number, s: string, callback: Callback<boolean>) => {
          callback(null, x.toString(2) === s)
        },
        (b: boolean, callback: Callback<number>) => {
          callback(null, +b)
        }
      )
      const fn: (x: number, s: string) => Promise<number> = promisify(_fn)
      expect(await fn(5, '101')).toBe(1)
      expect(await fn(5, '100')).toBe(0)
    })
  })
  describe('toAsync', () => {
    const _fn = toAsync((x: number) => {
      if (!isFinite(x)) {
        throw Error('oops')
      }
      return x.toString(2)
    })
    const fn: (x: number) => Promise<string> = promisify(_fn)
    it('makes function asynchronous', async () => {
      expect(await fn(5)).toBe('101')
    })
    it('handles errors', async () => {
      await expect(fn(1 / 0)).rejects.toThrow('oops')
    })
    it('calls callback synchronously', () => {
      let isSync = false
      _fn(1, () => {
        isSync = true
      })
      expect(isSync).toBe(true)
    })
  })
  describe('waitState', () => {
    it('notifies waiting listeners if state fulfills condition', () => {
      let state = false
      const [checkState, wait] = waitState(() => state)
      const callIds: number[] = []
      wait(() => {
        callIds.push(1)
      })
      wait(() => {
        callIds.push(2)
      })
      checkState()
      expect(callIds).toEqual([])
      state = true
      checkState()
      expect(callIds).toEqual([1, 2])
    })
    it('checks for state changes by waiting listeners', () => {
      let state = false
      const [checkState, wait] = waitState(() => state)
      const callIds: number[] = []
      wait(() => {
        callIds.push(1)
        state = false
        checkState()
      })
      wait(() => {
        callIds.push(2)
      })
      state = true
      checkState()
      expect(callIds).toEqual([1])
    })
    it('is possible to add listeners from listener', () => {
      let state = false
      const [checkState, wait] = waitState(() => state)
      const callIds: number[] = []
      wait(() => {
        callIds.push(1)
        wait(() => {
          callIds.push(3)
          wait(() => {
            callIds.push(4)
          })
        })
      })
      wait(() => {
        callIds.push(2)
      })
      state = true
      checkState()
      expect(callIds).toEqual([1, 2, 3, 4])
    })
    it('notifies callbacks if checked before', () => {
      let state = false
      const [checkState, wait] = waitState(() => state)
      const callIds: number[] = []
      state = true
      checkState()
      wait(() => {
        callIds.push(1)
      })
      expect(callIds).toEqual([1])
    })
  })
  describe('subarray', () => {
    // [3, 5, 7, 11]
    const buf = new Uint8Array([2, 3, 5, 7, 11, 42]).subarray(1, 5)
    const nodeBuf = Buffer.from([2, 3, 5, 7, 11, 42]).subarray(1, 5)
    it('its indices behave like slice/subarray for direct Uint8Array', () => {
      expect(subarray(buf, 1, 2)).toEqual(new Uint8Array([5]))
      expect(subarray(buf, 1, 3)).toEqual(new Uint8Array([5, 7]))
      expect(subarray(buf, 2, 4)).toEqual(new Uint8Array([7, 11]))
    })
    it('its indices behave like slice/subarray for node.js Buffer', () => {
      expect(subarray(nodeBuf, 1, 2)).toEqual(new Uint8Array([5]))
      expect(subarray(nodeBuf, 1, 3)).toEqual(new Uint8Array([5, 7]))
      expect(subarray(nodeBuf, 2, 4)).toEqual(new Uint8Array([7, 11]))
    })
    it('can omit end parameter', () => {
      expect(subarray(buf, 1)).toEqual(new Uint8Array([5, 7, 11]))
      expect(subarray(buf, 3)).toEqual(new Uint8Array([11]))
    })
    it('can omit start and end parameter', () => {
      expect(subarray(buf)).toEqual(new Uint8Array([3, 5, 7, 11]))
    })
    it('is a view on the same ArrayBuffer for direct Uint8Array', () => {
      expect(subarray(buf, 1, 2).buffer).toBe(buf.buffer)
    })
    it('is a view on the same ArrayBuffer for node.js Buffer', () => {
      expect(subarray(nodeBuf, 1, 2).buffer).toBe(nodeBuf.buffer)
    })
    it('always returns direct Uint8Array', () => {
      for (const b of [buf, nodeBuf]) {
        const view = subarray(b, 1, 2)
        expect(view).toBeInstanceOf(Uint8Array)
        expect(view).not.toBeInstanceOf(Buffer)
      }
    })
  })
})
