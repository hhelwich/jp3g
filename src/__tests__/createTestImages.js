'use strict'
// npm install canvas
// npx tsc src/__tests__/createTestImages.ts
// node src/__tests__/createTestImages.js
exports.__esModule = true
var fs_1 = require('fs')
var canvas_1 = require('canvas')
/**
 * Create test PNG image which has full red, green, blue (when square), black
 * and white pixels and fades between them.
 */
var createTestImage = function (width, height) {
  var canvas = canvas_1.createCanvas(width, height)
  var ctx = canvas.getContext('2d')
  // Center of the image
  var cx = (width - 1) / 2
  var cy = (height - 1) / 2
  // Region which has black and white
  var sx0 = Math.round(width / 4)
  var sx1 = Math.round((width / 4) * 3)
  var sy0 = Math.round(height / 4)
  var sy1 = Math.round((height / 4) * 3)
  for (var x = 0; x < width; x += 1) {
    for (var y = 0; y < height; y += 1) {
      var a = ((Math.atan2(y - cy, x - cx) / Math.PI) * 180 + 495) % 360
      // Stretch angle so red, green and blue are in the corners
      var h = a <= 180 ? (a / 3) * 4 : (a / 3) * 2 + 120
      var l = 50
      // Fade lightness in the middle of image to have black and white pixel
      if (x >= sx0 && x < sx1 && y >= sy0 && y < sy1) {
        var nx = (x - sx0) / (sx1 - sx0 - 1)
        var ny = (y - sy0) / (sy1 - sy0 - 1)
        l = Math.sqrt(Math.pow(nx + ny, 2) / 4) * 100
      }
      ctx.fillStyle = 'hsl(' + h + ',100%,' + l + '%)'
      ctx.fillRect(x, y, 1, 1)
    }
  }
  return canvas.toBuffer()
}
fs_1.writeFileSync(
  'src/__tests__/images/8x8-original.png',
  createTestImage(8, 8)
)
