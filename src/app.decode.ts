import { APP, COM, JFIF } from './jpeg'
import { getUint16 } from './common.decode'
import { subarray } from './util'

const dataToString = (data: Uint8Array): string =>
  String.fromCharCode.apply(null, (data as unknown) as number[])

/**
 * Returns true if marker is APP0-APP15 (application-specific data)
 */
export const isAppMarker = (marker: number) => 0xdf < marker && marker < 0xf0

/**
 * Returns true if the APP segment is of type APP0 and starts with the given
 * identifier terminated by zero.
 */
export const isCustomApp0 = (identifier: string) => {
  const { length } = identifier
  return ({ appType, data }: APP) =>
    appType === 0 &&
    data[length] === 0 &&
    dataToString(subarray(data, 0, length)) === identifier
}

/**
 * Returns true if the given APP segment is a JFIF segment.
 */
export const isJFIF = isCustomApp0(JFIF)

/**
 * Decode a comment segment.
 */
export const decodeCOM = (data: Uint8Array): COM => ({
  type: COM,
  text: dataToString(data),
})

/**
 * Decode an APP segment.
 */
export const decodeAPP = (appType: number, data: Uint8Array): APP | JFIF => {
  const app: APP = {
    type: APP,
    appType,
    data,
  }
  return isJFIF(app) ? decodeJFIF(data) : app
}

/**
 * Decode a JFIF segment.
 */
const decodeJFIF = (data: Uint8Array): JFIF => {
  const jfif: JFIF = {
    type: JFIF,
    version: [data[5], data[6]],
    units: data[7],
    density: { x: getUint16(data, 8), y: getUint16(data, 10) },
  }
  const thumbnailX = data[12]
  const thumbnailY = data[13]
  if (thumbnailX > 0 && thumbnailY > 0) {
    jfif.thumbnail = {
      x: thumbnailX,
      y: thumbnailY,
      data: subarray(data, 14),
    }
  }
  return jfif
}
