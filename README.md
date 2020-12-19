# Sample API Note App
An app to demonstrate jsonbox and async programming.

## Install
To install, make sure you have node 12 or 14 series LTS (long-term support) and then run `npm install`.

## Using the App
Grab a new jsonbox id at https://jsonbox.io/ and place URL in constructor at line 10 of `app.js`. For example, if my URL was https://jsonbox.io/box_999999999, then I would write the following.

``` javascript
const store = new JsonBox('https://jsonbox.io/box_999999999', 'notes');
```
Note the second parameter. This is the collection name I would use to store my data under. I made up "notes" to hold my note data, but you can use anything you want.

After you have edited this line, run `npm run watch` to compile and watch for changes. Open up `index.html` with live server.