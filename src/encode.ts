import { Jpeg } from './decode'
import { isNode } from './isNode'

const createBuffer = (size: number) =>
  isNode ? Buffer.alloc(size) : new Uint8Array(size)

export const encode = (jpeg: Jpeg): Uint8Array => {
  const length = jpeg.struct.reduce(
    (sum, { data }) => sum + (data == null ? 0 : jpeg.data[data].length) + 2,
    0
  )
  const result = createBuffer(length)
  let offset = 0
  for (const { type, data } of jpeg.struct) {
    result[offset++] = 0xff
    result[offset++] = type
    if (data != null) {
      const segData = jpeg.data[data]
      result.set(segData, offset)
      offset += segData.length
    }
  }
  return result
}
