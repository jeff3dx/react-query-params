import { Component } from 'react';
import { isNil, isObject, startsWith, endsWith } from 'lodash';
import { createBrowserHistory } from 'history';

function isUndefined(value) {
  return value === undefined;
}

/**
 * React Query Params
 * Support: https://github.com/jeff3dx/react-query-params
 */
export default class ReactQueryParams extends Component {
  constructor() {
    super();
    this.history = createBrowserHistory();
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
    if (typeof value === 'string') {
      const value2 = value.toLowerCase().trim();
      if (value2 === 'true') {
        return true;
      } else if (value2 === 'false') {
        return false;
      }
    }
    return value;
  };

  /**
   * If query param value looks like an object try to parse it
   */
  _queryParamToObject(value) {
    let result = value;
    if (typeof value === 'string' && ((startsWith(value, '[') && endsWith(value, ']')) || (startsWith(value, '{') && endsWith(value, '}') ))) {
      try {
        result = JSON.parse(value);
      } catch(ex) {
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
  _queryParamsCache;

  /**
   * Returns a map of query params with defaults resolved.
   */
  get queryParams() {
    if (isNil(this._queryParamsCache)) {

      let searchParams = {};
      if (this.props.location.query) {
        // react-router 3.0
        searchParams = this.props.location.query;
      } else if (this.props.location.search) {
        // react-router 4.0
        const urlSearch = new URLSearchParams(this.props.location.search);
        for (let pair of urlSearch) {
          searchParams[pair[0]] = pair[1];
        }
      }

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
  getQueryParam(key, props = this.props) {
    const defaults = this.defaultQueryParams || {};
    let result = isUndefined(props.location.query[key]) ? props.location.query[key] : defaults[key];
    result = this._boolify(result);
    result = this._queryParamToObject(result);
    return result;
  };

  /**
   * Set query param values. Merges changes, similar to setState().
   * Params that match the default value are removed from the URL to keep it clean, but the value is still available as normal.
   * @param {object} params - Object of key:values to overlay on current query param values.
   * @param {boolean} addHistory - true = add browser history, default false.
   */
  setQueryParams(params, addHistory = false) {
    const nextQueryParams = { ...this.props.location.query, ...params };
    const defaults = this.defaultQueryParams || {};

    Object.keys(nextQueryParams).forEach(key => {
      // If it's an object value (object, array, etc.) convert it to a string
      if (isObject(nextQueryParams[key])) {
        try {
          nextQueryParams[key] = JSON.stringify(nextQueryParams[key]);
        } catch(ex) {
          console.log('react-query-params -- Failed to serialize queryParam ' + key, ex);
          nextQueryParams[key] = '';
        }
      }
      // Remove params that match the default
      if (nextQueryParams[key] === defaults[key]) {
        delete nextQueryParams[key];
      }
    });

    const values = Object.keys(nextQueryParams).map(key => `${key}=${nextQueryParams[key]}`);
    const search = `?${values.join('&')}`;

    if (addHistory) {
      this.history.push({
        path: window.location.pathname,
        search
      });
    } else {
      this.history.replace({
        pathname: window.location.pathname,
        search
      });
    }

    // Clear the cache
    this._queryParamsCache = null;
  };
}
