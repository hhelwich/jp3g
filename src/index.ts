import { version as _version } from '../package.json'
import { Jpeg, SOS, APP } from './jpeg'
import { workerFunction } from './workers'
import { setWorkers } from './workers'
import { decodeJpeg } from './jpeg.decode'
import { identity, find, createImageData } from './util'
import { decodeFrame } from './frame.decode'

// Create variable for correct type in d.ts file (will be removed my minifier)
const version = _version

const getBuffer = (dataContainer: ImageData | SOS | APP): ArrayBufferLike[] => [
  dataContainer.data.buffer,
]

const getJpegBuffer = (jpeg: Jpeg): ArrayBufferLike[] =>
  // Find the first SOS segment and return the referenced JPEG input buffer.
  // This is sufficient because all data segment (APP, SOS) views reference
  // the same buffer. There is always a SOS segment.
  getBuffer(
    find(jpeg, segment => segment.type === APP || segment.type === SOS) as
      | APP
      | SOS
  )

const _decode = async (jpegData: ArrayBufferLike): Promise<Jpeg> =>
  decodeJpeg(new Uint8Array(jpegData))

type DecodeOptions = {
  downScale?: number
}

const _decodeImage = async (
  jpeg: Jpeg,
  options?: DecodeOptions
): Promise<ImageData> => {
  const { data, width, height } = decodeFrame(jpeg, options?.downScale)
  return createImageData(data, width, height)
}

const decode = workerFunction(_decode, identity, getJpegBuffer)

const decodeImage = workerFunction(
  _decodeImage,
  ([jpeg]) => getJpegBuffer(jpeg),
  getBuffer
)

const _jp3g = { setWorkers, version, decode, decodeImage }

export default _jp3g

declare global {
  const jp3g: typeof _jp3g
}
