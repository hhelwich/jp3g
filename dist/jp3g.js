(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.jp3g = {}));
}(this, (function (exports) { 'use strict';

  var version = "0.0.0";

  // Create variable for correct type in d.ts file
  var version$1 = version;

  exports.version = version$1;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
