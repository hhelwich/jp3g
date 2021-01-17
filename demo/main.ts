/// <reference path="../dist/types/index.d.ts" />

type Callback<T> = (error: Error | undefined | null, result: T) => void

const showImage = (
  file: File,
  main: HTMLElement,
  downScale: number,
  callback: Callback<void>
) => {
  jp3g(file)
    .scale(1 / downScale)
    .toImageData((error, imageData) => {
      if (error) {
        callback(error, null)
        return
      }
      const canvas = document.createElement('canvas')
      canvas.width = imageData.width
      canvas.height = imageData.height
      main.appendChild(canvas)
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
      ctx.putImageData(imageData, 0, 0)
      callback(null, null)
    })
}

let imageCount = 0
let queuedImageCount = 0

let startTime: number

const draw = () => {
  const canvas = document.getElementById('files-icon') as HTMLCanvasElement
  const width = canvas.clientWidth
  const height = canvas.clientHeight
  canvas.width = width
  canvas.height = height
  const size = Math.min(width, height)
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

  // Draw filled circle
  ctx.fillStyle = '#69c'
  ctx.translate(width / 2, height / 2)
  ctx.beginPath()
  ctx.arc(0, 0, size / 2, 0, 2 * Math.PI)
  ctx.closePath()
  ctx.fill()
  // Draw filled progress circle segment
  ctx.fillStyle = '#fff'
  ctx.save()
  ctx.rotate((2 * Math.PI * (Date.now() - startTime)) / 12000)
  ctx.beginPath()
  ctx.lineTo(0, 0)
  const angle = 2 * Math.PI * (queuedImageCount / imageCount)
  ctx.arc(0, 0, (size / 2) * 0.95, 1.5 * Math.PI - angle, 1.5 * Math.PI)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
  // Draw plus icon
  ctx.fillRect(-size / 56, -size / 8, size / 28, size / 4)
  ctx.fillRect(-size / 8, -size / 56, size / 4, size / 28)
  requestAnimationFrame(draw)
}

let workerCount = 0
let downScale: number

const $files = document.getElementById('files-input') as HTMLInputElement
const $main = document.getElementById('main')
const $workerCount = document.getElementById('workerCount') as HTMLInputElement
const $downScale = document.getElementById('downScale') as HTMLInputElement

const setWorkerCount = () => {
  workerCount = +$workerCount.value
  jp3g.setWorkerCount(workerCount)
}

$workerCount.addEventListener('change', setWorkerCount)
if (!window.Worker) {
  $workerCount.disabled = true
  $workerCount.value = '0'
  //$workerCount.dispatchEvent(new Event('input'))
} else {
  $workerCount.value = `${workerCount}`
  //$workerCount.dispatchEvent(new Event('input'))
}
setWorkerCount()

{
  const downScaleHandler = () => {
    downScale = $downScale.checked ? 8 : 1
  }
  $downScale.addEventListener('change', downScaleHandler)
  downScaleHandler()
}

$files.addEventListener(
  'change',
  () => {
    const files = $files.files
    $main.innerHTML = ''
    queuedImageCount += files.length
    imageCount = queuedImageCount

    startTime = Date.now()
    for (let i = 0; i < files.length; i += 1) {
      const file = files[i]
      jp3g.waitIdle(() => {
        showImage(file, $main, downScale, error => {
          if (error) {
            console.error(error)
          }
          queuedImageCount -= 1
          if (queuedImageCount === 0) {
            imageCount = 0
          }
        })
      })
    }
  },
  false
)

console.log(`Using jp3g ${jp3g.version}`)

requestAnimationFrame(draw)
