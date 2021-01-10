import { version as _version } from '../package.json'
import { Jpeg, SOS, APP } from './jpeg'
import { workerFunction, setWorkerCount, maxWorkerCount } from './workers'
import { decodeJpeg } from './jpeg.decode'
import {
  identity,
  find,
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

const getBuffer = (dataContainer: ImageData | SOS | APP): ArrayBufferLike =>
  dataContainer.data.buffer

const getJpegBuffer = (jpeg: Jpeg): ArrayBufferLike =>
  // Find the first SOS segment and return the referenced JPEG input buffer.
  // This is sufficient because all data segment (APP, SOS) views reference
  // the same buffer. There is always a SOS segment.
  getBuffer(
    find(jpeg, segment => segment.type === APP || segment.type === SOS) as
      | APP
      | SOS
  )

const toArrayBuffer = (
  data: ArrayBufferLike | Blob,
  callback: Callback<ArrayBufferLike>
) => {
  if (isBlob(data)) {
    readBlob(data, callback)
  } else {
    callback(null, data)
  }
}

const decode: (
  jpegData: ArrayBufferLike,
  callback: Callback<Jpeg>
) => void = workerFunction(
  identity,
  (jpegData: ArrayBufferLike) => decodeJpeg(new Uint8Array(jpegData)),
  jpeg => [getJpegBuffer(jpeg)]
)

const decodeImage: (
  jpeg: Jpeg,
  options: DecodeOptions,
  callback: Callback<ImageDataArgs>
) => void = workerFunction(
  ([jpeg]) => [getJpegBuffer(jpeg)],
  decodeFrame,
  ([data]) => [data.buffer]
) as any

const decodeImage2 = (decodeOptions: DecodeOptions) => (
  jpeg: Jpeg,
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

const create = (jpegData: ArrayBufferLike | Blob | Jpeg, _factor: number) => {
  const toJPEG = (callback: Callback<Jpeg>) => {
    if (!isArray(jpegData)) {
      composeAsync(toArrayBuffer, decode)(jpegData, callback)
    } else {
      callback(null, jpegData)
    }
  }
  return {
    scale: (factor: number) => create(jpegData, _factor * factor),
    toJPEG: enablePromise(trackAsync(toJPEG)),
    toImageData: enablePromise(
      trackAsync(
        composeAsync(
          toJPEG,
          composeAsync(
            decodeImage2({ downScale: 1 / _factor }),
            toAsync((args: ImageDataArgs) => createImageData(...args))
          )
        )
      )
    ),
  }
}

const _jp3g = (jpegData: ArrayBufferLike | Blob | Jpeg) => create(jpegData, 1)

_jp3g.setWorkerCount = setWorkerCount
_jp3g.waitIdle = waitFnSlotAvailable
_jp3g.version = version

export default _jp3g

declare global {
  const jp3g: typeof _jp3g
}
