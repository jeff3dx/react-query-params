"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
/*
  Copyright (c) 2017 Jeff Butsch

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

var _react = require("react");

var _history = require("history");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function isUndefined(value) {
  return value === undefined;
}

function isNil(value) {
  // eslint-disable-next-line
  return value == null;
}

function isObject(value) {
  var type = typeof value === "undefined" ? "undefined" : _typeof(value);
  // eslint-disable-next-line
  return value != null && (type == "object" || type == "function");
}

function startsWith(value, searchString, position) {
  position = position || 0;
  return value.substr(position, searchString.length) === searchString;
}

function endsWith(value, searchString, position) {
  var subjectString = value.toString();
  if (typeof position !== "number" || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
    position = subjectString.length;
  }
  position -= searchString.length;
  var lastIndex = subjectString.lastIndexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
}

/**
 * React Query Params Component base class
 * Support: https://github.com/jeff3dx/react-query-params
 */

var ReactQueryParams = function (_Component) {
  _inherits(ReactQueryParams, _Component);

  function ReactQueryParams(router) {
    _classCallCheck(this, ReactQueryParams);

    var _this = _possibleConstructorReturn(this, (ReactQueryParams.__proto__ || Object.getPrototypeOf(ReactQueryParams)).call(this));

    if (_this.context && _this.context.router) {
      _this.history = _this.context.router;
    } else {
      _this.history = (0, _history.createBrowserHistory)();
    }
    return _this;
  }

  /* Clear the query param cache */


  _createClass(ReactQueryParams, [{
    key: "componentWillUpdate",
    value: function componentWillUpdate() {
      this._queryParamsCache = null;

      if (_get(ReactQueryParams.prototype.__proto__ || Object.getPrototypeOf(ReactQueryParams.prototype), "componentWillUpdate", this)) {
        _get(ReactQueryParams.prototype.__proto__ || Object.getPrototypeOf(ReactQueryParams.prototype), "componentWillUpdate", this).call(this);
      }
    }

    /**
     * Convert boolean string to boolean type.
     * Any query param set to "true" or "false" will be converted to a boolean type.
     * @param {string} value - the query param string value
     */

  }, {
    key: "_boolify",
    value: function _boolify(value) {
      if (typeof value === "string") {
        var value2 = value.toLowerCase().trim();
        if (value2 === "true") {
          return true;
        } else if (value2 === "false") {
          return false;
        }
      }
      return value;
    }

    /**
     * If query param string is object-like try to parse it
     */

  }, {
    key: "_queryParamToObject",
    value: function _queryParamToObject(value) {
      var result = value;
      if (typeof value === "string" && (startsWith(value, "[") && endsWith(value, "]") || startsWith(value, "{") && endsWith(value, "}"))) {
        try {
          result = JSON.parse(value);
        } catch (ex) {
          console.error(ex);
          // Can't parse so fall back to verbatim value
          result = value;
        }
      }
      return result;
    }
  }, {
    key: "_resolveSearchParams",
    value: function _resolveSearchParams() {
      var source = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;

      var searchParams = {};

      if (source.location.query) {
        searchParams = source.location.query;
      } else if (source.location.search) {
        var queryString = (source.location.search || '').replace('?', '');

        searchParams = queryString.split('&').filter(function (pair) {
          return !!pair && ~pair.indexOf('=');
        }).map(function (pair) {
          return pair.split('=');
        }).reduce(function (aggregated) {
          var current = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

          aggregated[current[0]] = current[1];
          return aggregated;
        }, searchParams);
      }
      return searchParams;
    }

    /**
     * Returns a map of all query params including default values. Params that match
     * the default value do not show up in the URL but are still available here.
     */

  }, {
    key: "getQueryParam",


    /**
     * Get one query param value.
     * @param {string} key - The query param key
     * @param {object} props - Optional. An alternate props object to use instead of the current props
     */
    value: function getQueryParam(key) {
      var source = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window;

      var defaults = this.defaultQueryParams || {};
      var searchParams = this._resolveSearchParams(source);
      var result = isUndefined(searchParams[key]) ? searchParams[key] : defaults[key];
      result = this._boolify(result);
      result = this._queryParamToObject(result);
      return result;
    }

    /**
     * Set query param values. Merges changes similar to setState().
     * @param {object} params - Object of key:values to overlay on current query param values.
     * @param {boolean} addHistory - true = add browser history, default false.
     */

  }, {
    key: "setQueryParams",
    value: function setQueryParams(params) {
      var addHistory = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var searchParams = this._resolveSearchParams();

      var nextQueryParams = _extends({}, searchParams, params);
      var defaults = this.defaultQueryParams || {};

      Object.keys(nextQueryParams).forEach(function (key) {
        // If it's an object value (object, array, etc.) convert it to a string
        if (isObject(nextQueryParams[key])) {
          try {
            nextQueryParams[key] = JSON.stringify(nextQueryParams[key]);
          } catch (ex) {
            console.log("react-query-params -- Failed to serialize queryParam " + key, ex);
            nextQueryParams[key] = "";
          }
        }
        // Remove params that match the default
        if (nextQueryParams[key] === defaults[key]) {
          delete nextQueryParams[key];
        }
      });

      var search = "?" + Object.keys(nextQueryParams).map(function (key) {
        return key + "=" + encodeURIComponent(nextQueryParams[key]);
      }).join("&");

      if (addHistory) {
        this.history.push({ pathname: window.location.pathname, search: search });
      } else {
        this.history.replace({ pathname: window.location.pathname, search: search });
      }

      // Clear the cache
      this._queryParamsCache = null;

      this.forceUpdate();
    }
  }, {
    key: "queryParams",
    get: function get() {
      var _this2 = this;

      if (isNil(this._queryParamsCache)) {
        var searchParams = this._resolveSearchParams();

        var defaults = this.defaultQueryParams || {};
        var all = _extends({}, defaults, searchParams);
        Object.keys(all).forEach(function (key) {
          all[key] = _this2._boolify(all[key]);
          all[key] = _this2._queryParamToObject(all[key]);
        });
        this._queryParamsCache = all;
      }
      return this._queryParamsCache;
    }
  }]);

  return ReactQueryParams;
}(_react.Component);

exports.default = ReactQueryParams;