/// <reference path="../dist/types/index.d.ts" />
var showImage = function (file, main, downScale, callback) {
  jp3g(file)
    .scale(1 / downScale)
    .toImageData(function (error, imageData) {
      if (error) {
        callback(error, null)
        return
      }
      var canvas = document.createElement('canvas')
      canvas.width = imageData.width
      canvas.height = imageData.height
      main.appendChild(canvas)
      var ctx = canvas.getContext('2d')
      ctx.putImageData(imageData, 0, 0)
      callback(null, null)
    })
}
var imageCount = 0
var queuedImageCount = 0
var draw = function () {
  var canvas = document.getElementById('loader')
  var width = canvas.clientWidth
  var height = canvas.clientHeight
  canvas.width = width
  canvas.height = height
  var size = Math.min(width, height)
  var ctx = canvas.getContext('2d')
  ctx.fillStyle = '#69c'
  ctx.translate(width / 2, height / 2)
  var time = new Date()
  ctx.rotate(
    ((10 * Math.PI) / 60) * time.getSeconds() +
      ((10 * Math.PI) / 60000) * time.getMilliseconds()
  )
  ctx.beginPath()
  ctx.lineTo(0, 0)
  ctx.arc(0, 0, size / 2, 0, Math.PI * 1.8 * (queuedImageCount / imageCount))
  ctx.closePath()
  ctx.fill()
  requestAnimationFrame(draw)
}
var workerCount = 0
var downScale
var $files = document.getElementById('files-input')
var $main = document.getElementById('main')
var $workerCount = document.getElementById('workerCount')
var $downScale = document.getElementById('downScale')
var setWorkerCount = function () {
  workerCount = +$workerCount.value
  jp3g.setWorkerCount(workerCount)
}
$workerCount.addEventListener('change', setWorkerCount)
if (!window.Worker) {
  $workerCount.disabled = true
  $workerCount.value = '0'
  //$workerCount.dispatchEvent(new Event('input'))
} else {
  $workerCount.value = '' + workerCount
  //$workerCount.dispatchEvent(new Event('input'))
}
setWorkerCount()
{
  var downScaleHandler = function () {
    downScale = $downScale.checked ? 8 : 1
  }
  $downScale.addEventListener('change', downScaleHandler)
  downScaleHandler()
}
$files.addEventListener(
  'change',
  function () {
    var files = $files.files
    $main.innerHTML = ''
    queuedImageCount += files.length
    imageCount = queuedImageCount
    var _loop_1 = function (i) {
      var file = files[i]
      jp3g.waitIdle(function () {
        showImage(file, $main, downScale, function (error) {
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
    for (var i = 0; i < files.length; i += 1) {
      _loop_1(i)
    }
  },
  false
)
console.log('Using jp3g ' + jp3g.version)
requestAnimationFrame(draw)
