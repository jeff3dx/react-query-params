# React Query Params
Easy to use query param support for React and React Router (4.0).

Plays super nice with React:

- Semantically similar to setState(). Set many query param values at once
- Supports get/set of arrays and objects
- Define default values for missing query params. Your app can start with a clean URL
- Cleans up the URL by hiding query params that match default values
- Does not add browser history by default. Opt in to creating browser history when setting values
- Supports reading a query param from an alternate props, such as nextProps within componentWillReceiveProps()

## Support
jeffbutsch@gmail.com

[Submit issue on github](https://github.com/jeff3dx/react-query-param-support/issues)


## Requirements
React Router 4.0.0+


## Installation
Install using yarn or npm:

	yarn add react-query-params 


## Setup
Extend your component class (ex. App.jsx)

	import { ReactQueryParams } from 'react-query-params';

	export default class App extends ReactQueryParams {
	  /* Your code */
	}

## Usage
### 1. Get a query param value

	const value = this.queryParams.food;

### 2. Set query param values
Semantically similar to React's setState():

	this.setQueryParams({ lunch: 'nutella' });

When you set query param values an update is triggered just like setState().

setQueryParams() does not have or need an asynchronous variation.

### Optional - Define defaultQueryParams

defaultQueryParams is for defining a default value for missing query params. If a query param is missing from the URL it's default value is used. Likewise if you set a query param to it's default value it will not appear in the URL, but the default value is available as normal. If you define defaults for all your query params your app can start with a clean URL containing no query params!

	import { ReactQueryParams } from 'react-query-params';

	export default class MyClass extends ReactQueryParams {
	    defaultQueryParams = {
	        lunch: 'bacon'
	    }
	}

## Important Tips
- If you put a value in a query param do not put it in state. The query param should own the value and be the source of truth for the value.
- Behind the scenes query params are actually props (props.location.search) and trigger updates just like when you change the value of a normal prop externally.

## Array and Object Values

### Set a query param to an array
You can set a query param value to an array or object. React-query-params does not use the repeating query param approach to representing arrays on the URL. Instead it stringifies arrays for URL storage. This saves characters and is easier to work with overall. Also provides consistent handling of hash map objects.

	const food = ['bacon', 'nutella'];
	this.setQueryParams({ lunch: food });
	const food2 = this.queryParams.lunch;

### Clear a query param array
To clear an array set the value to an empty array []. If you set it to null or empty string the query param will no longer by typed as an array. React-query-params detects stringified arrays and objects based on whether the string is enclosed with '[]' or '{}' characters.

	this.setQueryParams({ lunch: [] });

### defaultQueryParams value as array
The only time you have to convert an array or object to a JSON string yourself is when you set a defaultQueryParams value. Careful. If you use an array literal instead of a stringified array, your app will appear to be fine at first, but the value won't be save correctly to the URL.

Correct syntax - stringify the value yourself only when setting a default value.

	defaultQueryParams = {
		lunch: '["bacon","nutella"]'
	}




