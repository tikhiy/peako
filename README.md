# peako

### The Usage

Node.js/CommonJS:

```javascript
var peako = require( 'peako' );
console.log( peako.type( [] ) ); // -> "array"
```

Or

```javascript
var type = require( 'peako/type' );
console.log( type( [] ) ); // -> "array"
```

Browser:

```html
<script src="https://rawgit.com/silent-tempest/dist/dev/build/peako.min.js"></script>
```

```javascript
console.log( peako.type( [] ) ); // -> "array"
```

### Build

`$ make`
