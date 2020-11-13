import { setWorkers, workerFunction, fakeWorker } from '../workers'

describe('workers', () => {
  describe('workerFunction', () => {
    setWorkers(fakeWorker())
    const plus = workerFunction(
      async (a: number, b: number) => {
        if (b === 0) {
          throw Error('ooops')
        }
        return a / b
      },
      () => [],
      () => []
    )
    it('proxies function and returns same result', async () => {
      expect(await plus(6, 2)).toBe(3)
    })
    it('proxies function and throws same error', async () => {
      await expect(plus(6, 0)).rejects.toEqual(Error('ooops'))
    })
  })
})
