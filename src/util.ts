import { Environment, environment } from './environment'

export type Head<T extends any[]> = T extends [...infer H, any] ? H : never
export type Last<T extends any[]> = T extends [...infer H, infer L] ? L : never
export type Prepend<I, T extends any[]> = [I, ...T]
export type Append<T extends any[], I> = [...T, I]

/**
 * Extract the type wrapped in a promise type.
 */
export type UnwrapCallback<T> = T extends Callback<infer U> ? U : never

/**
 * Callback type if used without Promises.
 */
export type Callback<T> = (error: Error | undefined | null, result: T) => void

const { slice } = Array.prototype

export const isFunction = (f: unknown): f is Function => typeof f === 'function'

export const isBlob = (b: unknown): b is Blob =>
  environment !== Environment.NodeJs && b instanceof Blob

/**
 * Just the identity function.
 */
export const identity = <T>(a: T): T => a

/**
 * Compose two asynchronous functions.
 */
export const composeAsync = <A extends any[], B extends [] | [D], C, D>(
  fn1: (...as: Append<A, Callback<D | void>>) => void,
  fn2: (...bs: Append<B, Callback<C>>) => void
) => (...as: Append<A, Callback<C>>): void => {
  const len = as.length - 1
  const args = array(as, 0, len) as A
  const callback = as[len] as Callback<C>
  fn1(...args, ((error: Error, b: D | void) => {
    if (error) {
      ;(callback as any)(error)
    } else {
      let args2: Append<B, Callback<C>>
      if (fn2.length === 1) {
        args2 = [callback] as any
      } else {
        args2 = [b, callback] as any
      }
      fn2(...args2)
    }
  }) as Callback<D | void>)
}

/**
 * Lift synchronous function to asynchronous function.
 */
export const toAsync = <A extends any[], B>(fn: (...a: A) => B) => (
  ...a: Append<A, Callback<B>>
): void => {
  let error: Error | undefined
  let b: B | undefined
  const len = a.length - 1
  try {
    b = fn(...(array(a, 0, len) as A))
  } catch (e) {
    error = e
  }
  ;(a[len] as Callback<B>)(error, b!)
}

/**
 * Convert an internal callback style function to an external function that can
 * work with callbacks and `Promise`s. If the last parameter is not a function,
 * a `Promise` is returned. That means, that also optional parameters work, but
 * the last parameter before the callback must not be a function.
 */
export const enablePromise = <T extends Append<any[], Callback<any>>>(
  fn: (...args: T) => void
): {
  (...args: T): void
  (...args: Head<T>): Promise<UnwrapCallback<Last<T>>>
} => (...args: any[]): any => {
  let result: Promise<Last<T>> | undefined
  if (!isFunction(args[args.length - 1])) {
    result = new Promise((resolve, reject) => {
      args.push((error: Error | undefined | null, result: Last<T>) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      })
    })
  }
  fn(...(args as T))
  return result
}

/**
 * Use instead of `Array.from` to not annoy older browsers or use instead of
 * `Array#slice`.
 */
export const array = <T>(
  iterable: Iterable<T> | ArrayLike<T>,
  start?: number,
  end?: number
): T[] => slice.call(iterable, start, end)

/**
 * Use instead of `Array.find` to prevent problems with old browsers.
 */
export const find = <T>(
  xs: T[],
  predicate: (x: T) => boolean
): T | undefined => {
  for (const x of xs) {
    if (predicate(x)) {
      return x
    }
  }
}

/**
 * Like `ImageData` constructor but also works in ancient browsers like IE11
 * with the following differences if used in this old environments:
 * - A new buffer is created for the data
 * - Throws if used in a worker
 */
export const createImageData = ((): ((
  data: Uint8ClampedArray,
  width: number,
  height: number
) => ImageData) => {
  try {
    new ImageData(1, 1) // Throws in old browsers
    return (data, width, height) => new ImageData(data, width, height)
  } catch {
    if (environment === Environment.NodeJs) {
      return (data, width, height) => ({ data, width, height })
    }
    return (data, width, height) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
      const imageData = ctx.createImageData(width, height)
      imageData.data.set(data)
      return imageData
    }
  }
})()

/**
 * Read a `Blob` to memory and return an `ArrayBuffer`.
 */
export const readBlob = (blob: Blob, callback: Callback<ArrayBuffer>) => {
  const fileReader = new FileReader()
  fileReader.onload = () => {
    callback(undefined, fileReader.result as ArrayBuffer)
  }
  fileReader.onerror = callback as any
  fileReader.readAsArrayBuffer(blob)
}

/**
 * Converts a node.js Buffer which is a subclass of Uint8Array to a Uint8Array
 * sharing its memory. Returns a given direct Uint8Array.
 */
export const assureDirectUint8Array = (buffer: Buffer | Uint8Array) =>
  environment === Environment.NodeJs && Buffer.isBuffer(buffer)
    ? new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.length)
    : buffer

export const waitState = (
  isState: () => boolean
): [check: () => void, wait: (callback: Callback<void>) => void] => {
  const callbacks: Callback<void>[] = []
  let state = isState()
  const maybeRunCallback = () => {
    while (callbacks.length > 0 && state) {
      const callback = callbacks.shift()!
      ;(callback as any)()
    }
  }
  const check = () => {
    state = isState()
    maybeRunCallback()
  }
  return [
    check,
    (callback: Callback<void>) => {
      callbacks.push(callback)
      maybeRunCallback()
    },
  ]
}
