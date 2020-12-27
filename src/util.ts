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
export type Callback<T> = (error: Error | undefined, result: T) => void

const { slice } = Array.prototype

export const isFunction = (f: unknown): f is Function => typeof f === 'function'

export const isBlob = (b: unknown): b is Blob => b instanceof Blob

/**
 * Just the identity function.
 */
export const identity = <T>(a: T): T => a

/**
 * Compose two asynchronous functions.
 */
export const composeAsync = <A, B, C>(
  fn1: (a: A, callback: Callback<B>) => void,
  fn2: (b: B, callback: Callback<C>) => void
) => (a: A, callback: Callback<C>): void => {
  fn1(a, (error, result) => {
    if (error) {
      ;(callback as any)(error)
    } else {
      fn2(result, callback)
    }
  })
}

/**
 * Lift synchronous function to asynchronous function.
 */
export const toAsync = <A, B>(fn: (a: A) => B) => (
  a: A,
  callback: Callback<B>
): void => {
  let error: Error | undefined
  let b: B | undefined
  try {
    b = fn(a)
  } catch (e) {
    error = e
  }
  callback(error, b!)
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
