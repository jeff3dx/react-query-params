# React Query Params
Easy to use query param support for React and React Router 4.

Plays super nice with React:

- Semantically similar to setState()
- Get/set arrays and objects
- Default values and clean URL's
- Opt in to browser history
- Read incoming query params from componentWillReceiveProps()

## Support
jeffbutsch@gmail.com

twitter [@jeff3dx](https://twitter.com/jeff3dx)

[Submit issue on github](https://github.com/jeff3dx/react-query-param-support/issues)


## Requirements
React Router 4.0.0+


## Installation
Install using yarn or npm:

	yarn add react-query-params 


## Setup
ReactQueryParams is the base class (ex. App.jsx)

	import ReactQueryParams from 'react-query-params';

	export default class App extends ReactQueryParams {
	  /* Your code */
	}

## Usage
### Get

	const value = this.queryParams.food;

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

	export default class MyClass extends ReactQueryParams {
	    defaultQueryParams = {
	        lunch: 'bacon'
	    }
	}

## Array and Object Values

### Set
React-query-params does not use the repeating param approach for representing arrays on the URL, but instead stringifies arrays for URL storage. Saves characters, elements can be objects, marvellous in every way.

	const food = ['bacon', 'nutella'];
	this.setQueryParams({ lunch: food });
	const first = this.queryParams.lunch[0];

### Clear
Set the value to an empty array []. Don't set to blank. React-query-params detects stringified arrays and objects based on whether the string is enclosed with '[]' or '{}' characters.

	this.setQueryParams({ lunch: [] });

### Default value as array
The only time you have to convert an array or object to a JSON string yourself is when you set a defaultQueryParams value.

Correct syntax - stringify the value yourself only when setting a default value.

	defaultQueryParams = {
		lunch: '["bacon","nutella"]'
	}




