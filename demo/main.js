;(async () => {
  try {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    if (window.Worker) {
      console.log(`Using jp3g ${jp3g.version}`)

      const workerCount = 3
      jp3g.setWorker(
        ...[...Array(workerCount)].map(() => new Worker('../dist/jp3g.js'))
      )

      const jpegData = await (await fetch('lotti.jpg')).arrayBuffer()

      const struct = await jp3g.decodeStruct(jpegData)

      console.log(JSON.stringify(struct, null, 2))

      /*
      canvas.width = width
      canvas.height = height
      const imageData = new ImageData(
        new Uint8ClampedArray(data),
        width,
        height
      )
      ctx.putImageData(imageData, 0, 0)
      */
    }
  } catch (e) {
    console.error('error', e)
  }
})()
