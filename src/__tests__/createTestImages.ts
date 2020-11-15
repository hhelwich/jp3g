// npm install canvas
// npx tsc src/__tests__/createTestImages.ts
// node src/__tests__/createTestImages.js

import { writeFileSync } from 'fs'
import { createCanvas } from 'canvas'

/**
 * Create test PNG image which has full red, green, blue (when square), black
 * and white pixels and fades between them.
 */
const createTestImage = (width: number, height: number) => {
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')
  // Center of the image
  const cx = (width - 1) / 2
  const cy = (height - 1) / 2
  // Region which has black and white
  const sx0 = Math.round(width / 4)
  const sx1 = Math.round((width / 4) * 3)
  const sy0 = Math.round(height / 4)
  const sy1 = Math.round((height / 4) * 3)
  for (let x = 0; x < width; x += 1) {
    for (let y = 0; y < height; y += 1) {
      const a = ((Math.atan2(y - cy, x - cx) / Math.PI) * 180 + 495) % 360
      // Stretch angle so red, green and blue are in the corners
      const h = a <= 180 ? (a / 3) * 4 : (a / 3) * 2 + 120
      let l = 50
      // Fade lightness in the middle of image to have black and white pixel
      if (x >= sx0 && x < sx1 && y >= sy0 && y < sy1) {
        const nx = (x - sx0) / (sx1 - sx0 - 1)
        const ny = (y - sy0) / (sy1 - sy0 - 1)
        l = Math.sqrt((nx + ny) ** 2 / 4) * 100
      }
      ctx.fillStyle = `hsl(${h},100%,${l}%)`
      ctx.fillRect(x, y, 1, 1)
    }
  }
  return canvas.toBuffer()
}

writeFileSync('src/__tests__/images/8x8-original.png', createTestImage(8, 8))
