;(async () => {
  try {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    if (window.Worker) {
      console.log(`Using jp3g ${jp3g.version}`)

      jp3g.setWorker(new Worker('../dist/jp3g.js'))

      const jpegData = await (await fetch('image.jpg')).arrayBuffer()

      const struct = await jp3g.decodeStruct(jpegData)

      const imageData = await jp3g.decodeImage(struct)

      canvas.width = imageData.width
      canvas.height = imageData.height
      ctx.putImageData(imageData, 0, 0)
    }
  } catch (e) {
    console.error('error', e)
  }
})()
