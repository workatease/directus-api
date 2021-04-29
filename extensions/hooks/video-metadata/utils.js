"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.getVideoDuration = exports.getWidth = exports.getHeight = void 0;

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = (typeof Symbol !== "undefined" && o[Symbol.iterator]) || o["@@iterator"];
  if (!it) {
    if (
      Array.isArray(o) ||
      (it = _unsupportedIterableToArray(o)) ||
      (allowArrayLike && o && typeof o.length === "number")
    ) {
      if (it) o = it;
      var i = 0;
      var F = function F() {};
      return {
        s: F,
        n: function n() {
          if (i >= o.length) return { done: true };
          return { done: false, value: o[i++] };
        },
        e: function e(_e) {
          throw _e;
        },
        f: F,
      };
    }
    throw new TypeError(
      "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
    );
  }
  var normalCompletion = true,
    didErr = false,
    err;
  return {
    s: function s() {
      it = it.call(o);
    },
    n: function n() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function e(_e2) {
      didErr = true;
      err = _e2;
    },
    f: function f() {
      try {
        if (!normalCompletion && it["return"] != null) it["return"]();
      } finally {
        if (didErr) throw err;
      }
    },
  };
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}

var getHeight = function getHeight(streams) {
  var value = null;

  if (streams && Array.isArray(streams)) {
    var _iterator = _createForOfIteratorHelper(streams),
      _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done; ) {
        var element = _step.value;

        if (element.height) {
          value = element.height;
          break;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }

  return value;
};

exports.getHeight = getHeight;

var getWidth = function getWidth(streams) {
  var value = null;

  if (streams && Array.isArray(streams)) {
    var _iterator2 = _createForOfIteratorHelper(streams),
      _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
        var element = _step2.value;

        if (element.width) {
          value = element.width;
          break;
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  }

  return value;
};

exports.getWidth = getWidth;

var getVideoDuration = function getVideoDuration(streams) {
  var value = null;

  if (streams && Array.isArray(streams)) {
    var _iterator3 = _createForOfIteratorHelper(streams),
      _step3;

    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done; ) {
        var element = _step3.value;

        if (element.codec_type === "video" && element.duration) {
          value = parseInt(element.duration);
          break;
        }
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
  }

  return value;
};

exports.getVideoDuration = getVideoDuration;
