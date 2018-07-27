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
<script src="https://rawgit.com/silent-tempest/peako/dev/build/peako.js"></script>
<!-- optional dependency for ajax function -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/qs/6.5.2/qs.min.js"></script>
```

```javascript
console.log( peako.type( [] ) ); // -> "array"
```

### Build

`$ make`
