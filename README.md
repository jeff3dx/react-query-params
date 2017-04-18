# React Query Params
Easy to use query param support for React.

Plays super nice with React:

- Semantically similar to setState()
- Get/set arrays and objects
- Clean URL's with default values
- Opt in to browser history
- Can read next query params from componentWillReceiveProps()

## Support
Email [jeffbutsch@gmail.com](mailto:jeffbutsch@gmail.com?subject=I%20love%20react-query-params)

Submit issue [on github](https://github.com/jeff3dx/react-query-param-support/issues)


## Installation
Install with npm (or yarn):

	npm install react-query-params

## Setup
ReactQueryParams is the base class (ex. App.jsx)

	import ReactQueryParams from 'react-query-params';

	export default class MyApp extends ReactQueryParams {
	  /* Your code */
	}

## Usage
### Get

	const value = this.queryParams.lunch;

### Set
Semantically similar to React's setState():

	this.setQueryParams({
		lunch: 'nutella',
		dinner: 'pie'
	});

When you set query param values an update is triggered just like setState().

setQueryParams() does not have or need an asynchronous variation.

## Important
If a value is in a query param do not put it in state. The query param should own the value and be the source of truth for the value.

## Optional - defaultQueryParams

Semantically similar to defaultProps.

	import ReactQueryParams from 'react-query-params';

	export default class MyApp extends ReactQueryParams {
	    defaultQueryParams = {
	        lunch: 'bacon'
	    }
	}

## Array and Object Values

### Set
React-query-params does not use the repeating param approach for representing arrays on the URL, but instead stringifies arrays for URL storage. Saves characters, elements can be objects, marvelous in every way.

	const food = ['bacon', 'nutella'];
	this.setQueryParams({ lunch: food });
	const first = this.queryParams.lunch[0];

### Clear
Set the value to an empty array []. Don't set to blank. React-query-params detects stringified arrays and objects based on whether the string is enclosed with '[]' or '{}' characters.

	this.setQueryParams({ lunch: [] });

### Default value as array
ReactQueryParams has built in support for object and array values. However, there is one, and only one, case where you need to stringify the value yourself.
When setting values in defaultQueryParams you must stringify objects and arrays yourself.

Correct syntax - stringify object or array value yourself only when setting a default value:

	defaultQueryParams = {
		lunch: '["bacon","nutella"]'
	}




