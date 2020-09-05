;(async () => {
  console.log(`Using jp3g ${jp3g.version}`)

  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d')

  const jpegData = await (await fetch('lotti.jpg')).arrayBuffer()

  const imageData = await jp3g.decode(jpegData)

  canvas.width = imageData.width
  canvas.height = imageData.height
  ctx.putImageData(imageData, 0, 0)
})()
