;(global as any).window = {
  Worker: {},
}
;(global as any).document = { currentScript: '' }

class FakeBlob {
  constructor(public source: ArrayBuffer | Uint8Array | Error) {}
}

export const fakeBlob = (source: ArrayBuffer | Uint8Array | Error) =>
  (new FakeBlob(source) as any) as Blob
;(global as any).FileReader = class {
  result?: ArrayBuffer
  onload?: () => void
  onerror?: (error: any) => void
  readAsArrayBuffer({ source }: FakeBlob) {
    setTimeout(() => {
      if (source instanceof Uint8Array) {
        source = new Uint8Array(source).buffer
      }
      if (source instanceof ArrayBuffer) {
        this.result = source
        this.onload?.()
      } else {
        this.onerror?.(source)
      }
    })
  }
}
;(global as any).Blob = FakeBlob

import {
  setWorkerCount,
  workerFunction,
  onMessageToWorker,
  MessageToWorker,
  MessageFromWorker,
  waitIdle,
} from '../../workers'

import { getTime } from './testUtil'

let delay = 0
export const workerMock = {
  operations: <
    {
      inputTransfer?: ArrayBuffer[]
      outputTransfer?: ArrayBuffer[]
      errorMessage?: string
      result: any
      startTime: bigint
      endTime: bigint
    }[]
  >[],
  reset() {
    workerMock.operations = []
    delay = 0
  },
  setDelay(ms: number) {
    delay = ms
  },
}
;(global as any).Worker = class {
  constructor() {
    this._onmessage = ({ startTime, inputTransfer }, message) => {
      onMessageToWorker((message, outputTransfer) => {
        const endTime = getTime()
        const event = { data: message } as MessageEvent<MessageFromWorker<any>>
        const [, errorMessage, result] = message
        workerMock.operations.push({
          inputTransfer,
          outputTransfer,
          errorMessage,
          result,
          startTime,
          endTime,
        })
        this._assureAlive()
        this.onmessage?.(event)
      })(message)
    }
  }
  onmessage?: (event: MessageEvent<MessageFromWorker<any>>) => void
  postMessage(message: MessageToWorker, inputTransfer: ArrayBuffer[]) {
    const startTime = getTime()
    this._assureAlive()
    setTimeout(() => {
      this._onmessage({ startTime, inputTransfer }, {
        data: message,
      } as MessageEvent<MessageToWorker>)
    }, Math.floor(Math.random() * delay))
  }
  terminate() {
    this._terminated = true
  }
  private _onmessage: (
    info: { startTime: bigint; inputTransfer: ArrayBuffer[] },
    event: MessageEvent<MessageToWorker>
  ) => void
  private _terminated = false
  private _assureAlive() {
    if (this._terminated) {
      throw Error('Should not use dead worker')
    }
  }
}

export { setWorkerCount, workerFunction, waitIdle }
