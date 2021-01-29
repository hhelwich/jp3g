import { version as _version } from '../package.json'
import { JPEG, APP, JFIF, DQT } from './jpeg'
import { workerFunction, setWorkerCount, maxWorkerCount } from './workers'
import { decodeJpeg } from './jpeg.decode'
import { encodeJpeg } from './jpeg.encode'
import {
  createImageData,
  readBlob,
  Callback,
  isBlob,
  composeAsync,
  toAsync,
  enablePromise,
  waitState,
  Append,
} from './util'
import { decodeFrame, DecodeOptions, ImageDataArgs } from './frame.decode'

const { isArray } = Array
const { max } = Math

// Create variable for correct type in d.ts file (will be removed my minifier)
const version = _version

const getBuffer = (dataContainer: {
  data: Uint8Array | Uint8ClampedArray | Uint16Array
}): ArrayBuffer => dataContainer.data.buffer

/**
 * Return all `ArrayBuffer`s used in the JPEG object.
 */
const getJpegBuffers = (jpeg: JPEG): ArrayBuffer[] => {
  const buffers: ArrayBuffer[] = []
  let addedMainBuf = false
  for (const segment of jpeg) {
    if (segment.type === DQT) {
      for (const table of segment.tables) {
        buffers.push(getBuffer(table))
      }
    } else if (!addedMainBuf) {
      if (segment.type === JFIF && segment.thumbnail) {
        buffers.push(getBuffer(segment.thumbnail))
        addedMainBuf = true
      } else if (segment.type === APP || segment.type === 'SOS') {
        buffers.push(getBuffer(segment))
        addedMainBuf = true
      }
    }
  }
  return buffers
}

const toUint8Array = (
  data: ArrayBuffer | Blob | Uint8Array,
  callback: Callback<Uint8Array>
) => {
  if (isBlob(data)) {
    readBlob(data, callback)
  } else {
    if (data instanceof ArrayBuffer) {
      data = new Uint8Array(data)
    }
    callback(null, data as Uint8Array)
  }
}

const decode: (
  jpegData: Uint8Array,
  callback: Callback<JPEG>
) => void = workerFunction(
  ([jpegData]) => [jpegData.buffer],
  decodeJpeg,
  getJpegBuffers
)

const encode: (
  jpeg: JPEG,
  callback: Callback<Uint8Array>
) => void = workerFunction(
  ([jpeg]) => getJpegBuffers(jpeg),
  encodeJpeg,
  jpegUint8 => [jpegUint8.buffer]
)

const decodeImage: (
  jpeg: JPEG,
  options: DecodeOptions,
  callback: Callback<ImageDataArgs>
) => void = workerFunction(
  ([jpeg]) => getJpegBuffers(jpeg),
  decodeFrame,
  ([data]) => [data.buffer]
) as any

const decodeImage2 = (decodeOptions: DecodeOptions) => (
  jpeg: JPEG,
  callback: Callback<ImageDataArgs>
) => {
  decodeImage(jpeg, decodeOptions, callback)
}

let fnCounter = 0

const [checkFnSlotAvailable, waitFnSlotAvailable] = waitState(
  () => fnCounter < max(maxWorkerCount, 1) + 1
)

const trackAsync = <T extends Append<any[], Callback<any>>>(
  fn: (...args: T) => void
) => (...args: T): void => {
  fnCounter += 1
  checkFnSlotAvailable()
  const lastIndex = args.length - 1
  const callback = args[lastIndex]
  args[lastIndex] = ((error, result) => {
    fnCounter -= 1
    checkFnSlotAvailable()
    callback(error, result)
  }) as Callback<any>
  fn(...args)
}

type JP3G = {
  scale: (factor: number) => JP3G
  toObject: {
    (callback: Callback<JPEG>): void
    (): Promise<JPEG>
  }
  toBuffer: {
    (callback: Callback<Uint8Array>): void
    (): Promise<Uint8Array>
  }
  toImageData: {
    (args_0: Callback<ImageData>): void
    (): Promise<ImageData>
  }
}

const create = (
  jpegData: Uint8Array | ArrayBuffer | Blob | JPEG,
  _factor: number
): JP3G => {
  const toObject = (callback: Callback<JPEG>) => {
    if (isArray(jpegData)) {
      callback(null, jpegData)
    } else {
      composeAsync(toUint8Array, decode)(jpegData, callback)
    }
  }
  const toBuffer = (callback: Callback<Uint8Array>) => {
    if (isArray(jpegData)) {
      encode(jpegData, callback)
    } else {
      toUint8Array(jpegData, callback)
    }
  }
  return {
    scale: (factor: number) => create(jpegData, _factor * factor),
    toObject: enablePromise(trackAsync(toObject)),
    toBuffer: enablePromise(trackAsync(toBuffer)),
    toImageData: enablePromise(
      trackAsync(
        composeAsync(
          toObject,
          composeAsync(
            decodeImage2({ downScale: 1 / _factor }),
            toAsync((args: ImageDataArgs) => createImageData(...args))
          )
        )
      )
    ),
  }
}

const _jp3g = (jpegData: Uint8Array | ArrayBuffer | Blob | JPEG) =>
  create(jpegData, 1)

_jp3g.setWorkerCount = setWorkerCount
_jp3g.waitIdle = waitFnSlotAvailable
_jp3g.version = version

export default _jp3g

export { JPEG }

declare global {
  const jp3g: typeof _jp3g
}
