'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _react = require('react');

var _lodash = require('lodash');

var _history = require('history');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function isUndefined(value) {
  return value === undefined;
}

/**
 * React Query Params
 * Support: https://github.com/jeff3dx/react-query-params
 */

var ReactQueryParams = function (_Component) {
  _inherits(ReactQueryParams, _Component);

  function ReactQueryParams() {
    _classCallCheck(this, ReactQueryParams);

    var _this = _possibleConstructorReturn(this, (ReactQueryParams.__proto__ || Object.getPrototypeOf(ReactQueryParams)).call(this));

    _this.history = (0, _history.createBrowserHistory)();
    return _this;
  }

  /* Clear the query param cache */


  _createClass(ReactQueryParams, [{
    key: 'componentWillUpdate',
    value: function componentWillUpdate() {
      this._queryParamsCache = null;

      if (_get(ReactQueryParams.prototype.__proto__ || Object.getPrototypeOf(ReactQueryParams.prototype), 'componentWillUpdate', this)) {
        _get(ReactQueryParams.prototype.__proto__ || Object.getPrototypeOf(ReactQueryParams.prototype), 'componentWillUpdate', this).call(this);
      }
    }

    /**
     * Convert boolean string to boolean type.
     * Any query param set to "true" or "false" will be converted to a boolean type.
     * @param {string} value - the query param string value
     */

  }, {
    key: '_boolify',
    value: function _boolify(value) {
      if (typeof value === 'string') {
        var value2 = value.toLowerCase().trim();
        if (value2 === 'true') {
          return true;
        } else if (value2 === 'false') {
          return false;
        }
      }
      return value;
    }
  }, {
    key: '_queryParamToObject',


    /**
     * If query param value looks like an object try to parse it
     */
    value: function _queryParamToObject(value) {
      var result = value;
      if (typeof value === 'string' && ((0, _lodash.startsWith)(value, '[') && (0, _lodash.endsWith)(value, ']') || (0, _lodash.startsWith)(value, '{') && (0, _lodash.endsWith)(value, '}'))) {
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

    /**
     * Holds the current calculated query params. Optimizes the case where the getter is accessed multiple times before the next render cycle.
     * Query params are lazy calculated if this variable is null.
     */

  }, {
    key: 'getQueryParam',


    /**
     * Get one query param value.
     * @param {string} key - The query param key
     * @param {object} props - Optional. An alternate props object to use instead of the current props
     */
    value: function getQueryParam(key) {
      var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.props;

      var defaults = this.defaultQueryParams || {};
      var result = isUndefined(props.location.query[key]) ? props.location.query[key] : defaults[key];
      result = this._boolify(result);
      result = this._queryParamToObject(result);
      return result;
    }
  }, {
    key: 'setQueryParams',


    /**
     * Set query param values. Merges changes, similar to setState().
     * Params that match the default value are removed from the URL to keep it clean, but the value is still available as normal.
     * @param {object} params - Object of key:values to overlay on current query param values.
     * @param {boolean} addHistory - true = add browser history, default false.
     */
    value: function setQueryParams(params) {
      var addHistory = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var nextQueryParams = _extends({}, this.props.location.query, params);
      var defaults = this.defaultQueryParams || {};

      Object.keys(nextQueryParams).forEach(function (key) {
        // If it's an object value (object, array, etc.) convert it to a string
        if ((0, _lodash.isObject)(nextQueryParams[key])) {
          try {
            nextQueryParams[key] = JSON.stringify(nextQueryParams[key]);
          } catch (ex) {
            console.log('react-query-params -- Failed to serialize queryParam ' + key, ex);
            nextQueryParams[key] = '';
          }
        }
        // Remove params that match the default
        if (nextQueryParams[key] === defaults[key]) {
          delete nextQueryParams[key];
        }
      });

      var values = Object.keys(nextQueryParams).map(function (key) {
        return key + '=' + nextQueryParams[key];
      });
      var search = '?' + values.join('&');

      if (addHistory) {
        this.history.push({
          path: window.location.pathname,
          search: search
        });
      } else {
        this.history.replace({
          pathname: window.location.pathname,
          search: search
        });
      }

      // Clear the cache
      this._queryParamsCache = null;
    }
  }, {
    key: 'queryParams',


    /**
     * Returns a map of query params with defaults resolved.
     */
    get: function get() {
      var _this2 = this;

      if ((0, _lodash.isNil)(this._queryParamsCache)) {

        var searchParams = {};
        if (this.props.location.query) {
          // react-router 3.0
          searchParams = this.props.location.query;
        } else if (this.props.location.search) {
          // react-router 4.0
          var urlSearch = new URLSearchParams(this.props.location.search);
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = urlSearch[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var pair = _step.value;

              searchParams[pair[0]] = pair[1];
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
        }

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