import { version as _version } from '../package.json'
import { Jpeg, SOS } from './jpeg'
import { workerFunction } from './workers'
export { setWorker } from './workers'
import { decode } from './decode'

// Create variable for correct type in d.ts file
export const version = _version

const _decodeStruct = async (jpegData: ArrayBuffer): Promise<Jpeg> =>
  decode(new Uint8Array(jpegData))

export const decodeStruct = workerFunction(
  _decodeStruct,
  jpegData => jpegData,
  segments =>
    // Find the first SOS segment and return the referenced JPEG input buffer.
    // This is sufficient because all data segment (APP, SOS) views reference
    // the same buffer. There is always a SOS segment.
    [
      segments.find((segment): segment is SOS => segment.type === 'SOS')!.data
        .buffer,
    ]
)
