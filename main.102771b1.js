// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"ZCfc":[function(require,module,exports) {
"use strict";

var _a;

var loadCanvas = function loadCanvas(file, downScale, callback) {
  jp3g(file).scale(1 / downScale).toImageData(function (error, imageData) {
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
var requestDraw = (_a = window.requestAnimationFrame) !== null && _a !== void 0 ? _a : window.webkitRequestAnimationFrame;

var draw = function draw() {
  var canvas = document.getElementById('files-progress');
  var width = canvas.clientWidth;
  var height = canvas.clientHeight;
  canvas.width = width;
  canvas.height = height;
  var size = Math.min(width, height);

  if (imagesDone < imageCount) {
    var ctx = canvas.getContext('2d'); // Draw filled progress circle segment

    ctx.translate(width / 2, height / 2);
    ctx.fillStyle = '#0075fa';
    ctx.save();
    ctx.rotate(2 * Math.PI * (Date.now() - startTime) / 12000);
    ctx.beginPath();
    ctx.lineTo(0, 0);
    var angle = 2 * Math.PI * (imagesDone / imageCount);
    ctx.arc(0, 0, size / 2, 1.5 * Math.PI, 1.5 * Math.PI + angle);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  requestDraw(draw);
};

var workerCount;
var downScale;
var $files = document.getElementById('files-input');
var $images = document.getElementById('images');
var $workerCount = document.getElementById('worker-count');
var $workerCountLabel = $workerCount.previousElementSibling;
var $filesButton = document.getElementById('files');
var $downScale = document.getElementById('down-scale');
var $title = document.getElementById('title');
$title.innerHTML = document.title + " (v" + jp3g.version + ")";
var $messages = document.getElementById('messages');
var messageSeconds = 2;

var showMessage = function showMessage(message, seconds) {
  var $message = document.createElement('div');
  $message.innerHTML = message;
  var $previousMessage = $messages.lastChild;

  if (($previousMessage === null || $previousMessage === void 0 ? void 0 : $previousMessage.innerHTML) === message) {
    $messages.removeChild($previousMessage);
  }

  $messages.appendChild($message);

  var hideMessage = function hideMessage() {
    try {
      $messages.removeChild($message);
    } catch (_a) {}
  };

  $message.addEventListener('click', hideMessage);

  if (seconds != null) {
    setTimeout(hideMessage, seconds * 1000);
  }
};

var showWorkerLabel = function showWorkerLabel() {
  var count = +$workerCount.value;
  $workerCountLabel.innerHTML = count + " Background Thread" + (count === 1 ? '<span style="opacity:0;">s</span>' : 's');
};

var setWorkerCount = function setWorkerCount() {
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
  var downScaleHandler = function downScaleHandler() {
    downScale = $downScale.checked ? 8 : 1;
  };

  $downScale.addEventListener('change', downScaleHandler);
  downScaleHandler();
  $filesButton.addEventListener('click', function () {
    $files.click();
  });
}
var filesAddCounter = 0;
$files.addEventListener('change', function () {
  var _a;

  var id = ++filesAddCounter;
  var files = (_a = $files.files) !== null && _a !== void 0 ? _a : [];
  $images.innerHTML = '';
  $messages.innerHTML = '';
  imagesDone = 0;
  imageCount = files.length;
  startTime = Date.now();

  var isCurrent = function isCurrent() {
    return id === filesAddCounter;
  };

  var _loop_1 = function _loop_1(i) {
    var file = files[i];
    jp3g.waitIdle(function () {
      if (isCurrent()) {
        loadCanvas(file, downScale, function (error, canvas) {
          if (isCurrent()) {
            if (error) {
              showMessage("\u26A0\uFE0F " + error.message, 2);
            } else {
              $images.appendChild(canvas);
            }

            imagesDone += 1;

            if (imagesDone === imageCount) {
              var duration = Date.now() - startTime;
              var minutes = Math.floor(duration / 60000);
              var seconds = Math.floor(duration / 1000) % 60;
              var milliSeconds = duration % 1000;
              showMessage('Done in ' + (minutes > 0 ? minutes + " minute" + (minutes > 1 ? 's' : '') + " " : '') + (seconds > 0 ? seconds + " second" + (seconds > 1 ? 's' : '') + " " : '') + (milliSeconds + " millisecond" + (milliSeconds !== 1 ? 's' : '')));
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
requestDraw(draw);
},{}]},{},["ZCfc"], null)