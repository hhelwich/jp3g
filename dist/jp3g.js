(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.jp3g = {}));
}(this, (function (exports) { 'use strict';

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
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }

    var version = "0.0.0";

    /**
     * Is used to distinguish whether this script is being executed in the browser
     * main thread, worker thread or in node.js.
     */
    var environment = 
    // @ts-ignore
    typeof window !== 'undefined'
        ? 0 /* BrowserMain */
        : typeof self !== 'undefined'
            ? 1 /* BrowserWorker */
            : 2 /* NodeJs */;

    /**
     * All available functions that can be called both directly and in a worker.
     * In case a function is called in a worker, there are functions that extract
     * the transferables used in the inputs and outputs. This is required so that
     * the buffers can be transferred between a worker and the main thread by
     * reference instead by value.
     */
    var workerFunctions = [];
    /**
     * Function call counter that is used to create an ID for each function call.
     */
    var callCounter = 0;
    /**
     * For all currently running calls, it maps the call ID to the termination
     * callbacks which are used to end the calls.
     */
    var activeCalls = new Map();
    /**
     * Calls are queued here for later processing.
     */
    var callQueue = [];
    /**
     * Creates a worker handler that applies a function call on receiving a message.
     */
    var onMessageToWorker = function (postMessageFromWorker) { return function (_a) {
        var _b = _a.data, callId = _b[0], fnId = _b[1], args = _b[2];
        return __awaiter(void 0, void 0, void 0, function () {
            var _c, fn, outputTransfer, result, message, transfer, e_1, message;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        _c = workerFunctions[fnId], fn = _c[0], outputTransfer = _c[2];
                        return [4 /*yield*/, fn.apply(void 0, args)];
                    case 1:
                        result = _d.sent();
                        message = [callId, result];
                        transfer = outputTransfer(result);
                        postMessageFromWorker(message, transfer);
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _d.sent();
                        message = [callId, , e_1.message];
                        postMessageFromWorker(message);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }; };
    /**
     * Initializes a new worker in the main thread: Sets a function to receive
     * messages from the worker and initializes the status of the worker as idle.
     */
    var initWorker = function (worker) {
        var workerWithState = [worker, false];
        worker.onmessage = function (_a) {
            var _b = _a.data, callId = _b[0], result = _b[1], errorMessage = _b[2];
            // Mark worker as idle
            workerWithState[1] = false;
            // Terminate function call
            var _c = activeCalls.get(callId), resolve = _c[0], reject = _c[1];
            activeCalls.delete(callId);
            if (errorMessage) {
                // TODO Preserve error type or remove special error types
                reject(Error(errorMessage));
            }
            else {
                resolve(result);
            }
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
                fakeWorkerOnMessage(event);
            },
        };
        return worker;
    };
    /**
     * In case no workers are set, this fake worker is used to process the functions
     * in the main thread.
     */
    var mainWorkerWithState = [initWorker(fakeWorker())];
    /**
     * The list of all available workers and the information whether they are
     * currently busy.
     */
    var workersWithState = mainWorkerWithState;
    /**
     * Notify an idle worker from the main thread to initiate a function call.
     */
    var notifyStartCall = function (worker, message, callTermination) {
        var callId = message[0], fnId = message[1], args = message[2];
        activeCalls.set(callId, callTermination);
        var _a = workerFunctions[fnId], inputTransfer = _a[1];
        var transfer = inputTransfer(args);
        worker.postMessage(message, transfer);
    };
    /**
     * Waiting calls are passed on to idle workers for processing.
     * This function is called on the main thread on every worker function call,
     * every time a worker has finished processing a function and when the workers
     * are changed.
     */
    var tryDistributeCalls = function () {
        for (var _i = 0, workersWithState_1 = workersWithState; _i < workersWithState_1.length; _i++) {
            var workerWithState = workersWithState_1[_i];
            var busy = workerWithState[1];
            if (!busy) {
                var nextCall = callQueue.shift();
                if (!nextCall) {
                    return;
                }
                workerWithState[1] = true;
                notifyStartCall.apply(void 0, __spreadArrays([workerWithState[0]], nextCall));
            }
        }
    };
    /**
     * Set zero to any number of workers which should be used to process functions.
     */
    var setWorker = function () {
        var workers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            workers[_i] = arguments[_i];
        }
        if (workers.length > 0) {
            workersWithState = workers.map(initWorker);
        }
        else {
            workersWithState = mainWorkerWithState;
        }
        tryDistributeCalls();
    };
    /**
     * Proxy a function so that it can also be processed in a worker.
     * To pass ArrayBuffers by reference instead of by value, functions must be
     * specified which extract the ArrayBuffers from the function's inputs and
     * outputs.
     */
    var workerFunction = function (fn, inputTransfer, outputTransfer) {
        var fnId = workerFunctions.length;
        workerFunctions.push([
            fn,
            inputTransfer,
            outputTransfer,
        ]);
        return (function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            // Queue call for processing
            var result = new Promise(function (resolve, reject) {
                var callTermination = [resolve, reject];
                var message = [callCounter++, fnId, args];
                callQueue.push([message, callTermination]);
                tryDistributeCalls();
            });
            result.then(tryDistributeCalls, tryDistributeCalls);
            return result;
        });
    };
    /**
     * Register function call handler in the worker.
     */
    if (environment === 1 /* BrowserWorker */) {
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
            var nodes = (symbols.slice(symbolsEnd - count, symbolsEnd)).concat(transferNodes);
            transferNodes = [];
            for (var j = 0; j < nodes.length; j += 2) {
                transferNodes.push(nodes.slice(j, j + 2));
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
            var counts = Array.from(data.subarray(offset, offset + 16));
            offset += 16;
            // Get the symbols sorted by Huffman code
            var symbolCount = counts.reduce(function (sum, count) { return sum + count; }, 0);
            if (symbolCount > length - offset) {
                throw new InvalidJpegError('Invalid segment length');
            }
            var symbols = Array.from(data.subarray(offset, offset + symbolCount));
            offset += symbolCount;
            var tree = getHuffmanTree({ counts: counts, symbols: symbols });
            tables.push({
                cls: cls,
                id: id,
                tree: tree,
            });
        } while (offset !== length);
        return {
            type: 'DHT',
            tables: tables,
        };
    };

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

    var getUint8or16 = function (bytes) {
        return bytes === 1 ? function (data, offset) { return data[offset]; } : getUint16;
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
            var values = Array(64);
            var getUint = getUint8or16(bytes);
            for (var i = 0; i < 64; i += 1) {
                values[zigZag[i]] = getUint(data, i * bytes + offset);
            }
            tables.push({
                id: id,
                bytes: bytes,
                values: values,
            });
            offset += bytes * 64;
        } while (offset !== length);
        return {
            type: 'DQT',
            tables: tables,
        };
    };

    var isRestartMarker = function (marker) { return 0xd0 <= marker && marker <= 0xd7; };
    /**
     * Returns true if marker is APP0-APP15 (application-specific data)
     */
    var isAppMarker = function (marker) { return 0xe0 <= marker && marker <= 0xef; };
    var isMarkerSOF = function (marker) {
        return 192 /* SOF0 */ <= marker &&
            marker <= 0xcf &&
            marker !== 196 /* DHT */ &&
            marker !== 0xc8 /* Reserved */ &&
            marker !== 0xcc;
    }; /* DAC (Define arithmetic coding conditions) */
    var decodeAPP = function (appType, data) { return ({
        type: 'APP',
        appType: appType,
        data: data,
    }); };
    var decodeCOM = function (data) { return ({
        type: 'COM',
        text: String.fromCharCode.apply(null, data),
    }); };
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
            type: 'SOF',
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
        // JPEG must start with a SOI marker
        if (jpeg[0] !== 0xff || jpeg[1] !== 216 /* SOI */) {
            throw new InvalidJpegError('Missing SOI marker');
        }
        // The last marker in the file must be an EOI, and it must immediately follow
        // the compressed data of the last scan in the image.
        var result = [{ type: 'SOI' }];
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
                        var _a = getHiLow(jpeg[offset++]), dcTbl = _a[0], acTbl = _a[1];
                        components.push({ id: id, dcTbl: dcTbl, acTbl: acTbl });
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
                                type: 'SOS',
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
                    result.push({ type: 'EOI' });
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

    var identity = function (a) { return a; };

    /**
     * Reverse quantization by getting the DCT coefficients from the quantized
     * coefficients.
     */
    var dequantize = function (quantumValues, quantizedCoeff, outCoeff) {
        for (var i = 0; i < 64; i += 1) {
            outCoeff[i] = quantizedCoeff[i] * quantumValues[i];
        }
    };

    // mx := sqrt(2) * cos((x / 16) * PI)
    var m1 = 1.3870398453221475;
    var m2 = 1.3065629648763766;
    var m3 = 1.1758756024193588;
    var m5 = 0.7856949583871022;
    var m6 = 0.541196100146197;
    var m7 = 0.275899379282943;
    var tmp = [];
    /**
     * Apply function multM two times and scale by 1/8.
     */
    var multSym = function (multM) { return function (A) {
        multM(A, tmp);
        var C = [];
        multM(tmp, C);
        for (var i = 0; i < 64; i += 1) {
            C[i] /= 8;
        }
        return C;
    }; };

    var SQRT2 = Math.SQRT2;
    /**
     * Calculate B := (A * M/sqrt(8))^t
     */
    var multM = function (A, B) {
        // TODO Use scaled integers in IDCT to speed up decoding?
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
    /**
     * Floating point optimized IDCT.
     */
    var idct = multSym(multM);

    var add64 = function (x) { return function (input) {
        var output = [];
        for (var i = 0; i < 64; i += 1) {
            output[i] = input[i] + x;
        }
        return output;
    }; };

    var decenter = add64(128);

    /**
     * Input and output components in the range [0,255)
     *
     * See: https://www.w3.org/Graphics/JPEG/jfif3.pdf
     */
    var yCbCr2Rgb = function (_a) {
        var Y = _a[0], Cb = _a[1], Cr = _a[2];
        return [
            Y + 1.402 * Cr - 179.456,
            Y - 0.34414 * Cb - 0.71414 * Cr + 135.45984,
            Y + 1.772 * Cb - 226.816,
        ];
    };

    var decodeFrame = function (jpeg) {
        var huffmanTables = [[], []];
        var quantizationTables = [];
        var frameComponents = [];
        var data = {
            data: new Uint8ClampedArray(),
            width: 0,
            height: 0,
        };
        var yCbCr = []; // TODO remove
        var _loop_1 = function (segment) {
            switch (segment.type) {
                case 'DHT':
                    for (var _i = 0, _a = segment.tables; _i < _a.length; _i++) {
                        var table = _a[_i];
                        huffmanTables[table.cls][table.id] = table.tree;
                    }
                    break;
                case 'DQT':
                    for (var _b = 0, _c = segment.tables; _b < _c.length; _b++) {
                        var table = _c[_b];
                        quantizationTables[table.id] = table;
                    }
                    break;
                case 'SOF':
                    if (segment.frameType < 0 ||
                        segment.frameType > 1 ||
                        segment.precision !== 8) {
                        // Only sequential DCT frames with 8-bit samples are supported
                        throw new Error('Not 8-bit sequential');
                    }
                    var interleaved = segment.components.length > 1;
                    if (segment.components.length === 0) {
                        throw new InvalidJpegError('No components found');
                    }
                    if (!interleaved) {
                        // Support only interleaved scans at the moment
                        throw new Error('Not interleaved');
                    }
                    // Get maximum of all component horizontal/vertical sampling frequencies
                    var hMax_1 = Math.max.apply(Math, segment.components.map(function (component) { return component.h; }));
                    var vMax_1 = Math.max.apply(Math, segment.components.map(function (component) { return component.v; }));
                    frameComponents = [];
                    for (var _d = 0, _e = segment.components; _d < _e.length; _d++) {
                        var component = _e[_d];
                        frameComponents[component.id] = component;
                    }
                    // Get the data unit size in pixels for each component
                    var dataUnitSizes = segment.components.map(function (_a) {
                        var h = _a.h, v = _a.v;
                        return ({
                            x: (8 * hMax_1) / h,
                            y: (8 * vMax_1) / v,
                        });
                    });
                    // data unit: An 8 × 8 block of samples of one component
                    // horizontal sampling factor: The relative number of horizontal data units of a particular component with respect
                    //   to the number of horizontal data units in the other components.
                    // vertical sampling factor: The relative number of vertical data units of a particular component with respect to
                    //   the number of vertical data units in the other components in the frame.
                    // minimum coded unit; MCU: The smallest group of data units that is coded.
                    var mcuSizes = {
                        //the MCU contains one or more data units from each component
                        x: (segment.width + 8 * hMax_1 - 1) / (8 * hMax_1),
                        y: (segment.height + 8 * hMax_1 - 1) / (8 * hMax_1),
                    };
                    data = {
                        data: new Uint8ClampedArray(segment.width * segment.height * 4),
                        width: segment.width,
                        height: segment.height,
                    };
                    break;
                case 'SOS':
                    var huffmanTablesDC = huffmanTables[0], huffmanTablesAC = huffmanTables[1];
                    var getCoeff = decodeFns(segment.data).getCoeff;
                    for (var _f = 0, _g = segment.components; _f < _g.length; _f++) {
                        var component = _g[_f];
                        var _h = frameComponents[component.id], v = _h.v, h = _h.h, qId = _h.qId;
                        var quantizationTable = quantizationTables[qId];
                        for (var i = 0; i < v; i += 1) {
                            for (var j = 0; j < h; j += 1) {
                                //
                                var qcoeff = getCoeff(huffmanTablesDC[component.dcTbl], huffmanTablesAC[component.acTbl]);
                                //
                                var coeff = [];
                                dequantize(quantizationTable.values, qcoeff, coeff);
                                //
                                var values = idct(coeff);
                                // Decenter
                                var dvalues = decenter(values);
                                //
                                yCbCr[component.id - 1] = dvalues;
                            }
                        }
                    }
                    for (var i = 0; i < 64; i += 1) {
                        var _j = yCbCr2Rgb([yCbCr[0][i], yCbCr[1][i], yCbCr[2][i]]), r = _j[0], g = _j[1], b = _j[2];
                        data.data[i * 4 + 0] = r;
                        data.data[i * 4 + 1] = g;
                        data.data[i * 4 + 2] = b;
                        data.data[i * 4 + 3] = 255;
                    }
                    break;
                case 'EOI': return "break-segmentLoop";
            }
        };
        segmentLoop: for (var _i = 0, jpeg_1 = jpeg; _i < jpeg_1.length; _i++) {
            var segment = jpeg_1[_i];
            var state_1 = _loop_1(segment);
            switch (state_1) {
                case "break-segmentLoop": break segmentLoop;
            }
        }
        return data;
    };
    // [Bitmap] <-> Sampling <-> DCT <-> Quantization <-> Huffman Coding <-> [JPEG]
    // 4:4:4 (1x1,1x1,1x1) => Data unit 8x8 pixels
    // 4:2:2 (2x1,1x1,1x1) => Data unit 8x16 (Y), 16x16 (Cb, Cr) pixels
    // 4:2:0 (2x2,1x1,1x1) => Data unit 8x8 (Y), 16x16 (Cb, Cr) pixels
    var decodeFns = function (data) {
        // The Position of the next byte in the data
        var offset = 0;
        // The current data byte
        var currentByte;
        // Position of the next bit in the current byte
        var byteOffset = -1;
        var nextBit = function () {
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
        var lastDc = 0;
        var nextDc = function (huffmanTreeDC) {
            return (lastDc += nextDcDiff(huffmanTreeDC));
        };
        var getCoeff = function (huffmanTreeDC, huffmanTreeAC) {
            lastDc = 0; // TODO remove
            var coefficients = [];
            coefficients[0] = nextDc(huffmanTreeDC);
            for (var i = 1; i < 64; i += 1) {
                coefficients[i] = 0;
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
                    coefficients[zigZag[i]] = extend(extraBits, loBits);
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
            return coefficients;
        };
        return {
            nextBit: nextBit,
            nextHuffmanByte: nextHuffmanByte,
            nextDcDiff: nextDcDiff,
            nextDc: nextDc,
            getCoeff: getCoeff,
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

    // Create variable for correct type in d.ts file (will be removed my minifier)
    var version$1 = version;
    var getBuffer = function (dataContainer) { return [
        dataContainer.data.buffer,
    ]; };
    var getJpegBuffer = function (jpeg) {
        // Find the first SOS segment and return the referenced JPEG input buffer.
        // This is sufficient because all data segment (APP, SOS) views reference
        // the same buffer. There is always a SOS segment.
        return getBuffer(jpeg.find(function (segment) { return segment.type === 'APP' || segment.type === 'SOS'; }));
    };
    var _decode = function (jpegData) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, decodeJpeg(new Uint8Array(jpegData))];
    }); }); };
    var _decodeImage = function (jpeg) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, data, width, height;
        return __generator(this, function (_b) {
            _a = decodeFrame(jpeg), data = _a.data, width = _a.width, height = _a.height;
            return [2 /*return*/, new ImageData(data, width, height)];
        });
    }); };
    var decode = workerFunction(_decode, identity, getJpegBuffer);
    var decodeImage = workerFunction(_decodeImage, function (_a) {
        var jpeg = _a[0];
        return getJpegBuffer(jpeg);
    }, getBuffer);

    exports.decode = decode;
    exports.decodeImage = decodeImage;
    exports.setWorker = setWorker;
    exports.version = version$1;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
