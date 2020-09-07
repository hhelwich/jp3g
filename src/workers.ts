import { environment, Environment } from './environment'

type ActiveAction<T> = [
  resolve: (result: T | PromiseLike<T>) => void,
  reject: (errorMessage: Error) => void
]

let actionCounter = 0
const activeActions = new Map<number, ActiveAction<any>>()

let _workers: [worker: Worker, busy: boolean][] = []
const waitingActions: [
  message: MessageToWorker,
  action: ActiveAction<any>
][] = []

type MessageToWorker = [callId: number, fnId: number, args: any[]]
type MessageFromWorker<T> = [callId: number, result: T, errorMessage?: string]

const startAction = (
  worker: Worker,
  message: MessageToWorker,
  action: ActiveAction<any>
) => {
  const [callId, fnId, args] = message
  activeActions.set(callId, action)
  const [, inputTransferables] = fns[fnId]
  const transferables = inputTransferables(args)
  worker.postMessage(message, transferables)
}

export const setWorker = (...workers: Worker[]) => {
  _workers = workers.map(worker => [worker, false])
  _workers.forEach((w, i) => {
    w[0].onmessage = e => {
      const [callId, result, errorMessage]: MessageFromWorker<any> = e.data
      // Return from function
      const [resolve, reject] = activeActions.get(callId) as ActiveAction<any>
      activeActions.delete(callId)
      if (errorMessage) {
        reject(Error(errorMessage))
      } else {
        resolve(result)
      }
      // Apply next action if available
      const nextAction = waitingActions.shift()
      if (nextAction) {
        const [message, action] = nextAction
        startAction(w[0], message, action)
      } else {
        w[1] = false
      }
    }
  })
}

type Fn = (...args: any) => Promise<any>

const fns: [
  Fn,
  (fnIn: any) => ArrayBuffer[],
  (fnOut: any) => ArrayBuffer[]
][] = []

type UnwrapPromise<T> = T extends PromiseLike<infer U> ? U : T

export const exportFunction = <F extends Fn>(
  fn: F,
  inputTransferables: (fnIn: Parameters<F>) => ArrayBuffer[],
  outputTransferables: (fnOut: UnwrapPromise<ReturnType<F>>) => ArrayBuffer[]
): F => {
  const fnId = fns.length
  fns.push([fn, inputTransferables, outputTransferables])
  return (args => {
    if (_workers.length === 0) {
      return fn(args)
    }
    return new Promise((resolve, reject) => {
      const action: ActiveAction<any> = [resolve, reject]
      const message: MessageToWorker = [actionCounter++, fnId, args]
      // Send message to first not busy worker or add to queue if all are busy
      const firstNotBusyWorker = _workers.find(([, busy]) => !busy)
      if (firstNotBusyWorker) {
        firstNotBusyWorker[1] = true
        startAction(firstNotBusyWorker[0], message, action)
      } else {
        waitingActions.push([message, action])
      }
    })
  }) as F
}

if (environment === Environment.BrowserWorker) {
  onmessage = async e => {
    const [callId, fnId, args]: MessageToWorker = e.data
    try {
      const [fn, inputTransferables] = fns[fnId]
      const result = await fn(...args)
      const message: MessageFromWorker<any> = [callId, result]
      postMessage(message, inputTransferables(result))
    } catch (e) {
      const message: MessageFromWorker<void> = [callId, , e.message]
      postMessage(message)
    }
  }
}
