;(async () => {
  try {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    console.log(`Using jp3g ${jp3g.version}`)

    if (window.Worker) {
      jp3g.setWorkers(new Worker('../dist/jp3g.js'))
    }

    const jpegData = await (await fetch('image.jpg')).arrayBuffer()
    const jpeg = await jp3g.decode(jpegData)
    const imageData = await jp3g.decodeImage(jpeg)
    canvas.width = imageData.width
    canvas.height = imageData.height
    ctx.putImageData(imageData, 0, 0)
  } catch (e) {
    console.error('error', e)
  }
})()
