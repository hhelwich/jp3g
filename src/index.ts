import { version as _version } from '../package.json'
import { Jpeg, SOS, APP } from './jpeg'
import { workerFunction } from './workers'
export { setWorker } from './workers'
import { decodeJpeg } from './jpeg.decode'
import { identity } from './util'
import { decodeFrame } from './frame.decode'

// Create variable for correct type in d.ts file (will be removed my minifier)
export const version = _version

const getBuffer = (dataContainer: ImageData | SOS | APP): ArrayBufferLike[] => [
  dataContainer.data.buffer,
]

const getJpegBuffer = (jpeg: Jpeg): ArrayBufferLike[] =>
  // Find the first SOS segment and return the referenced JPEG input buffer.
  // This is sufficient because all data segment (APP, SOS) views reference
  // the same buffer. There is always a SOS segment.
  getBuffer(
    jpeg.find(segment => segment.type === 'APP' || segment.type === 'SOS') as
      | APP
      | SOS
  )

const _decode = async (jpegData: ArrayBufferLike): Promise<Jpeg> =>
  decodeJpeg(new Uint8Array(jpegData))

const _decodeImage = async (jpeg: Jpeg): Promise<ImageData> => {
  const { data, width, height } = decodeFrame(jpeg)
  return new ImageData(data, width, height)
}

export const decode = workerFunction(_decode, identity, getJpegBuffer)

export const decodeImage = workerFunction(
  _decodeImage,
  ([jpeg]) => getJpegBuffer(jpeg),
  getBuffer
)
