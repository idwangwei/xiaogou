'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _localforage = require('localforage');

var _localforage2 = _interopRequireDefault(_localforage);

var _sha = require('sha-1');

var _sha2 = _interopRequireDefault(_sha);

var _deserializable = require('deserializable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var hasIDB = Boolean(typeof window !== 'undefined' && (window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB));

var stringify = hasIDB ? function (value) {
  return value;
} : _deserializable.stringify;
var parse = hasIDB ? function (value) {
  return value;
} : _deserializable.parse;

var ENTIRE_STATE = '__ENTIRE_STATE__';
var EMPTY_STATE = '__EMPTY_STATE__';

var dataStore = _localforage2.default.createInstance({ name: 'data' });
var queryStore = _localforage2.default.createInstance({ name: 'queries' });

var reading = {};
var writing = {};
var debounce = {};
var queryBuffer = null;

var warn = typeof console !== 'undefined' ? console.warn.bind(console) : function () {};

function getItemKey(key, reducerKey) {
  if (reducerKey) {
    return key + '/' + reducerKey;
  }

  return key;
}

function getQueryableKey(state) {
  var reducerKey = arguments.length <= 1 || arguments[1] === undefined ? ENTIRE_STATE : arguments[1];

  if (typeof state !== 'string') {
    if (hasIDB) {
      state = JSON.stringify(state);
    } else {
      state = stringify(state);
    }
  }

  if (state && state.length > 40) {
    state = (0, _sha2.default)(state);
  }

  return encodeURIComponent(reducerKey) + '=' + encodeURIComponent(state);
}

function getInitialState(_ref, setState) {
  var key = _ref.key;
  var reducerKey = _ref.reducerKey;

  var itemKey = getItemKey(key, reducerKey);
  var handler = function handler(error, state) {
    if (error) {
      warn(error);
      setState();
    } else if (typeof state === 'undefined' || state === null) {
      setState();
    } else {
      setState(parse(state));
    }
  };

  if (reading[itemKey]) {
    reading[itemKey].push(handler);
  } else {
    (function () {
      var clearHandlers = function clearHandlers(error, state) {
        if (typeof writing[itemKey] !== 'undefined') {
          state = writing[itemKey];
        }

        var handlers = reading[itemKey];

        delete reading[itemKey];

        while (handlers.length) {
          handlers.shift()(error, state);
        }
      };

      reading[itemKey] = [handler];

      dataStore.getItem(itemKey).then(function (state) {
        clearHandlers(null, state);
      }).catch(function (error) {
        clearHandlers(error);
      });
    })();
  }
}

function onStateChange(_ref2, state, nextState) {
  var key = _ref2.key;
  var reducerKey = _ref2.reducerKey;
  var queryable = _ref2.queryable;

  var itemKey = getItemKey(key, reducerKey);

  writing[itemKey] = nextState;

  if (queryable && !queryBuffer) {
    queryBuffer = [];
  }

  clearTimeout(debounce[itemKey]);
  debounce[itemKey] = setTimeout(function () {
    nextState = writing[itemKey];
    delete writing[itemKey];

    if (!queryable) {
      dataStore.setItem(itemKey, stringify(nextState)).catch(warn);
      return;
    }

    var queryableKey = getQueryableKey(nextState, reducerKey);

    Promise.all([dataStore.getItem(itemKey), dataStore.getItem(queryableKey), dataStore.setItem(itemKey, stringify(nextState))]).then(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2);

      var prevState = _ref4[0];
      var keyMap = _ref4[1];

      var prevQueryableKey = getQueryableKey(prevState, reducerKey);

      keyMap = keyMap || {};
      keyMap[key] = true;

      Promise.all([queryStore.getItem(prevQueryableKey), queryStore.setItem(queryableKey, keyMap)]).then(function (_ref5) {
        var _ref6 = _slicedToArray(_ref5, 1);

        var prevKeyMap = _ref6[0];

        if (prevKeyMap && queryableKey !== prevQueryableKey) {
          delete prevKeyMap[key];
          queryStore.setItem(prevQueryableKey, prevKeyMap).then(clearQueryBuffer).catch(warn);
        } else {
          clearQueryBuffer();
        }
      }).catch(warn);
    }).catch(warn);
  }, localforageReplicator.debounce);
}

function clearQueryBuffer() {
  if (queryBuffer) {
    while (queryBuffer.length) {
      queryBuffer.shift()();
    }

    queryBuffer = null;
  }
}

function handleQuery(query, options, setResult) {
  var keys = null;
  var semaphore = 1;
  var clear = function clear() {
    if (--semaphore === 0) {
      keys = Object.keys(keys);

      if (options.length) {
        setResult(keys && keys.length || 0);
      } else if (options.keys) {
        setResult(keys);
      } else {
        getMultiple(keys, options.select, setResult);
      }
    }
  };

  if ((typeof query === 'undefined' ? 'undefined' : _typeof(query)) !== 'object') {
    query = _defineProperty({}, ENTIRE_STATE, query);
  }

  Object.keys(query).forEach(function (reducerKey) {
    var contents = query[reducerKey];
    var queryableKey = getQueryableKey(contents, reducerKey, false);
    function queryHandler() {
      queryStore.getItem(queryableKey).then(function (keyMap) {
        if (keys) {
          for (var key in keys) {
            if (typeof keyMap[key] === 'undefined') {
              delete keys[key];
            }
          }
        } else {
          keys = keyMap || {};
        }

        clear();
      }).catch(function (error) {
        warn(error);
        clear();
      });
    }

    semaphore++;

    if (queryBuffer) {
      queryBuffer.push(queryHandler);
    } else {
      queryHandler();
    }
  });

  clear();
}

function getMultiple(keys, reducerKeys, setResult) {
  var result = [];
  var semaphore = keys.length * reducerKeys.length;
  var clear = function clear() {
    if (--semaphore === 0) {
      setResult(result);
    }
  };

  if (semaphore) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      var _loop = function _loop() {
        var key = _step.value;

        var item = {};

        result.push(item);

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          var _loop2 = function _loop2() {
            var reducerKey = _step2.value;

            getInitialState({ key: key, reducerKey: reducerKey }, function (state) {
              item[reducerKey] = state;
              clear();
            });
          };

          for (var _iterator2 = reducerKeys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            _loop2();
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      };

      for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        _loop();
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  } else {
    semaphore = 1;
    clear();
  }
}

var localforageReplicator = {
  getInitialState: getInitialState, onStateChange: onStateChange, handleQuery: handleQuery, debounce: 10
};

exports.default = localforageReplicator;