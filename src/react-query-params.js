
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

import { Component } from "react";
import { createBrowserHistory } from "history";

function isUndefined(value) {
  return value === undefined;
}

function isNil(value) {
  // eslint-disable-next-line
  return value == null;
}

function isObject(value) {
  const type = typeof value;
  // eslint-disable-next-line
  return value != null && (type == "object" || type == "function");
}

function startsWith(value, searchString, position) {
  position = position || 0;
  return value.substr(position, searchString.length) === searchString;
}

function endsWith(value, searchString, position) {
  const subjectString = value.toString();
  if (
    typeof position !== "number" ||
    !isFinite(position) ||
    Math.floor(position) !== position ||
    position > subjectString.length
  ) {
    position = subjectString.length;
  }
  position -= searchString.length;
  const lastIndex = subjectString.lastIndexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
}

/**
 * React Query Params Component base class
 * Support: https://github.com/jeff3dx/react-query-params
 */
export default class ReactQueryParams extends Component {
  constructor(router) {
    super();
    if (this.context && this.context.router) {
      this.history = this.context.router;
    } else {
      this.history = createBrowserHistory();
    }
  }

  /* Clear the query param cache */
  componentWillUpdate() {
    this._queryParamsCache = null;

    if (super.componentWillUpdate) {
      super.componentWillUpdate();
    }
  }

  /**
   * Convert boolean string to boolean type.
   * Any query param set to "true" or "false" will be converted to a boolean type.
   * @param {string} value - the query param string value
   */
  _boolify(value) {
    if (typeof value === "string") {
      const value2 = value.toLowerCase().trim();
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
  _queryParamToObject(value) {
    let result = value;
    if (
      typeof value === "string" &&
      ((startsWith(value, "[") && endsWith(value, "]")) ||
        (startsWith(value, "{") && endsWith(value, "}")))
    ) {
      try {
        result = JSON.parse(decodeURIComponent(value));
      } catch (ex) {
        console.error(ex);
        // Can't parse so fall back to verbatim value
        result = value;
      }
    }
    return result;
  }

  _queryParamsCache;

  _resolveSearchParams(source = window) {
    let searchParams = {};

    if (source.location.query) {
      searchParams = source.location.query;
    } else if (source.location.search) {
      const queryString = (source.location.search || '').replace('?', '');
      
      searchParams = queryString.split('&')
	.filter(pair => !!pair && ~pair.indexOf('='))
        .map(pair => pair.split('='))
        .reduce((aggregated, current = []) => {  
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
  get queryParams() {
    if (isNil(this._queryParamsCache)) {
      const searchParams = this._resolveSearchParams();

      const defaults = this.defaultQueryParams || {};
      const all = { ...defaults, ...searchParams };
      Object.keys(all).forEach(key => {
        all[key] = this._boolify(all[key]);
        all[key] = this._queryParamToObject(all[key]);
      });
      this._queryParamsCache = all;
    }
    return this._queryParamsCache;
  }

  /**
   * Get one query param value.
   * @param {string} key - The query param key
   * @param {object} props - Optional. An alternate props object to use instead of the current props
   */
  getQueryParam(key, source = window) {
    const defaults = this.defaultQueryParams || {};
    const searchParams = this._resolveSearchParams(source);
    let result = isUndefined(searchParams[key])
      ? searchParams[key]
      : defaults[key];
    result = this._boolify(result);
    result = this._queryParamToObject(result);
    return result;
  }

  /**
   * Set query param values. Merges changes similar to setState().
   * @param {object} params - Object of key:values to overlay on current query param values.
   * @param {boolean} addHistory - true = add browser history, default false.
   */
  setQueryParams(params, addHistory = false) {
    const searchParams = this._resolveSearchParams();

    const nextQueryParams = { ...searchParams, ...params };
    const defaults = this.defaultQueryParams || {};

    Object.keys(nextQueryParams).forEach(key => {
      // If it's an object value (object, array, etc.) convert it to a string
      if (isObject(nextQueryParams[key])) {
        try {
          nextQueryParams[key] = JSON.stringify(nextQueryParams[key]);
        } catch (ex) {
          console.log(
            "react-query-params -- Failed to serialize queryParam " + key,
            ex
          );
          nextQueryParams[key] = "";
        }
      }
      // Remove params that match the default
      if (nextQueryParams[key] === defaults[key]) {
        delete nextQueryParams[key];
      }
    });

    const search =
      "?" +
      Object.keys(nextQueryParams)
        .map(key => `${key}=${nextQueryParams[key]}`)
        .join("&");

    if (addHistory) {
      this.history.push({ pathname: window.location.pathname, search });
    } else {
      this.history.replace({ pathname: window.location.pathname, search });
    }

    // Clear the cache
    this._queryParamsCache = null;

    this.forceUpdate();
  }
}
