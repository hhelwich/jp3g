/// <reference path="../../dist/types/index.d.ts" />

type Callback<T> = (error: Error | undefined | null, result: T) => void

const loadCanvas = (
  file: File,
  downScale: number,
  callback: Callback<HTMLCanvasElement>
) => {
  jp3g(file)
    .scale(1 / downScale)
    .toImageData((error, imageData) => {
      let canvas: HTMLCanvasElement | undefined
      if (!error) {
        canvas = document.createElement('canvas')
        canvas.width = imageData.width
        canvas.height = imageData.height
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
        ctx.putImageData(imageData, 0, 0)
      }
      callback(error, canvas as HTMLCanvasElement)
    })
}

let imageCount = 0
let imagesDone = 0

let startTime: number

const draw = () => {
  const canvas = document.getElementById('files-progress') as HTMLCanvasElement
  const width = canvas.clientWidth
  const height = canvas.clientHeight
  canvas.width = width
  canvas.height = height
  const size = Math.min(width, height)

  if (imagesDone < imageCount) {
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    // Draw filled progress circle segment
    ctx.translate(width / 2, height / 2)
    ctx.fillStyle = '#0075fa'
    ctx.save()
    ctx.rotate((2 * Math.PI * (Date.now() - startTime)) / 12000)
    ctx.beginPath()
    ctx.lineTo(0, 0)
    const angle = 2 * Math.PI * (imagesDone / imageCount)
    ctx.arc(0, 0, size / 2, 1.5 * Math.PI, 1.5 * Math.PI + angle)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }
  requestAnimationFrame(draw)
}

let workerCount: number
let downScale: number

const $files = document.getElementById('files-input') as HTMLInputElement
const $images = document.getElementById('images') as HTMLInputElement
const $workerCount = document.getElementById('worker-count') as HTMLInputElement
const $workerCountLabel = $workerCount.previousElementSibling as HTMLElement
const $filesButton = document.getElementById('files') as HTMLElement
const $downScale = document.getElementById('down-scale') as HTMLInputElement
const $message = document.getElementById('message') as HTMLElement
const messageSeconds = 2
let messageCounter = 0
const showMessage = (message: string) => {
  $message.innerHTML = message
  $message.style.display = 'block'
  const id = ++messageCounter
  setTimeout(() => {
    if (id === messageCounter) {
      $message.style.display = 'none'
    }
  }, messageSeconds * 1000)
}

const showWorkerLabel = () => {
  const count = +$workerCount.value
  $workerCountLabel.innerHTML = `${count} Background Thread${
    count === 1 ? '<span style="opacity:0;">s</span>' : 's'
  }`
}

const setWorkerCount = () => {
  workerCount = +$workerCount.value
  jp3g.setWorkerCount(workerCount)
  showWorkerLabel()
}

$workerCount.addEventListener('input', showWorkerLabel)
$workerCount.addEventListener('change', setWorkerCount)

if (!window.Worker) {
  $workerCount.disabled = true
  $workerCount.value = '0'
}

setWorkerCount()

{
  const downScaleHandler = () => {
    downScale = $downScale.checked ? 8 : 1
  }
  $downScale.addEventListener('change', downScaleHandler)
  downScaleHandler()

  $filesButton.addEventListener('click', () => {
    $files.click()
  })
}

let filesAddCounter = 0
$files.addEventListener('change', () => {
  const id = ++filesAddCounter
  const files = $files.files ?? []
  $images.innerHTML = ''
  imagesDone = 0
  imageCount = files.length
  startTime = Date.now()
  const isCurrent = () => id === filesAddCounter
  for (let i = 0; i < imageCount; i += 1) {
    const file = files[i]
    jp3g.waitIdle(() => {
      if (isCurrent()) {
        loadCanvas(file, downScale, (error, canvas) => {
          if (isCurrent()) {
            if (error) {
              showMessage(`⚠️ ${error.message}`)
            } else {
              $images.appendChild(canvas)
            }
            imagesDone += 1
            if (imagesDone === imageCount) {
              const duration = Math.round((Date.now() - startTime) / 1000)
              showMessage(
                `Done in ${duration} second${duration === 1 ? '' : 's'}`
              )
            }
          }
        })
      }
    })
  }
})

console.log(`Using jp3g ${jp3g.version}`)

requestAnimationFrame(draw)
