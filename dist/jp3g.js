(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.jp3g = factory());
}(this, (function () { 'use strict';

  var version = "0.0.0";

  // Map zigzag ordered list index to original 8x8 matrix index
  // prettier-ignore
  var zigZag = new Uint8Array([
      0, 1, 8, 16, 9, 2, 3, 10,
      17, 24, 32, 25, 18, 11, 4, 5,
      12, 19, 26, 33, 40, 48, 41, 34,
      27, 20, 13, 6, 7, 14, 21, 28,
      35, 42, 49, 56, 57, 50, 43, 36,
      29, 22, 15, 23, 30, 37, 44, 51,
      58, 59, 52, 45, 38, 31, 39, 46,
      53, 60, 61, 54, 47, 55, 62, 63,
  ]);
  var SOI = 'SOI';
  var EOI = 'EOI';
  var COM = 'COM';
  var APP = 'APP';
  var JFIF = 'JFIF';
  var DHT = 'DHT';
  var DQT = 'DQT';
  var SOF = 'SOF';
  var SOS = 'SOS';

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */
  /* global Reflect, Promise */

  var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
          function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
      return extendStatics(d, b);
  };

  function __extends(d, b) {
      if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }

  /** @deprecated */
  function __spreadArrays() {
      for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
      for (var r = Array(s), k = 0, i = 0; i < il; i++)
          for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
              r[k] = a[j];
      return r;
  }

  /**
   * This constant is used to distinguish whether this script is being executed in
   * the browser main thread, worker thread or in node.js.
   */
  var environment = 
  // @ts-ignore
  typeof window !== 'undefined'
      ? 0 /* BrowserMain */
      : typeof self !== 'undefined'
          ? 1 /* BrowserWorker */
          : 2 /* NodeJs */;

  var slice = Array.prototype.slice;
  var isFunction = function (f) { return typeof f === 'function'; };
  var isBlob = function (b) {
      return environment !== 2 /* NodeJs */ && b instanceof Blob;
  };
  /**
   * Just the identity function.
   */
  var identity = function (a) { return a; };
  //TODO revert to simpler version
  /**
   * Compose two asynchronous functions.
   */
  var composeAsync = function (fn1, fn2) { return function () {
      var as = [];
      for (var _i = 0; _i < arguments.length; _i++) {
          as[_i] = arguments[_i];
      }
      var len = as.length - 1;
      var args = array(as, 0, len);
      var callback = as[len];
      fn1.apply(void 0, __spreadArrays(args, [(function (error, b) {
              if (error) {
                  callback(error);
              }
              else {
                  var args2 = void 0;
                  if (fn2.length === 1) {
                      args2 = [callback];
                  }
                  else {
                      args2 = [b, callback];
                  }
                  fn2.apply(void 0, args2);
              }
          })]));
  }; };
  /**
   * Lift synchronous function to asynchronous function.
   */
  var toAsync = function (fn) { return function () {
      var a = [];
      for (var _i = 0; _i < arguments.length; _i++) {
          a[_i] = arguments[_i];
      }
      var error;
      var b;
      var len = a.length - 1;
      try {
          b = fn.apply(void 0, array(a, 0, len));
      }
      catch (e) {
          error = e;
      }
      a[len](error, b);
  }; };
  /**
   * Convert an internal callback style function to an external function that can
   * work with callbacks and `Promise`s. If the last parameter is not a function,
   * a `Promise` is returned. That means, that also optional parameters work, but
   * the last parameter before the callback must not be a function.
   */
  var enablePromise = function (fn) { return function () {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
      }
      var result;
      if (!isFunction(args[args.length - 1])) {
          result = new Promise(function (resolve, reject) {
              args.push(function (error, result) {
                  if (error) {
                      reject(error);
                  }
                  else {
                      resolve(result);
                  }
              });
          });
      }
      fn.apply(void 0, args);
      return result;
  }; };
  /**
   * Use instead of `Array.from` to not annoy older browsers or use instead of
   * `Array#slice`.
   */
  var array = function (iterable, start, end) { return slice.call(iterable, start, end); };
  /**
   * Use instead of `Array.find` to prevent problems with old browsers.
   */
  var find = function (xs, predicate) {
      for (var _i = 0, xs_1 = xs; _i < xs_1.length; _i++) {
          var x = xs_1[_i];
          if (predicate(x)) {
              return x;
          }
      }
  };
  /**
   * Like `ImageData` constructor but also works in ancient browsers like IE11
   * with the following differences if used in this old environments:
   * - A new buffer is created for the data
   * - Throws if used in a worker
   */
  var createImageData = (function () {
      try {
          new ImageData(1, 1); // Throws in old browsers
          return function (data, width, height) { return new ImageData(data, width, height); };
      }
      catch (_a) {
          if (environment === 2 /* NodeJs */) {
              return function (data, width, height) { return ({ data: data, width: width, height: height }); };
          }
          return function (data, width, height) {
              var canvas = document.createElement('canvas');
              var ctx = canvas.getContext('2d');
              var imageData = ctx.createImageData(width, height);
              imageData.data.set(data);
              return imageData;
          };
      }
  })();
  /**
   * Read a `Blob` to memory and return an `ArrayBuffer`.
   */
  var readBlob = function (blob, callback) {
      var fileReader = new FileReader();
      fileReader.onload = function () {
          callback(undefined, fileReader.result);
      };
      fileReader.onerror = callback;
      fileReader.readAsArrayBuffer(blob);
  };
  /**
   * Converts a node.js Buffer which is a subclass of Uint8Array to a Uint8Array
   * sharing its memory. Returns a given direct Uint8Array.
   */
  var assureDirectUint8Array = function (buffer) {
      return environment === 2 /* NodeJs */ && Buffer.isBuffer(buffer)
          ? new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.length)
          : buffer;
  };
  var waitState = function (isState) {
      var callbacks = [];
      var state = isState();
      var maybeRunCallback = function () {
          while (callbacks.length > 0 && state) {
              var callback = callbacks.shift();
              callback();
          }
      };
      var check = function () {
          state = isState();
          maybeRunCallback();
      };
      return [
          check,
          function (callback) {
              callbacks.push(callback);
              maybeRunCallback();
          },
      ];
  };

  var _a;
  /**
   * Worker functions and its helper functions.
   */
  var workerFunctions = [];
  /**
   * Function call counter that is used to create an ID for each function call.
   */
  var callCounter = 0;
  /**
   * Maps call ID for all currently running calls to the termination callback
   * which is used to end the calls.
   */
  var activeCalls = new Map();
  /**
   * Calls are queued here for later processing.
   */
  var callQueue = [];
  /**
   * Creates a worker handler that runs a function in a worker.
   */
  var onMessageToWorker = function (postMessageFromWorker) { return function (_a) {
      var _b = _a.data, callId = _b[0], fnId = _b[1], args = _b[2];
      var _c = workerFunctions[fnId], fn = _c[1], outputTransfer = _c[2];
      var result;
      var transfer;
      var errorMessage;
      try {
          result = fn.apply(void 0, args);
          transfer = outputTransfer(result);
      }
      catch (error) {
          errorMessage = error.message;
      }
      var message = [callId, errorMessage, result];
      postMessageFromWorker(message, transfer);
  }; };
  /**
   * Initializes a new worker in the main thread: Sets a function to receive
   * messages from the worker and initializes the status of the worker as idle.
   */
  var initWorker = function (worker) {
      var workerWithState = [worker, true];
      worker.onmessage = function (_a) {
          var _b = _a.data, callId = _b[0], errorMessage = _b[1], result = _b[2];
          // Mark worker as idle
          workerWithState[1] = true;
          // Terminate function call
          var callback = activeCalls.get(callId);
          activeCalls.delete(callId);
          // TODO Preserve error type or remove special error types
          var error = errorMessage != null ? Error(errorMessage) : undefined;
          callback(error, result);
      };
      return workerWithState;
  };
  /**
   * Returns a fake worker that works in the same thread.
   */
  var fakeWorker = function () {
      var worker;
      var fakeWorkerOnMessage = onMessageToWorker(function (message) {
          var event = { data: message };
          worker.onmessage(event);
      });
      worker = {
          postMessage: function (message) {
              var event = { data: message };
              setTimeout(function () {
                  fakeWorkerOnMessage(event);
              });
          },
      };
      return worker;
  };
  var maxWorkerCount = 0;
  /**
   * In case no workers are set, this fake worker is used to process the functions
   * in the main thread.
   */
  var mainWorkerWithState = [initWorker(fakeWorker())];
  /**
   * The list of all available workers and the information whether they are
   * currently idle.
   */
  var workersWithState = mainWorkerWithState;
  /**
   * Notify an idle worker from the main thread to initiate a function call.
   */
  var notifyStartCall = function (worker, message, callback) {
      var callId = message[0], fnId = message[1], args = message[2];
      activeCalls.set(callId, callback);
      var inputTransfer = workerFunctions[fnId][0];
      var transfer = inputTransfer(args);
      worker.postMessage([callId, fnId, args], transfer);
  };
  var scriptSrc;
  /**
   * Waiting calls are passed on to idle workers for processing.
   * This function is called on the main thread on every worker function call,
   * every time a worker has finished processing a function and when the max
   * worker count is changed.
   */
  var tryDistributeCalls = function () {
      if (workersWithState === mainWorkerWithState) {
          workersWithState = [];
      }
      var workerDiff = maxWorkerCount - workersWithState.length;
      // If too much workers => Terminate idle workers
      for (var i = 0; workerDiff < 0 && i < workersWithState.length; i += 1) {
          var _a = workersWithState[i], worker = _a[0], idle = _a[1];
          if (idle) {
              worker.terminate();
              workersWithState.splice(i, 1);
              workerDiff += 1;
              i -= 1;
          }
      }
      // Create new workers if needed
      var idleCount = workersWithState.reduce(function (count, _a) {
          var idle = _a[1];
          return count + +idle;
      }, 0);
      var newWorkerCount = Math.min(workerDiff - idleCount, callQueue.length);
      for (var i = 0; i < newWorkerCount; i += 1) {
          var workerWithState = initWorker(new Worker(scriptSrc));
          workersWithState.push(workerWithState);
      }
      // Delegate waiting calls to idle workers
      if (workersWithState.length === 0) {
          workersWithState = mainWorkerWithState;
      }
      for (var _i = 0, workersWithState_1 = workersWithState; _i < workersWithState_1.length; _i++) {
          var workerWithState = workersWithState_1[_i];
          var worker = workerWithState[0], idle = workerWithState[1];
          if (idle) {
              var nextCall = callQueue.shift();
              if (nextCall) {
                  workerWithState[1] = false;
                  notifyStartCall.apply(void 0, __spreadArrays([worker], nextCall));
              }
          }
      }
      checkIdle();
  };
  var _b = waitState(function () {
      return workersWithState.some(function (_a) {
          var idle = _a[1];
          return idle;
      });
  }), checkIdle = _b[0];
  /**
   * Returns an asynchronous function that runs a synchronous function in a worker
   * pool.
   * The transfer functions are used to extract `Transferable`s so that they can
   * be passed to the worker and back by reference.
   */
  var workerFunction = function (inputTransfer, fn, outputTransfer) {
      var fnId = workerFunctions.length;
      workerFunctions.push([inputTransfer, fn, outputTransfer]);
      return (function () {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
          }
          var callbackIdx = args.length - 1;
          var callback = args[callbackIdx];
          args = array(args, 0, callbackIdx);
          var message = [callCounter++, fnId, args];
          callQueue.push([
              message,
              function (error, result) {
                  callback(error, result);
                  tryDistributeCalls();
              },
          ]);
          tryDistributeCalls();
      });
  };
  var setWorkerCount;
  if (environment === 0 /* BrowserMain */) {
      /**
       * The URL of this script. It gets a little hacky for browsers not supporting
       * `document.currentScript`.
       */
      scriptSrc = ((_a = document.currentScript) !== null && _a !== void 0 ? _a : (function () {
          var scripts = document.getElementsByTagName('script');
          return scripts[scripts.length - 1];
      })()).src;
      /**
       * Set zero to any number of workers which should be used to process
       * functions.
       */
      setWorkerCount = function (workerCount) {
          if (window.Worker && maxWorkerCount !== workerCount) {
              maxWorkerCount = workerCount;
              tryDistributeCalls();
          }
      };
  }
  else if (environment === 1 /* BrowserWorker */) {
      // Register function call handler in the worker.
      onmessage = onMessageToWorker(postMessage);
  }

  /**
   * Indicates invalid format when parsing JPEG
   */
  var InvalidJpegError = /** @class */ (function (_super) {
      __extends(InvalidJpegError, _super);
      function InvalidJpegError(message) {
          var _this = _super.call(this, message) || this;
          Object.setPrototypeOf(_this, InvalidJpegError.prototype);
          return _this;
      }
      return InvalidJpegError;
  }(Error));

  var getUint16 = function (data, offset) {
      return (data[offset] << 8) | data[offset + 1];
  };
  /**
   * Split a byte in high and low part (integers from 0 to 15)
   */
  var getHiLow = function (byte) { return [byte >> 4, byte & 0xf]; };

  /**
   * Build a huffman tree from The counts of huffman codes starting with length
   * 1 and the 1-byte symbols sorted by huffman code.
   */
  var getHuffmanTree = function (_a) {
      var counts = _a.counts, symbols = _a.symbols;
      var transferNodes = [];
      var symbolsEnd = symbols.length;
      if (counts.reduce(function (a, b) { return a + b; }, 0) !== symbolsEnd) {
          throw new InvalidJpegError('Invalid huffman table');
      }
      for (var i = counts.length - 1; i >= 0; i -= 1) {
          var count = counts[i];
          var nodes = (array(symbols, symbolsEnd - count, symbolsEnd)).concat(transferNodes);
          transferNodes = [];
          for (var j = 0; j < nodes.length; j += 2) {
              transferNodes.push(array(nodes, j, j + 2));
          }
          symbolsEnd -= count;
      }
      if (transferNodes.length > 1) {
          throw new InvalidJpegError('Invalid huffman table');
      }
      return transferNodes[0] || [];
  };
  /**
   * Decode DHT segment
   */
  var decodeDHT = function (data) {
      var length = data.length;
      var offset = 0;
      var tables = [];
      do {
          if (length - offset < 17) {
              throw new InvalidJpegError('Invalid segment length');
          }
          var _a = getHiLow(data[offset++]), cls = _a[0], id = _a[1];
          // Get count of Huffman codes of length 1 to 16
          var counts = array(data.subarray(offset, offset + 16));
          offset += 16;
          // Get the symbols sorted by Huffman code
          var symbolCount = counts.reduce(function (sum, count) { return sum + count; }, 0);
          if (symbolCount > length - offset) {
              throw new InvalidJpegError('Invalid segment length');
          }
          var symbols = array(data.subarray(offset, offset + symbolCount));
          offset += symbolCount;
          var tree = getHuffmanTree({ counts: counts, symbols: symbols });
          tables.push({
              cls: cls,
              id: id,
              tree: tree,
          });
      } while (offset !== length);
      return {
          type: DHT,
          tables: tables,
      };
  };

  var getUint8or16 = function (size) {
      return size ? getUint16 : function (data, offset) { return data[offset]; };
  };
  var decodeDQT = function (data) {
      var tables = [];
      var offset = 0;
      var length = data.length;
      do {
          if (length - offset < 1) {
              throw new InvalidJpegError('invalid segment length');
          }
          // The 4 low-order bits are the table identifier (0, 1, 2, or 3).
          // The 4 high-order bits specify the quanization value size
          // (0 = 1 byte, 1 = 2 bytes).
          var _a = getHiLow(data[offset++]), size = _a[0], id = _a[1];
          if (id < 0 || id > 3) {
              throw new InvalidJpegError('invalid quantization table identifier');
          }
          if (size < 0 || size > 1) {
              throw new InvalidJpegError('invalid quantization value size');
          }
          var bytes = (size + 1);
          if (bytes * 64 > length - offset) {
              throw new InvalidJpegError('invalid segment length');
          }
          var values = new (size ? Uint16Array : Uint8Array)(64);
          var getUint = getUint8or16(size);
          for (var i = 0; i < 64; i += 1) {
              values[zigZag[i]] = getUint(data, i * bytes + offset);
          }
          tables.push({ id: id, values: values });
          offset += bytes * 64;
      } while (offset !== length);
      return {
          type: DQT,
          tables: tables,
      };
  };

  var dataToString = function (data) {
      return String.fromCharCode.apply(null, data);
  };
  /**
   * Returns true if marker is APP0-APP15 (application-specific data)
   */
  var isAppMarker = function (marker) { return 0xe0 <= marker && marker <= 0xef; };
  /**
   * Returns true if the APP segment is of type APP0 and starts with the given
   * identifier terminated by zero.
   */
  var isCustomApp0 = function (identifier) {
      var length = identifier.length;
      return function (_a) {
          var appType = _a.appType, data = _a.data;
          return appType === 0 &&
              data[length] === 0 &&
              dataToString(data.subarray(0, length)) === identifier;
      };
  };
  /**
   * Returns true if the given APP segment is a JFIF segment.
   */
  var isJFIF = isCustomApp0(JFIF);
  /**
   * Decode a comment segment.
   */
  var decodeCOM = function (data) { return ({
      type: COM,
      text: dataToString(data),
  }); };
  /**
   * Decode an APP segment.
   */
  var decodeAPP = function (appType, data) {
      var app = {
          type: APP,
          appType: appType,
          data: data,
      };
      return isJFIF(app) ? decodeJFIF(data) : app;
  };
  /**
   * Decode a JFIF segment.
   */
  var decodeJFIF = function (data) {
      var jfif = {
          type: JFIF,
          version: [data[5], data[6]],
          units: data[7],
          density: { x: getUint16(data, 8), y: getUint16(data, 10) },
      };
      var thumbnailX = data[12];
      var thumbnailY = data[13];
      if (thumbnailX > 0 && thumbnailY > 0) {
          jfif.thumbnail = {
              x: thumbnailX,
              y: thumbnailY,
              data: data.subarray(14),
          };
      }
      return jfif;
  };

  var isRestartMarker = function (marker) { return 0xd0 <= marker && marker <= 0xd7; };
  var isMarkerSOF = function (marker) {
      return 192 /* SOF0 */ <= marker &&
          marker <= 0xcf &&
          marker !== 196 /* DHT */ &&
          marker !== 0xc8 /* Reserved */ &&
          marker !== 0xcc;
  }; /* DAC (Define arithmetic coding conditions) */
  /**
   * Decode SOF (Start of frame) segment
   */
  var decodeSOF = function (frameType, data) {
      var precision = data[0]; // Sample precision in bits (can be 8 or 12)
      var height = getUint16(data, 1); // Image height in pixels
      var width = getUint16(data, 3); // Image width in pixels
      var compCount = data[5]; // Number of components in the image
      if (data.length !== compCount * 3 + 6) {
          throw new InvalidJpegError('Invalid segment length');
      }
      var offset = 6;
      var components = [];
      for (var i = 0; i < compCount; i += 1) {
          // Component identifier
          // JPEG allows this to be 0 to 255. JFIF restricts it to 1 (Y), 2 (Cb), or 3 (Cr)
          var id = data[offset++];
          // The 4 high-order bits specify the horizontal sampling for the component
          // The 4 low-order bits specify the vertical sampling
          // Either value can be 1-4 according to the standard
          var _a = getHiLow(data[offset++]), h = _a[0], v = _a[1];
          // The quantization table identifier for the component. Corresponds to the identifier in a DQT marker. Can be 0, 1, 2, or 3
          var qId = data[offset++];
          components.push({ id: id, h: h, v: v, qId: qId });
      }
      return {
          type: SOF,
          frameType: frameType,
          precision: precision,
          width: width,
          height: height,
          components: components,
      };
  };
  /**
   *
   * @param jpeg
   */
  var decodeJpeg = function (jpeg) {
      jpeg = assureDirectUint8Array(jpeg);
      // JPEG must start with a SOI marker
      if (jpeg[0] !== 0xff || jpeg[1] !== 216 /* SOI */) {
          throw new InvalidJpegError('Missing SOI marker');
      }
      // The last marker in the file must be an EOI, and it must immediately follow
      // the compressed data of the last scan in the image.
      var result = [{ type: SOI }];
      var segEnd = 2; // End of the current segment
      var length = jpeg.length;
      outer: for (var offset = segEnd; offset < length; offset += 1) {
          var byte = jpeg[offset];
          if (byte !== 0xff) {
              if (offset === segEnd) {
                  // First byte of marker must be ff
                  throw new InvalidJpegError('Invalid marker');
              }
              // Set segment start after marker so segStart + segLength === segEnd
              var segStart = ++offset;
              if (byte === 218 /* SOS */) {
                  var headerLength = getUint16(jpeg, offset);
                  offset += 2;
                  var componentCount = jpeg[offset++];
                  var components = [];
                  for (var i = 0; i < componentCount; i += 1) {
                      var id = jpeg[offset++];
                      var _a = getHiLow(jpeg[offset++]), dcId = _a[0], acId = _a[1];
                      components.push({ id: id, dcId: dcId, acId: acId });
                  }
                  // Next 3 bytes are only used in progressive mode
                  var specStart = jpeg[offset++]; // Spectral selection start (0-63)
                  var specEnd = jpeg[offset++]; // Spectral selection end (0-63)
                  // Successive approximation (two 4-bit fields, each with a value in the range 0-13)
                  var _b = getHiLow(jpeg[offset++]), ah = _b[0], al = _b[1];
                  // offset === segStart + headerLength
                  for (; offset < length; offset += 1) {
                      byte = jpeg[offset];
                      if (byte === 0xff) {
                          byte = jpeg[offset + 1];
                          if (byte === 0 || isRestartMarker(byte)) {
                              // ff00 is used to represent the value ff in the output stream => no marker
                              continue;
                          }
                          segEnd = offset;
                          result.push({
                              type: SOS,
                              components: components,
                              specStart: specStart,
                              specEnd: specEnd,
                              ah: ah,
                              al: al,
                              data: jpeg.subarray(segStart + headerLength, segEnd),
                          });
                          continue outer;
                      }
                  }
                  break;
              }
              else if (byte === 217 /* EOI */) {
                  result.push({ type: EOI });
                  // TODO Add segment if data after EOI
                  return result;
              }
              else {
                  var segLength = getUint16(jpeg, offset);
                  if (segLength < 2) {
                      throw new InvalidJpegError('Invalid segment length');
                  }
                  offset = segEnd = segStart + segLength;
                  var d = jpeg.subarray(segStart + 2, segEnd);
                  if (byte === 219 /* DQT */) {
                      result.push(decodeDQT(d));
                  }
                  else if (byte === 196 /* DHT */) {
                      result.push(decodeDHT(d));
                  }
                  else if (byte === 254 /* COM */) {
                      result.push(decodeCOM(d));
                  }
                  else if (isAppMarker(byte)) {
                      result.push(decodeAPP(byte & 0xf, d));
                  }
                  else if (isMarkerSOF(byte)) {
                      result.push(decodeSOF(byte & 0xf, d));
                  }
                  else {
                      throw new InvalidJpegError('Unknown marker');
                  }
              }
          }
      }
      throw new InvalidJpegError('Unexpected end of buffer');
  };
  // Sources:
  // [1] https://www.w3.org/Graphics/JPEG/itu-t81.pdf

  // mx := sqrt(2) * cos((x / 16) * PI)
  var m1 = 1.3870398453221475;
  var m2 = 1.3065629648763766;
  var m3 = 1.1758756024193588;
  var m5 = 0.7856949583871022;
  var m6 = 0.541196100146197;
  var m7 = 0.275899379282943;

  var SQRT2 = Math.SQRT2;
  /**
   * Calculate B := (A * M/sqrt(8))^t
   */
  var multM = function (A, B) {
      // TODO Use scaled integers to speed up decoding?
      for (var i = 0, j = 0; i < 8; i += 1) {
          var a0 = A[j++];
          var a4 = A[j++];
          var a2 = A[j++];
          var a6 = A[j++];
          var a1 = A[j++];
          var a5 = A[j++];
          var a3 = A[j++];
          var a7 = A[j++];
          var b0 = a0 + a1;
          var b1 = a0 - a1;
          /* TODO Faster to reduce one multiplication for three additions like this?:
          const r0 = m6 * (a2 + a3)
          const b2 = r0 - (m6 + m2) * a3
          const b3 = r0 - (m6 - m2) * a2 */
          var b2 = m6 * a2 - m2 * a3;
          var b3 = m2 * a2 + m6 * a3;
          var b4 = m7 * a4 - m1 * a7;
          var b5 = m3 * a5 - m5 * a6;
          var b6 = m5 * a5 + m3 * a6;
          var b7 = m1 * a4 + m7 * a7;
          var c4 = b4 + b5;
          var c5 = b5 - b4;
          var c6 = b7 - b6;
          var c7 = b6 + b7;
          var e5 = (c5 + c6) / SQRT2;
          var e6 = (c6 - c5) / SQRT2;
          var f0 = b0 + b3;
          var f1 = b1 + b2;
          var f2 = b1 - b2;
          var f3 = b0 - b3;
          B[i] = f0 + c7;
          B[i + 8] = f1 + e6;
          B[i + 16] = f2 + e5;
          B[i + 24] = f3 + c4;
          B[i + 32] = f3 - c4;
          B[i + 40] = f2 - e5;
          B[i + 48] = f1 - e6;
          B[i + 56] = f0 - c7;
      }
  };
  var coeffs = new Int16Array(64);
  var a = new Float64Array(64);
  var b = new Float64Array(64);
  /**
   * - Dequantize coefficients
   * - Floating point optimized IDCT.
   * - Decenter by adding 128
   */
  var invDctQuantized = function (qTable, qCoeffs, outSamples, outOffset) {
      for (var i = 0; i < 64; i += 1) {
          coeffs[i] = qCoeffs[i] * qTable[i];
      }
      multM(coeffs, a);
      multM(a, b);
      for (var i = 0; i < 64; i += 1) {
          outSamples[outOffset++] = b[i] / 8 + 128;
      }
  };

  var invDctQuantizedDownScale8 = function (qTable, qCoeffs, outSamples, outOffset) {
      outSamples[outOffset] = (qCoeffs[0] * qTable[0]) / 8 + 128;
  };
  /**
   * - Dequantize coefficients
   * - Floating point optimized IDCT.
   * - Decenter by adding 128
   */
  var invDctQuantizedScaled = function (downScale) {
      return downScale === 8 ? invDctQuantizedDownScale8 : invDctQuantized;
  };

  var max = Math.max, ceil = Math.ceil, round = Math.round;
  var createImageData$1 = function (width, height) { return [
      new Uint8ClampedArray(width * height * 4),
      width,
      height,
  ]; };
  var decodeFrame = function (jpeg, _a) {
      var _b = _a === void 0 ? {} : _a, _c = _b.downScale, downScale = _c === void 0 ? 1 : _c;
      var huffmanTables = [[], []];
      var qTables = [];
      var frame;
      var _loop_1 = function (segment) {
          switch (segment.type) {
              case DHT:
                  for (var _i = 0, _a = segment.tables; _i < _a.length; _i++) {
                      var table = _a[_i];
                      huffmanTables[table.cls][table.id] = table.tree;
                  }
                  break;
              case DQT:
                  for (var _b = 0, _c = segment.tables; _b < _c.length; _b++) {
                      var table = _c[_b];
                      qTables[table.id] = table;
                  }
                  break;
              case SOF: {
                  if (segment.frameType < 0 ||
                      segment.frameType > 1 ||
                      segment.precision !== 8) {
                      // Only sequential DCT frames with 8-bit samples are supported
                      throw Error('Not 8-bit sequential');
                  }
                  var frameComponents = [];
                  for (var _d = 0, _e = segment.components; _d < _e.length; _d++) {
                      var component = _e[_d];
                      frameComponents[component.id] = component;
                  }
                  frame = {
                      components: frameComponents,
                      width: segment.width,
                      height: segment.height,
                      imageData: createImageData$1(round(segment.width / downScale), round(segment.height / downScale)),
                  };
                  break;
              }
              case SOS: {
                  if (!frame) {
                      throw Error('Missing frame');
                  }
                  var frameComponents_1 = frame.components, width = frame.width, height = frame.height, _f = frame.imageData, data = _f[0], targetWidth = _f[1];
                  var components = segment.components;
                  var interleaved = components.length > 1;
                  if (!interleaved) {
                      // Support only interleaved scans at the moment
                      throw Error('Not interleaved');
                  }
                  var maxH = 0;
                  var maxV = 0;
                  var mcuDataUnitCount = 0;
                  for (var _g = 0, components_1 = components; _g < components_1.length; _g++) {
                      var component = components_1[_g];
                      var _h = frameComponents_1[component.id], h = _h.h, v = _h.v;
                      if (h < 1 || h > 4 || v < 1 || v > 4) {
                          throw Error('Invalid sampling factor');
                      }
                      maxH = max(maxH, h);
                      maxV = max(maxV, v);
                      mcuDataUnitCount += h * v;
                  }
                  // Size of the MCU in pixels
                  var mcuWidth = 8 * maxH;
                  var mcuHeight = 8 * maxV;
                  // Number of MCU columns/rows
                  var mcuColumns = ceil(width / mcuWidth);
                  var mcuRows = ceil(height / mcuHeight);
                  //
                  var huffmanTablesDC = huffmanTables[0], huffmanTablesAC = huffmanTables[1];
                  var qCoeffs = new Int16Array(64);
                  var decodeQCoeffs = createDecodeQCoeffs(segment.data, qCoeffs);
                  var componentCount = components.length;
                  var lastDcs = new Int16Array(componentCount);
                  /*
                   * TODO: When more scalings are implemented, different sizes should be
                   * possible per component to get better resolution when subsampled.
                   */
                  var decDataUnitSize = Math.pow((8 / downScale), 2);
                  // Create buffer to hold the data units for each MCU row
                  var yCbCr = new Uint8ClampedArray(mcuColumns * mcuDataUnitCount * decDataUnitSize);
                  var invDctQuantized = invDctQuantizedScaled(downScale);
                  var yCbCr2Rgb = nextYCbCr2Rgb(yCbCr, createMapIndices(targetWidth, downScale, mcuColumns, mcuHeight, components.map(function (_a) {
                      var id = _a.id;
                      return frameComponents_1[id];
                  }), maxH, maxV), data);
                  for (var mcuRow = 0; mcuRow < mcuRows; mcuRow += 1) {
                      var yCbCrOffset = 0;
                      for (var mcuColumn = 0; mcuColumn < mcuColumns; mcuColumn += 1) {
                          for (var k = 0; k < componentCount; k += 1) {
                              var component = components[k];
                              var _j = frameComponents_1[component.id], h = _j.h, v = _j.v, qId = _j.qId;
                              var qTable = qTables[qId].values;
                              for (var i = 0; i < v; i += 1) {
                                  for (var j = 0; j < h; j += 1) {
                                      // Decode data unit
                                      decodeQCoeffs(lastDcs[k], huffmanTablesDC[component.dcId], huffmanTablesAC[component.acId]);
                                      lastDcs[k] = qCoeffs[0];
                                      //
                                      invDctQuantized(qTable, qCoeffs, yCbCr, yCbCrOffset);
                                      //
                                      yCbCrOffset += decDataUnitSize;
                                  }
                              }
                          }
                      }
                      yCbCr2Rgb();
                  }
                  break;
              }
              case EOI: return "break-segmentLoop"; // TODO remove label?
          }
      };
      segmentLoop: for (var _i = 0, jpeg_1 = jpeg; _i < jpeg_1.length; _i++) {
          var segment = jpeg_1[_i];
          var state_1 = _loop_1(segment);
          switch (state_1) {
              case "break-segmentLoop": break segmentLoop;
          }
      }
      if (!frame) {
          throw Error('Missing frame');
      }
      return frame.imageData;
  };
  var createMapIndices = function (targetWidth, downScale, mcuColumns, mcuHeight, componentInfo, maxH, maxV) {
      var mapIndices = new Uint32Array(3 * targetWidth * (mcuHeight / downScale));
      var n = 0; // Index in the source array holding data units of one MCU row
      var componentCount = componentInfo.length;
      var dataUnitSize = 8 / downScale; // Width and height of each data unit
      // Iterate MCU columns
      for (var mcuColumn = 0; mcuColumn < mcuColumns; mcuColumn += 1) {
          // Iterate components in MCU
          for (var k = 0; k < componentCount; k += 1) {
              var _a = componentInfo[k], h = _a.h, v = _a.v;
              var hh = maxH / h;
              var vv = maxV / v;
              // Iterate component data unit rows in MCU
              for (var i = 0; i < v; i += 1) {
                  // Iterate component data unit columns in MCU
                  for (var j = 0; j < h; j += 1) {
                      // Iterate rows in data unit
                      for (var zy = 0; zy < dataUnitSize; zy += 1) {
                          // iterate columns in data unit
                          for (var zx = 0; zx < dataUnitSize; zx += 1) {
                              // Vertical duplication
                              for (var g = 0; g < vv; g += 1) {
                                  // Horizontal duplication
                                  for (var f = 0; f < hh; f += 1) {
                                      // x, y: Target image pixel position
                                      var x = ((mcuColumn * h + j) * dataUnitSize + zx) * hh + f;
                                      var y = (i * dataUnitSize + zy) * vv + g;
                                      if (x < targetWidth) {
                                          mapIndices[(x + y * targetWidth) * componentCount + k] = n;
                                      }
                                  }
                              }
                              n += 1;
                          }
                      }
                  }
              }
          }
      }
      return mapIndices;
  };
  // TODO: Extract to module
  var nextYCbCr2Rgb = function (source, mapIndices, target) {
      var length = mapIndices.length; // width * mcuHeight * 3
      var offset = 0;
      var Y;
      var Cb;
      var Cr;
      return function () {
          // Note: In the last MCU row we might write outside array range
          for (var i = 0; i < length;) {
              Y = source[mapIndices[i++]];
              Cb = source[mapIndices[i++]];
              Cr = source[mapIndices[i++]];
              target[offset++] = Y + 1.402 * Cr - 179.456;
              target[offset++] = Y - 0.34414 * Cb - 0.71414 * Cr + 135.45984;
              target[offset++] = Y + 1.772 * Cb - 226.816;
              target[offset++] = 255;
          }
      };
  };
  // [Bitmap] <-> Sampling <-> DCT <-> Quantization <-> Huffman Coding <-> [JPEG]
  // 4:4:4 (1x1,1x1,1x1) => Data unit 8x8 pixels
  // 4:2:2 (2x1,1x1,1x1) => Data unit 8x16 (Y), 16x16 (Cb, Cr) pixels
  // 4:2:0 (2x2,1x1,1x1) => Data unit 8x8 (Y), 16x16 (Cb, Cr) pixels
  var createNextBit = function (data) {
      // The Position of the next byte in the data
      var offset = 0;
      // The current data byte
      var currentByte;
      // Position of the next bit in the current byte
      var byteOffset = -1;
      return function () {
          // If current byte is read => get next byte
          if (byteOffset < 0) {
              currentByte = data[offset++];
              byteOffset = 7;
              // The value ff (rarely occurs) is coded as ff00 to make searching for
              // markers easy. So the next 0-byte is ignored in this case.
              if (currentByte === 0xff && data[offset++] !== 0) {
                  throw Error('Unexpected marker in compressed data');
              }
          }
          // Return current bit
          return (currentByte >> byteOffset--) & 1;
      };
  };
  var createDecodeQCoeffs = function (data, outQCoeffs) {
      var nextBit = createNextBit(data);
      /**
       * Receive function from JPEG spec.
       */
      var nextBits = function (length) {
          var v = 0;
          for (var i = 0; i < length; i += 1) {
              v = (v << 1) + nextBit();
          }
          return v;
      };
      var nextHuffmanByte = function (tree) {
          var node;
          while (true) {
              node = tree[nextBit()];
              if (typeof node === 'number') {
                  return node;
              }
              if (node == null) {
                  throw Error('Unexpected huffman code');
              }
              tree = node;
          }
      };
      var nextDcDiff = function (huffmanTreeDC) {
          var magnitude = nextHuffmanByte(huffmanTreeDC);
          var additionalBits = nextBits(magnitude);
          return extend(additionalBits, magnitude);
      };
      return function (lastDc, huffmanTreeDC, huffmanTreeAC) {
          outQCoeffs[0] = lastDc + nextDcDiff(huffmanTreeDC);
          // Int16Array#fill is ES6 => use loop
          for (var i = 1; i < 64; i += 1) {
              outQCoeffs[i] = 0;
          }
          for (var i = 1; i < 64;) {
              var value = nextHuffmanByte(huffmanTreeAC);
              // The low nibble contains the number of bits to be read, which determines
              // the magnitude of the coefficient.
              var loBits = value & 0xf;
              // The high nibble contains the number of zero coefficients before this
              // coefficients.
              var hiBits = (value & 0xf0) >> 4; // ? value >> 4
              if (loBits !== 0) {
                  var extraBits = nextBits(loBits);
                  i += hiBits;
                  outQCoeffs[zigZag[i]] = extend(extraBits, loBits);
                  i += 1;
              }
              else {
                  if (hiBits === 0xf) {
                      i += 16; // Run of 16 Zeros
                  }
                  else if (hiBits === 0) {
                      i = 64; // All Done
                  }
              }
          }
      };
  };
  /**
   * This function is taken from the JPEG specification. It is used to decode DC
   * coefficients. DC coefficients are coded as differences to the previous DC
   * value (as these are usually smaller). This difference is then coded in two
   * parts: First a huffman-coded byte that defines the magnitude of the DC
   * difference by number of following bits. This function calculates the DC
   * coefficient difference from these two values.
   *
   * E.g. coded: 1100 1101 1011 ...
   * First three bits 110 are e.g. huffman encoded magnitude t=7. Next 7 bits are
   * v=0110110=52. Encoded DC coefficient difference = extend(52, 7) = -73
   *
   * @param v Bits encoded after huffman encoded magnitude.
   * @param t Magnitude of the DC coefficient and also the number of encoded bits
   * in the previous parameter.
   */
  var extend = function (v, t) {
      var v_t = 1 << (t - 1); // 2^(t-1)
      if (v < v_t) {
          return v + (-1 << t) + 1;
      }
      else {
          return v;
      }
  };

  var isArray = Array.isArray;
  var max$1 = Math.max;
  // Create variable for correct type in d.ts file (will be removed my minifier)
  var version$1 = version;
  var getBuffer = function (dataContainer) {
      return dataContainer.data.buffer;
  };
  var getJpegBuffer = function (jpeg) {
      // Find the first SOS segment and return the referenced JPEG input buffer.
      // This is sufficient because all data segment (APP, SOS) views reference
      // the same buffer. There is always a SOS segment.
      return getBuffer(find(jpeg, function (segment) { return segment.type === APP || segment.type === SOS; }));
  };
  var toArrayBuffer = function (data, callback) {
      if (isBlob(data)) {
          readBlob(data, callback);
      }
      else {
          callback(null, data);
      }
  };
  var decode = workerFunction(identity, function (jpegData) { return decodeJpeg(new Uint8Array(jpegData)); }, function (jpeg) { return [getJpegBuffer(jpeg)]; });
  var decodeImage = workerFunction(function (_a) {
      var jpeg = _a[0];
      return [getJpegBuffer(jpeg)];
  }, decodeFrame, function (_a) {
      var data = _a[0];
      return [data.buffer];
  });
  var decodeImage2 = function (decodeOptions) { return function (jpeg, callback) {
      decodeImage(jpeg, decodeOptions, callback);
  }; };
  var fnCounter = 0;
  var _a$1 = waitState(function () { return fnCounter < max$1(maxWorkerCount, 1) + 1; }), checkFnSlotAvailable = _a$1[0], waitFnSlotAvailable = _a$1[1];
  var trackAsync = function (fn) { return function () {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
      }
      fnCounter += 1;
      checkFnSlotAvailable();
      var lastIndex = args.length - 1;
      var callback = args[lastIndex];
      args[lastIndex] = (function (error, result) {
          fnCounter -= 1;
          checkFnSlotAvailable();
          callback(error, result);
      });
      fn.apply(void 0, args);
  }; };
  var create = function (jpegData, _factor) {
      var toJPEG = function (callback) {
          if (!isArray(jpegData)) {
              composeAsync(toArrayBuffer, decode)(jpegData, callback);
          }
          else {
              callback(null, jpegData);
          }
      };
      return {
          scale: function (factor) { return create(jpegData, _factor * factor); },
          toJPEG: enablePromise(trackAsync(toJPEG)),
          toImageData: enablePromise(trackAsync(composeAsync(toJPEG, composeAsync(decodeImage2({ downScale: 1 / _factor }), toAsync(function (args) { return createImageData.apply(void 0, args); }))))),
      };
  };
  var _jp3g = function (jpegData) { return create(jpegData, 1); };
  _jp3g.setWorkerCount = setWorkerCount;
  _jp3g.waitIdle = waitFnSlotAvailable;
  _jp3g.version = version$1;

  return _jp3g;

})));
