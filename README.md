# JP3G

[![npm](https://img.shields.io/npm/v/jp3g)](https://www.npmjs.com/package/jp3g/) [![npm bundle size](https://img.shields.io/bundlephobia/min/jp3g)](https://unpkg.com/jp3g/dist/jp3g.min.js)

A JPEG decoder written from scratch in TypeScript for the browser and Node.js.

Normally you should use the native decoder/encoder in a browser and e.g. [sharp](https://sharp.pixelplumbing.com/) in Node.js.

Possible use cases for this library:

- Explore the structure and metadata of a JPEG file
- Strip metadata before upload
- Add custom metadata
- Detect corrupt/incomplete JPEG
- Decode image in reduced size to save memory when a thumbnail is needed
- Have same pixel data in different environments
- Use as a basis for a decoder with fancy custom features
- Use as a basis for an encoder with e.g. custom quantization
- Use [test images](./src/__tests__/images#jpeg-test-images) to test another decoder

## Demo

You can test the decoder in this [Demo](https://hhelwich.github.io/jp3g/).

## Features

- Read/Write JPEG structure
- Decode sequential JPEG
- Decode scaled down to 1/8
- Use background threads in a browser
- No dependencies

## Installation

### Node.js

Install with `npm`

```
npm i jp3g
```

and import

```js
const jp3g = require('jp3g')
```

or import as ES module

```js
import jp3g from 'jp3g'
```

### Browser

You can use this `script` element that creates the global variable “`jp3g`”

```html
<script src="https://unpkg.com/jp3g@0.0.7/dist/jp3g.min.js"></script>
```

or install with `npm` as described above and bundle yourself, for example with Webpack.

Supported browsers: Chrome 20+, Firefox 27+, Safari 6+, Edge 40+, Opera 15+, Internet Explorer 11+

## Examples

### Decoding

Decode a JPEG file in a browser and show the image:

```js
// Use one background thread
jp3g.setWorkerCount(1)
// Decode JPEG in background thread
const imageData = await jp3g(file).toImageData()
// Show image
const canvas = document.createElement('canvas')
canvas.width = imageData.width
canvas.height = imageData.height
const ctx = canvas.getContext('2d')
ctx.putImageData(imageData, 0, 0)
document.body.appendChild(canvas)
```

### Edit structure

Load a JPEG file in Node.js and save without comments:

```js
import jp3g from 'jp3g'
import { readFileSync, writeFileSync } from 'fs'
;(async () => {
  // Parse JPEG
  const jpegBuffer = readFileSync('image-with-comments.jpg')
  const jpeg = await jp3g(jpegBuffer).toObject()
  // Remove comments
  const jpegNew = jpeg.filter(segment => segment.type !== 'COM')
  // Write JPEG without comments
  const jpegNewBuffer = await jp3g(jpegNew).toBuffer()
  writeFileSync('image-without-comments.jpg', jpegNewBuffer)
})()
```

### Decode scaled down

Decode an image scaled down. Currently, only the factor `1/8` is supported:

```js
const imageData = await jp3g(file)
  .scale(1 / 8)
  .toImageData()
```

### Use callbacks

For ancient browsers without `Promise` support you can alternatively use callbacks:

```js
jp3g(file).toImageData(function (err, imageData) {
  if (err) {
    console.log(err)
    return
  }
  // ...
})
```
