import { environment, Environment } from './environment'
import { Append, Callback, array, isFunction } from './util'

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
type MessageToWorker = [callId: number, fnId: number, args: unknown[]]

/**
 * Type of a message that is sent back to the main thread by the worker after a
 * function has been completed in the worker.
 */
type MessageFromWorker<T> = [callId: number, errorMessage?: string, result?: T]

/**
 * A worker and its state.
 */
type WorkerWithState = [worker: Worker, busy: boolean]

/**
 * Worker functions and its helper functions.
 */
const workerFunctions: [
  preProcess: (args: any, callback: Callback<any[]>) => void,
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
const activeCalls = new Map<number, Callback<unknown>>()

/**
 * Calls are queued here for later processing.
 */
const callQueue: [message: MessageToWorker, callback: Callback<unknown>][] = []

/**
 * Creates a worker handler that runs a function in a worker.
 */
const onMessageToWorker = (
  postMessageFromWorker: (
    message: MessageFromWorker<unknown>,
    transfer?: ArrayBuffer[]
  ) => void
) => ({ data: [callId, fnId, args] }: MessageEvent<MessageToWorker>) => {
  const [, , fn, outputTransfer] = workerFunctions[fnId]
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
  const workerWithState: WorkerWithState = [worker, false]
  worker.onmessage = ({
    data: [callId, errorMessage, result],
  }: MessageEvent<MessageFromWorker<unknown>>) => {
    // Mark worker as idle
    workerWithState[1] = false
    // Terminate function call
    const callback = activeCalls.get(callId) as Callback<any>
    activeCalls.delete(callId)
    // TODO Preserve error type or remove special error types
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

/**
 * In case no workers are set, this fake worker is used to process the functions
 * in the main thread.
 */
const mainWorkerWithState: [WorkerWithState] = [initWorker(fakeWorker())]

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
  callback: Callback<unknown>
) => {
  const [callId, fnId, args] = message
  activeCalls.set(callId, callback)
  const [preProcess, inputTransfer] = workerFunctions[fnId]
  preProcess(args, (error, args2) => {
    if (error) {
      ;(callback as any)(error)
    } else {
      try {
        const transfer = inputTransfer(args2)
        worker.postMessage([callId, fnId, args2], transfer)
      } catch (error) {
        ;(callback as any)(error)
      }
    }
  })
}

/**
 * Waiting calls are passed on to idle workers for processing.
 * This function is called on the main thread on every worker function call,
 * every time a worker has finished processing a function and when the workers
 * are changed.
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
 * Returns an asynchronous function, that runs a synchronous function in a
 * worker pool. Additionally to the function, that is executed in the worker
 * helper functions are used for each function call. The arguments of the parent
 * function can be mapped asynchronously to the arguments of the worker function
 * using the `preProcess` function. This is useful to perform I/O operations
 * before. The transfer functions are used to extract `Transferable`s so that
 * they can be passed to the worker and back by reference.
 * The `postProcess` function can be used to perform operations on the result
 * e.g. to create an instance which is not possible to create in a worker
 * environment.
 */
export const workerFunction = <A extends any[], B extends any[], C, D>(
  preProcess: (args: A, callback: Callback<B>) => void,
  inputTransfer: (args: B) => ArrayBuffer[],
  fn: (...args: B) => C,
  outputTransfer: (result: C) => ArrayBuffer[],
  postProcess: (arg: C) => D
): {
  (...args: A): Promise<D>
  (...args: Append<A, Callback<D>>): void
} => {
  const fnId = workerFunctions.length
  workerFunctions.push([preProcess, inputTransfer, fn, outputTransfer])
  return ((...args: unknown[]) => {
    // Queue call for processing
    const lastIndex = args.length - 1
    const lastArgument = args[lastIndex]
    let callback: Callback<D>
    let result: Promise<D> | undefined
    if (isFunction(lastArgument)) {
      callback = lastArgument as Callback<D>
      args = array(args, 0, lastIndex)
    } else {
      result = new Promise((resolve, reject) => {
        callback = (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve(result)
          }
        }
      })
    }
    const message: MessageToWorker = [callCounter++, fnId, args]
    callQueue.push([
      message,
      (error, result) => {
        callback(error, postProcess(result as C))
        tryDistributeCalls()
      },
    ])
    tryDistributeCalls()
    return result
  }) as any
}

export let setWorkerCount: (workeCount: number) => void

if (environment === Environment.BrowserMain) {
  /**
   * The URL of this script. It gets a little hacky for browsers not supporting
   * `document.currentScript`.
   */
  const scriptSrc = (
    (document.currentScript as HTMLScriptElement | undefined) ||
    (() => {
      const scripts = document.getElementsByTagName('script')
      return scripts[scripts.length - 1]
    })()
  ).src

  /**
   * Set zero to any number of workers which should be used to process
   * functions.
   */
  setWorkerCount = (workerCount: number) => {
    if (window.Worker && workerCount > 0) {
      workersWithState = []
      for (let i = 0; i < workerCount; i += 1) {
        workersWithState.push(initWorker(new Worker(scriptSrc)))
      }
    } else {
      workersWithState = mainWorkerWithState
    }
    tryDistributeCalls()
  }
} else {
  // Register function call handler in the worker.
  onmessage = onMessageToWorker(postMessage as any)
}
