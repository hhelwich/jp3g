import { environment, Environment } from './environment'

/**
 * This module contains code to call functions both directly and in a worker.
 * This is useful in order not to block the main thread when decoding and
 * encoding images in the browser.
 */

/**
 * The callbacks from an async function to end it successfully or with an error
 * if necessary.
 */
type CallTermination<T> = [
  resolve: (result: T | PromiseLike<T>) => void,
  reject: (error: Error) => void
]

/**
 * Type of used functions that can be called both directly and in a worker.
 */
type WorkerFunction = (...args: any[]) => PromiseLike<any>

/**
 * The type of messages that are sent to the worker in order to call a function.
 */
type MessageToWorker = [callId: number, fnId: number, args: unknown[]]

/**
 * The type of messages sent back to the main thread by the worker after a
 * function has been completed.
 */
type MessageFromWorker<T> = [callId: number, result?: T, errorMessage?: string]

/**
 * Extract the type wrapped in a promise type.
 */
type UnwrapPromise<T> = T extends PromiseLike<infer U> ? U : T

/**
 * All available functions that can be called both directly and in a worker.
 * In case a function is called in a worker, there are functions that extract
 * the transferables used in the inputs and outputs. This is required so that
 * the buffers can be transferred between a worker and the main thread by
 * reference instead by value.
 */
const workerFunctions: [
  workerFunction: WorkerFunction,
  inputTransferables: (args: any[]) => ArrayBuffer[],
  outputTransferables: (result: any) => ArrayBuffer[]
][] = []

/**
 * The list of all available workers and the information whether they are
 * currently busy.
 */
let _workers: [worker: Worker, busy: boolean][] = []

/**
 * Function call counter that is used to create an ID for each function call.
 */
let callCounter = 0

/**
 * For all currently running calls, it maps the call ID to the termination
 * callbacks and is used to end the calls.
 */
const activeCalls = new Map<number, CallTermination<unknown>>()

/**
 * If all workers are busy, calls that have been requested are buffered in this
 * queue for later processing.
 */
const waitingCalls: [
  message: MessageToWorker,
  callTermination: CallTermination<unknown>
][] = []

/**
 * Notify an idle worker to initiate a function call.
 */
const notifyStartCall = (
  worker: Worker,
  message: MessageToWorker,
  callTermination: CallTermination<unknown>
) => {
  const [callId, fnId, args] = message
  activeCalls.set(callId, callTermination)
  const [, inputTransferables] = workerFunctions[fnId]
  const transferables = inputTransferables(args)
  worker.postMessage(message, transferables)
}

/**
 * Set zero to any number of workers which should be used to process functions.
 */
export const setWorker = (...workers: Worker[]) => {
  _workers = workers.map(worker => [worker, false])
  _workers.forEach(workerInfo => {
    const [worker] = workerInfo
    worker.onmessage = ({ data }) => {
      const [callId, result, errorMessage]: MessageFromWorker<unknown> = data
      // Terminate function
      const [resolve, reject] = activeCalls.get(callId) as CallTermination<
        unknown
      >
      activeCalls.delete(callId)
      if (errorMessage) {
        reject(Error(errorMessage))
      } else {
        resolve(result)
      }
      // Apply next action if available
      /* TODO Use the same code as when queuing a new function call.
       * This should prevent outdated workers to be used and simplify logic. */
      const nextCall = waitingCalls.shift()
      if (nextCall) {
        notifyStartCall(worker, ...nextCall)
      } else {
        workerInfo[1] = false
      }
    }
  })
}

/**
 * Proxy a function so that it can also be processed in a worker.
 */
export const workerFunction = <F extends WorkerFunction>(
  fn: F,
  inputTransferables: (args: Parameters<F>) => ArrayBuffer[],
  outputTransferables: (result: UnwrapPromise<ReturnType<F>>) => ArrayBuffer[]
): F => {
  const fnId = workerFunctions.length
  workerFunctions.push([fn, inputTransferables as any, outputTransferables])
  return ((...args) => {
    // If no workers available => Call function directly using JS queue.
    if (_workers.length === 0) {
      /* TODO Also use function queue? This should prevent functions on the JS
       * queue when workers are added later. */
      return fn(args)
    }
    // Process function in idle worker or queue for later processing in worker.
    return new Promise((resolve, reject) => {
      const callTermination: CallTermination<unknown> = [resolve, reject]
      const message: MessageToWorker = [callCounter++, fnId, args]
      // Send message to first not busy worker or add to queue if all are busy
      const firstNotBusyWorker = _workers.find(([, busy]) => !busy)
      if (firstNotBusyWorker) {
        firstNotBusyWorker[1] = true
        notifyStartCall(firstNotBusyWorker[0], message, callTermination)
      } else {
        waitingCalls.push([message, callTermination])
      }
    })
  }) as F
}

/**
 * Process function calls in the worker.
 */
if (environment === Environment.BrowserWorker) {
  onmessage = async ({ data }) => {
    const [callId, fnId, args]: MessageToWorker = data
    try {
      const [fn, , outputTransferables] = workerFunctions[fnId]
      const result = await fn(...args)
      const message: MessageFromWorker<unknown> = [callId, result]
      const transferables = outputTransferables(result)
      postMessage(message, transferables)
    } catch (e) {
      const message: MessageFromWorker<void> = [callId, , e.message]
      postMessage(message)
    }
  }
}
