# peako

### Installation ([Node.js](https://nodejs.org/en/about/) / [Browserify](http://browserify.org/))

`$ npm i --save peako` or `$ npm i -D peako`

```javascript
var _ = require( 'peako/_' );

_( document ).on( 'click', 'a', function ( event ) {
  event.preventDefault();
} );
```

### Installation (Browser / Workers)

```html
<script src="https://rawgit.com/silent-tempest/dist/dev/dist/peako.min.js"></script>
```

```javascript
_( self ).scroll( function ( event ) {
  console.log( 'beep boop', peako.type( event.original ) );
} );
```
