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
 * Asynchronous function that can be called both directly and in a worker.
 */
type WorkerFunction = (...args: any[]) => PromiseLike<any>

/**
 * Message that is sent to the worker in order to call a function.
 */
type MessageToWorker = [callId: number, fnId: number, args: unknown[]]

/**
 * Message that is sent back to the main thread by the worker after a function
 * has been completed.
 */
type MessageFromWorker<T> = [callId: number, result?: T, errorMessage?: string]

/**
 * A worker an its state.
 */
type WorkerWithState = [worker: Worker, busy: boolean]

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
 * Function call counter that is used to create an ID for each function call.
 */
let callCounter = 0

/**
 * For all currently running calls, it maps the call ID to the termination
 * callbacks and is used to end the calls.
 */
const activeCalls = new Map<number, CallTermination<unknown>>()

/**
 * If all workers are busy, calls are queued here for later processing.
 */
const callQueue: [
  message: MessageToWorker,
  callTermination: CallTermination<unknown>
][] = []

/**
 * Creates a function that handles a function call in a worker.
 */
const onMessageToWorker = (
  postMessageFromWorker: (
    message: MessageFromWorker<unknown>,
    transfer?: ArrayBuffer[]
  ) => void
) => async ({ data: [callId, fnId, args] }: MessageEvent<MessageToWorker>) => {
  try {
    const [fn, , outputTransferables] = workerFunctions[fnId]
    const result = await fn(...args)
    const message: MessageFromWorker<unknown> = [callId, result]
    const transferables = outputTransferables(result)
    postMessageFromWorker(message, transferables)
  } catch (e) {
    const message: MessageFromWorker<void> = [callId, , e.message]
    postMessageFromWorker(message)
  }
}

/**
 * Initializes a new worker in the main thread: Sets a function to receive
 * messages from the worker and initializes the status of the worker as idle.
 */
const initWorker = (worker: Worker): WorkerWithState => {
  const workerWithState: WorkerWithState = [worker, false]
  worker.onmessage = ({
    data: [callId, result, errorMessage],
  }: MessageEvent<MessageFromWorker<unknown>>) => {
    // Mark worker as idle
    workerWithState[1] = false
    // Terminate function call
    const [resolve, reject] = activeCalls.get(callId) as CallTermination<any>
    activeCalls.delete(callId)
    if (errorMessage) {
      reject(Error(errorMessage))
    } else {
      resolve(result)
    }
  }
  return workerWithState
}

/**
 * In case no workers are set, this fake worker is used to process the functions
 * in the main thread.
 */
const mainWorkerWithState: [WorkerWithState] = [
  (() => {
    let workerWithState: WorkerWithState
    const fakeWorkerOnMessage = onMessageToWorker(message => {
      const event = { data: message } as MessageEvent<
        MessageFromWorker<unknown>
      >
      workerWithState[0].onmessage!(event)
    })
    workerWithState = initWorker({
      postMessage: (message: MessageToWorker) => {
        const event = { data: message } as MessageEvent<MessageToWorker>
        fakeWorkerOnMessage(event)
      },
    } as Worker)
    return workerWithState
  })(),
]

/**
 * The list of all available workers and the information whether they are
 * currently busy.
 */
let workersWithState: WorkerWithState[] = mainWorkerWithState

/**
 * Notify an idle worker from the main thread to initiate a function call.
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
 * This function is called on the main thread on every worker function call,
 * every time a worker has finished processing a function and when the workers
 * are changed.
 * Possibly waiting calls are passed on to not busy workers for processing.
 */
const tryDistributeCalls = () => {
  for (const workerWithState of workersWithState) {
    const busy = workerWithState[1]
    if (!busy) {
      const nextCall = callQueue.shift()
      if (!nextCall) {
        return
      }
      workerWithState[1] = true
      notifyStartCall(workerWithState[0], ...nextCall)
    }
  }
}

/**
 * Set zero to any number of workers which should be used to process functions.
 */
export const setWorker = (..._workers: Worker[]) => {
  if (_workers.length > 0) {
    workersWithState = _workers.map(initWorker)
  } else {
    workersWithState = mainWorkerWithState
  }
  tryDistributeCalls()
}

/**
 * Proxy a function so that it can also be processed in a worker.
 * To pass ArrayBuffers by reference instead of by value, functions must be
 * specified which extract the ArrayBuffers from the function's inputs and
 * outputs.
 */
export const workerFunction = <F extends WorkerFunction>(
  fn: F,
  inputTransferables: (args: Parameters<F>) => ArrayBuffer[],
  outputTransferables: (result: UnwrapPromise<ReturnType<F>>) => ArrayBuffer[]
): F => {
  const fnId = workerFunctions.length
  workerFunctions.push([
    fn,
    inputTransferables as (args: any[]) => ArrayBuffer[],
    outputTransferables,
  ])
  return ((...args) => {
    // Queue function for processing
    const p: PromiseLike<any> = new Promise((resolve, reject) => {
      const callTermination: CallTermination<unknown> = [resolve, reject]
      const message: MessageToWorker = [callCounter++, fnId, args]
      callQueue.push([message, callTermination])
      tryDistributeCalls()
    })
    p.then(tryDistributeCalls, tryDistributeCalls)
    return p
  }) as F
}

/**
 * Process function calls in the worker.
 */
if (environment === Environment.BrowserWorker) {
  onmessage = onMessageToWorker(postMessage as any)
}