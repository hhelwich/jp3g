import {
  setWorkerCount,
  workerFunction,
  workerMock,
  waitIdle,
} from './util/fakeBrowserApi'
import { promisify } from 'util'
import { identity } from '../util'
import { getTime, range } from './util/testUtil'

describe('workers', () => {
  const noTransfer = () => []
  describe('workerFunction', () => {
    const fn = (a: number, b: string) => {
      if (a === 42) {
        throw Error('oops')
      }
      return a.toString(2) === b
    }
    for (const isWorker of [false, true]) {
      it(`runs a function in ${
        isWorker ? 'worker' : 'main thread'
      }`, async () => {
        workerMock.reset()
        setWorkerCount(isWorker ? 1 : 0)
        const _wfn = workerFunction(noTransfer, fn, noTransfer)
        const wfn: (a: number, b: string) => Promise<boolean> = promisify(_wfn)
        expect(await wfn(2, '10')).toBe(true)
        expect(await wfn(2, '11')).toBe(false)
        await expect(wfn(42, '11')).rejects.toThrow('oops')
        expect(workerMock.operations.length).toBe(isWorker ? 3 : 0)
      })
    }
    it('handles input and output transferables', async () => {
      workerMock.reset()
      setWorkerCount(1)
      const { buffer: foo } = new Uint8Array([1, 2, 3])
      const inputTransferFn = ([{ foo }]: [{ foo: ArrayBuffer }]) => [foo]
      const outputTransferFn = ({ bar }: { bar: ArrayBuffer }) => [bar]
      const fn = ({ foo }: { foo: ArrayBuffer }) => ({
        bar: new Uint8Array(foo).map(x => x + 1).buffer,
      })
      const _wfn = workerFunction(inputTransferFn, fn, outputTransferFn)
      const wfn: (a: {
        foo: ArrayBuffer
      }) => Promise<{ bar: ArrayBuffer }> = promisify(_wfn)
      const { bar } = await wfn({ foo })
      expect(Array.from(new Uint8Array(bar))).toEqual([2, 3, 4])
      expect(workerMock.operations.length).toBe(1)
      const { inputTransfer, outputTransfer } = workerMock.operations[0]
      expect(inputTransfer?.length).toBe(1)
      expect(inputTransfer?.[0]).toBe(foo)
      expect(outputTransfer?.length).toBe(1)
      expect(outputTransfer?.[0]).toBe(bar)
    })
    for (const single of [true, false]) {
      it(`runs operations ${
        single
          ? 'sequentially for single worker'
          : 'in parallel for multiple workers'
      }`, async () => {
        workerMock.reset()
        workerMock.setDelay(20)
        setWorkerCount(single ? 1 : 2)
        const _wfn = workerFunction(noTransfer, identity, noTransfer)
        const wfn: (a: number) => Promise<number> = promisify(_wfn)
        const xs = range(10)
        await Promise.all(xs.map(wfn))
        const e: any = expect(workerMock.operations.map(({ result }) => result))
        ;(single ? e : e.not).toEqual(xs)
      })
    }
    it('maximum operations at the same time is worker count', async () => {
      workerMock.reset()
      workerMock.setDelay(20)
      const workerCount = 3
      setWorkerCount(workerCount)
      const _wfn = workerFunction(noTransfer, identity, noTransfer)
      const wfn: (a: number) => Promise<number> = promisify(_wfn)
      const xs = range(10)
      await Promise.all(xs.map(wfn))
      const maxOpsAtSameTime = Math.max(
        ...workerMock.operations
          .flatMap(({ startTime, endTime }) => [startTime, endTime])
          .map(time =>
            workerMock.operations.reduce(
              (sameTimeCount, { startTime, endTime }) =>
                sameTimeCount + +(startTime <= time && time < endTime),
              0
            )
          )
      )
      expect(maxOpsAtSameTime).toBe(workerCount)
    })
  })
  describe('waitIdle', () => {
    const _waitIdle = promisify(waitIdle)
    it('to resolve on first worker is idle', async () => {
      workerMock.reset()
      workerMock.setDelay(20)
      const workerCount = 10
      setWorkerCount(workerCount)
      const _wfn = workerFunction(noTransfer, identity, noTransfer)
      const wfn: (a: number) => Promise<number> = promisify(_wfn)
      const xs = range(workerCount)
      const resultPromises = xs.map(wfn)
      await _waitIdle()
      const time = getTime()
      await Promise.all(resultPromises)
      workerMock.operations.forEach(({ startTime }) => {
        expect(startTime).toBeLessThan(time)
      })
      const endedBeforeIdleCount = workerMock.operations.filter(
        ({ endTime }) => endTime <= time
      ).length
      expect(endedBeforeIdleCount).toBe(1)
    })
  })
})
