# Thanks

August, 2020:

Thanks you for all the great feedback. react-query-params served its purpose as a React class extension, providing access to query params with the semantics of setState(). However, we're moving on to the new paradigm of React Hooks. **Since react-query-params doesn't fit in the Hooks paradigm it will no longer be maintained.** If you still find it useful please fork it and use it as you see fit. In the near future I may develop a Hooks version of the library and include some new features such as support for localStorage. 

---

# React Query Params [![react-query-params on npm](https://badge.fury.io/js/react-query-params.svg)](https://www.npmjs.com/package/react-query-params)
Easy to use query param support for React.

Plays super nice with React:

- Semantically similar to setState()
- Get/set arrays and objects
- Clean URL's with default values
- Opt in to browser history
- Optionally read next query params from componentWillReceiveProps()

## Installation
Install with npm:

	npm install react-query-params

## Setup
To be as seamless as possible ReactQueryParams is used as a base class were you would normally use Component. It inherits Component so you're not losing anything.
Ex. App.jsx:

	import ReactQueryParams from 'react-query-params';

	export default class MyApp extends ReactQueryParams {
	  /* Your code */
	}

## Usage
### Get

	const value = this.queryParams.lunch;

### Set
Semantically similar to React setState():

	this.setQueryParams({
		game: 'chess',
		algorithm: 'neural network'
	});

When you set query param values an update is triggered just like setState().

setQueryParams() does not have or need an asynchronous variation.

## Important
If a value is in a query param do not put it in state. The query param should own the value and be the source of truth for the value.

## defaultQueryParams (optional)

Semantically similar to React defaultProps.

	import ReactQueryParams from 'react-query-params';

	export default class MyApp extends ReactQueryParams {
	    defaultQueryParams = {
	        game: 'go'
	    }
	}

When you define a default value the query param can be omitted from the URL but it's value is available just like any other query param.

### Clean URL's with defaultQueryParams
By defining defaults for all your query params your app can load with a clean address having no explicit query string! If a query param is omitted from the URL query string it's default value is used. When you programmatically set a query param to its default value it will be removed from the URL query string. When you programmatically set a query param to a non-default value it will be added back to the URL.

## Array and Object Values

### Set
React-query-params does not use the repeating param approach for representing arrays on the URL, but instead stringifies arrays and objects for URL storage. Saves characters, more flexible, marvelous in every way.

	const choices = ['chess', 'go'];
	this.setQueryParams({ games: choices });
	const first = this.queryParams.game[0];

### Clear
To set an empty array use array literal syntax []. Don't set to null or empty string. React-query-params detects arrays and objects based on enclosing "[]" or "{}" characters.

	this.setQueryParams({ games: [] });

### Default value as Array or Object
ReactQueryParams has built in support for objects and arrays. However, there is one and only one case where you need to stringify the value yourself.
When setting values in defaultQueryParams you must stringify objects and arrays yourself. JSON.stringify() can be a less error prone way to do it.

	defaultQueryParams = {
		games: JSON.stringify(['chess','go'])
	}


## getQueryParam(name, source) (optional)
Method getQueryParam() reads one param value at a time but you can specify an alternate source. For instance you can read future query param values from React lifecycle hook componentWillReceiveProps().

	componentWillReceiveProps(nextProps) {
		const myParamVal = this.getQueryParam('myparam', nextProps);
	}




## Support
Jeff Butsch

Software Engineer at Netflix

Email [jbutsch@netflix.com](mailto:jbutsch@netflix.com?subject=I%20love%20react-query-params)

twitter [@jeff3dx](https://twitter.com/jeff3dx)

License: MIT
