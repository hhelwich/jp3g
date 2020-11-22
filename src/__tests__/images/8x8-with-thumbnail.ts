import { readFileSync } from 'fs'
import { Jpeg } from '../../jpeg'
import jpeg8x8 from './8x8'

const thumbnail = Array.from(
  readFileSync('src/__tests__/images/8x8-thumbnail.jpg')
)

const jpeg: Jpeg = jpeg8x8.slice()

jpeg.splice(2, 0, {
  type: 'APP',
  appType: 1,
  data: new Uint8Array(
    // prettier-ignore
    [
      69, 120, 105, 102, 0, 0, 73, 73, 42, 0, 8, 0, 0, 0, 0, 0, 14, 0, 0, 0, 8,
      0, 0, 1, 4, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 4, 0, 1, 0, 0, 0, 0, 1, 0, 0,
      2, 1, 3, 0, 3, 0, 0, 0, 116, 0, 0, 0, 3, 1, 3, 0, 1, 0, 0, 0, 6, 0, 0, 0,
      6, 1, 3, 0, 1, 0, 0, 0, 6, 0, 0, 0, 21, 1, 3, 0, 1, 0, 0, 0, 3, 0, 0, 0,
      1, 2, 4, 0, 1, 0, 0, 0, 122, 0, 0, 0, 2, 2, 4, 0, 1, 0, 0, 0, 196, 7, 0,
      0, 0, 0, 0, 0, 8, 0, 8, 0, 8, 0,
    ].concat(thumbnail)
  ),
})

export default jpeg
