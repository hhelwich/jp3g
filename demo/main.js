;(async () => {
  console.log(`Using jp3g ${jp3g.version}`)

  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d')

  const image = new Image()
  image.onload = () => {
    canvas.width = image.width
    canvas.height = image.height
    canvas.style.width = '150px'
    ctx.drawImage(image, 0, 0, image.width, image.height)
  }
  image.src = 'lotti.jpg'
})()
