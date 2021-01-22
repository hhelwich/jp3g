/// <reference path="../dist/types/index.d.ts" />
var loadCanvas = function (file, downScale, callback) {
    jp3g(file)
        .scale(1 / downScale)
        .toImageData(function (error, imageData) {
        var canvas;
        if (!error) {
            canvas = document.createElement('canvas');
            canvas.width = imageData.width;
            canvas.height = imageData.height;
            var ctx = canvas.getContext('2d');
            ctx.putImageData(imageData, 0, 0);
        }
        callback(error, canvas);
    });
};
var imageCount = 0;
var imagesDone = 0;
var startTime;
var draw = function () {
    var canvas = document.getElementById('files');
    var width = canvas.clientWidth;
    var height = canvas.clientHeight;
    canvas.width = width;
    canvas.height = height;
    var size = Math.min(width, height);
    var ctx = canvas.getContext('2d');
    // Draw filled circle
    ctx.fillStyle = '#69c';
    ctx.translate(width / 2, height / 2);
    ctx.beginPath();
    ctx.arc(0, 0, size / 2, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    // Draw filled progress circle segment
    ctx.fillStyle = '#fff';
    ctx.save();
    ctx.rotate((2 * Math.PI * (Date.now() - startTime)) / 12000);
    ctx.beginPath();
    ctx.lineTo(0, 0);
    var angle = 2 * Math.PI * (imagesDone / imageCount);
    ctx.arc(0, 0, (size / 2) * 0.95, 1.5 * Math.PI + angle, 1.5 * Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    // Draw plus icon
    ctx.fillRect(-size / 56, -size / 8, size / 28, size / 4);
    ctx.fillRect(-size / 8, -size / 56, size / 4, size / 28);
    requestAnimationFrame(draw);
};
var workerCount;
var downScale;
var $files = document.getElementById('files-input');
var $images = document.getElementById('images');
var $workerCount = document.getElementById('workerCount');
var $downScale = document.getElementById('downScale');
var $message = document.getElementById('message');
var messageSeconds = 2;
var messageCounter = 0;
var showMessage = function (message) {
    $message.innerHTML = message;
    $message.style.display = 'block';
    var id = ++messageCounter;
    setTimeout(function () {
        if (id === messageCounter) {
            $message.style.display = 'none';
        }
    }, messageSeconds * 1000);
};
var showWorkerLabel = function () {
    var count = +$workerCount.value;
    $workerCount.previousElementSibling.innerHTML = count + " Background Thread" + (count === 1 ? '' : 's');
};
var setWorkerCount = function () {
    workerCount = +$workerCount.value;
    jp3g.setWorkerCount(workerCount);
    showWorkerLabel();
};
$workerCount.addEventListener('input', showWorkerLabel);
$workerCount.addEventListener('change', setWorkerCount);
if (!window.Worker) {
    $workerCount.disabled = true;
    $workerCount.value = '0';
}
setWorkerCount();
{
    var downScaleHandler = function () {
        downScale = $downScale.checked ? 8 : 1;
    };
    $downScale.addEventListener('change', downScaleHandler);
    downScaleHandler();
    document.getElementById('files').addEventListener('click', function () {
        document.getElementById('files-input').click();
    });
}
var filesAddCounter = 0;
$files.addEventListener('change', function () {
    var id = ++filesAddCounter;
    var files = $files.files;
    $images.innerHTML = '';
    imagesDone = 0;
    imageCount = files.length;
    startTime = Date.now();
    var isCurrent = function () { return id === filesAddCounter; };
    var _loop_1 = function (i) {
        var file = files[i];
        jp3g.waitIdle(function () {
            if (isCurrent()) {
                loadCanvas(file, downScale, function (error, canvas) {
                    if (isCurrent()) {
                        if (error) {
                            showMessage("\u26A0\uFE0F " + error.message);
                        }
                        else {
                            $images.appendChild(canvas);
                        }
                        imagesDone += 1;
                        if (imagesDone === imageCount) {
                            var duration = Math.round((Date.now() - startTime) / 1000);
                            showMessage("Done in " + duration + " second" + (duration === 1 ? '' : 's'));
                        }
                    }
                });
            }
        });
    };
    for (var i = 0; i < imageCount; i += 1) {
        _loop_1(i);
    }
});
console.log("Using jp3g " + jp3g.version);
requestAnimationFrame(draw);
