;(async () => {
  try {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    if (window.Worker) {
      console.log(`Using jp3g ${jp3g.version}`)

      jp3g.setWorker(
        new Worker('../dist/jp3g.js'),
        new Worker('../dist/jp3g.js'),
        new Worker('../dist/jp3g.js')
      )

      const jpegData = await (await fetch('lotti.jpg')).arrayBuffer()

      const { width, height, data } = await jp3g.decode(jpegData)

      canvas.width = width
      canvas.height = height
      const imageData = new ImageData(
        new Uint8ClampedArray(data),
        width,
        height
      )
      ctx.putImageData(imageData, 0, 0)
    }
  } catch (e) {
    console.error('error', e)
  }
})()
