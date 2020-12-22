const { slice } = Array.prototype

/**
 * Just the identity function.
 */
export const identity = <T>(a: T): T => a

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
