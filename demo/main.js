;(async () => {
  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d')

  if (window.Worker) {
    const jp3gWorker = new Worker('../dist/jp3g.min.js')

    // console.log(`Using jp3g ${jp3g.version}`)
    const jpegData = await (await fetch('lotti.jpg')).arrayBuffer()

    jp3gWorker.postMessage(
      {
        action: 'decode',
        buf: jpegData,
      },
      [jpegData]
    )
    jp3gWorker.onmessage = ({ data: { width, height, data } }) => {
      canvas.width = width
      canvas.height = height
      const imageData = new ImageData(
        new Uint8ClampedArray(data),
        width,
        height
      )
      ctx.putImageData(imageData, 0, 0)
    }
  }
})()
