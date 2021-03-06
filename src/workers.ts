import { environment, Environment } from './environment'
import { Append, array, Callback, waitState } from './util'

/**
 * This module contains code to call functions both directly and in a worker.
 * This is useful in order not to block the main thread when decoding and
 * encoding images in the browser.
 */

/**
 * Type of functions that are run in a worker.
 */
type WorkerFunction = (...args: any[]) => any

/**
 * Type of a message that is sent to the worker in order to call a function.
 */
export type MessageToWorker = [callId: number, fnId: number, args: unknown[]]

/**
 * Type of a message that is sent back to the main thread by the worker after a
 * function has been completed in the worker.
 */
export type MessageFromWorker<T> = [
  callId: number,
  errorMessage?: string,
  result?: T
]

/**
 * A worker and its state.
 */
type WorkerWithState = [worker: Worker, idle: boolean]

/**
 * Worker functions and its helper functions.
 */
const workerFunctions: [
  inputTransfer: (args: any) => ArrayBuffer[],
  workerFunction: WorkerFunction,
  outputTransfer: (result: any) => ArrayBuffer[]
][] = []

/**
 * Function call counter that is used to create an ID for each function call.
 */
let callCounter = 0

/**
 * Maps call ID for all currently running calls to the termination callback
 * which is used to end the calls.
 */
const activeCalls: { [key: number]: Callback<unknown> } = {}

/**
 * Calls are queued here for later processing.
 */
const callQueue: [message: MessageToWorker, callback: Callback<unknown>][] = []

/**
 * Creates a worker handler that runs a function in a worker.
 */
export const onMessageToWorker = (
  postMessageFromWorker: (
    message: MessageFromWorker<unknown>,
    transfer?: ArrayBuffer[]
  ) => void
) => ({ data: [callId, fnId, args] }: MessageEvent<MessageToWorker>) => {
  const [, fn, outputTransfer] = workerFunctions[fnId]
  let result: any
  let transfer: ArrayBuffer[] | undefined
  let errorMessage: string | undefined
  try {
    result = fn(...args)
    transfer = outputTransfer(result)
  } catch (error) {
    errorMessage = error.message
  }
  const message: MessageFromWorker<unknown> = [callId, errorMessage, result]
  postMessageFromWorker(message, transfer)
}

/**
 * Initializes a new worker in the main thread: Sets a function to receive
 * messages from the worker and initializes the status of the worker as idle.
 */
const initWorker = (worker: Worker): WorkerWithState => {
  const workerWithState: WorkerWithState = [worker, true]
  worker.onmessage = ({
    data: [callId, errorMessage, result],
  }: MessageEvent<MessageFromWorker<unknown>>) => {
    // Mark worker as idle
    workerWithState[1] = true
    // Terminate function call
    const callback = activeCalls[callId] as Callback<any>
    delete activeCalls[callId]
    const error = errorMessage != null ? Error(errorMessage) : undefined
    callback(error, result)
  }
  return workerWithState
}

/**
 * Returns a fake worker that works in the same thread.
 */
const fakeWorker = (): Worker => {
  let worker: Worker
  const fakeWorkerOnMessage = onMessageToWorker(message => {
    const event = { data: message } as MessageEvent<MessageFromWorker<any>>
    worker.onmessage!(event)
  })
  worker = {
    postMessage: (message: MessageToWorker) => {
      const event = { data: message } as MessageEvent<MessageToWorker>
      setTimeout(() => {
        fakeWorkerOnMessage(event)
      })
    },
  } as Worker
  return worker
}

export let maxWorkerCount = 0

/**
 * In case no workers are set, this fake worker is used to process the functions
 * in the main thread.
 */
const mainWorkerWithState: [WorkerWithState] = [initWorker(fakeWorker())]

/**
 * The list of all available workers and the information whether they are
 * currently idle.
 */
let workersWithState: WorkerWithState[] = mainWorkerWithState

/**
 * Notify an idle worker from the main thread to initiate a function call.
 */
const notifyStartCall = (
  worker: Worker,
  message: MessageToWorker,
  callback: Callback<unknown>
) => {
  const [callId, fnId, args] = message
  activeCalls[callId] = callback
  const [inputTransfer] = workerFunctions[fnId]
  worker.postMessage(message, inputTransfer(args))
}

let scriptSrc: string

/**
 * Waiting calls are passed on to idle workers for processing.
 * This function is called on the main thread on every worker function call,
 * every time a worker has finished processing a function and when the max
 * worker count is changed.
 */
const tryDistributeCalls = () => {
  if (workersWithState === mainWorkerWithState) {
    workersWithState = []
  }
  let workerDiff = maxWorkerCount - workersWithState.length
  // If too much workers => Terminate idle workers
  for (let i = 0; workerDiff < 0 && i < workersWithState.length; i += 1) {
    const [worker, idle] = workersWithState[i]
    if (idle) {
      worker.terminate()
      workersWithState.splice(i, 1)
      workerDiff += 1
      i -= 1
    }
  }
  // Create new workers if needed
  const idleCount = workersWithState.reduce(
    (count, [, idle]) => count + +idle,
    0
  )
  const newWorkerCount = Math.min(workerDiff - idleCount, callQueue.length)
  for (let i = 0; i < newWorkerCount; i += 1) {
    const workerWithState = initWorker(new Worker(scriptSrc))
    workersWithState.push(workerWithState)
  }
  // Delegate waiting calls to idle workers
  if (workersWithState.length === 0) {
    workersWithState = mainWorkerWithState
  }
  for (const workerWithState of workersWithState) {
    const [worker, idle] = workerWithState
    if (idle) {
      const nextCall = callQueue.shift()
      if (nextCall) {
        workerWithState[1] = false
        const [message, callback] = nextCall
        notifyStartCall(worker, message, callback)
      }
    }
  }
  checkIdle()
}

const [checkIdle, waitIdle] = waitState(() =>
  workersWithState.some(([, idle]) => idle)
)

export { waitIdle }

/**
 * Returns an asynchronous function that runs a synchronous function in a worker
 * pool.
 * The transfer functions are used to extract `Transferable`s so that they can
 * be passed to the worker and back by reference.
 */
export const workerFunction = <A extends any[], B>(
  inputTransfer: (args: A) => ArrayBuffer[],
  fn: (...args: A) => B,
  outputTransfer: (result: B) => ArrayBuffer[]
): ((...args: Append<A, Callback<B>>) => void) => {
  const fnId = workerFunctions.length
  workerFunctions.push([inputTransfer, fn, outputTransfer])
  return ((...args: any[]) => {
    const callbackIdx = args.length - 1
    const callback: Callback<B> = args[callbackIdx]
    args = array(args, 0, callbackIdx)
    const message: MessageToWorker = [callCounter++, fnId, args]
    callQueue.push([
      message,
      (error, result) => {
        callback(error, result as B)
        tryDistributeCalls()
      },
    ])
    tryDistributeCalls()
  }) as any
}

/**
 * Set zero to any number of workers which should be used to process
 * functions.
 */
export const setWorkerCount = (workerCount: number) => {
  if (typeof Worker !== 'undefined' && maxWorkerCount !== workerCount) {
    maxWorkerCount = workerCount
    tryDistributeCalls()
  }
}

declare const bundleFunction: Function

if (environment === Environment.BrowserMain) {
  const { createObjectURL } = window.URL || webkitURL
  /**
   * The URL of this script.
   */
  scriptSrc = createObjectURL(new Blob([`(${bundleFunction})()`]))
} else if (environment === Environment.BrowserWorker) {
  // Register function call handler in the worker.
  self.onmessage = onMessageToWorker(postMessage as any)
}
