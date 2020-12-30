import { version as _version } from '../package.json'
import { Jpeg, SOS, APP } from './jpeg'
import { workerFunction, setWorkerCount } from './workers'
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
} from './util'
import { decodeFrame, DecodeOptions } from './frame.decode'

const { isArray } = Array

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
  jpegData: ArrayBufferLike | Blob,
  callback: Callback<Jpeg>
) => void = workerFunction(
  composeAsync(
    composeAsync(
      toAsync(([a]: [ArrayBufferLike | Blob]) => a),
      toArrayBuffer
    ),
    toAsync((a: ArrayBufferLike): [ArrayBufferLike] => [a])
  ),
  identity,
  (jpegData: ArrayBufferLike) => decodeJpeg(new Uint8Array(jpegData)),
  jpeg => [getJpegBuffer(jpeg)],
  identity
)

const decodeImage: {
  (jpeg: Jpeg, options?: DecodeOptions): Promise<ImageData>
  (jpeg: Jpeg, callback: Callback<ImageData>): void
  (
    jpeg: Jpeg,
    options: DecodeOptions | undefined,
    callback: Callback<ImageData>
  ): void
} = workerFunction(
  toAsync(identity) as (
    args: [Jpeg, DecodeOptions | undefined],
    callback: Callback<[Jpeg, DecodeOptions | undefined]>
  ) => void,
  ([jpeg]) => [getJpegBuffer(jpeg)],
  decodeFrame,
  ([data]) => [data.buffer],
  args => createImageData(...args)
) as any

const create = (jpegData: ArrayBufferLike | Blob | Jpeg, _factor: number) => {
  const toJPEG = (callback: Callback<Jpeg>) => {
    if (!isArray(jpegData)) {
      decode(jpegData, callback)
    } else {
      callback(null, jpegData)
    }
  }
  return {
    scale: (factor: number) => create(jpegData, _factor * factor),
    toJPEG: enablePromise(toJPEG),
    toImageData: enablePromise((callback: Callback<ImageData>) => {
      toJPEG((error, jpeg) => {
        if (error) {
          ;(callback as any)(error)
        } else {
          decodeImage(jpeg, { downScale: 1 / _factor }, callback)
        }
      })
    }),
  }
}

const _jp3g = (jpegData: ArrayBufferLike | Blob | Jpeg) => create(jpegData, 1)

_jp3g.setWorkerCount = setWorkerCount
_jp3g.version = version

export default _jp3g

declare global {
  const jp3g: typeof _jp3g
}
