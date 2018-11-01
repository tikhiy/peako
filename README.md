# peako

[![Size](http://img.badgesize.io/tikhiy/peako/next/dist/peako.min.js.gz.svg?&label=lightweight)](https://github.com/ngryman/badge-size)

### Installation

```bash
npm install --save github:tikhiy/peako#1.2.0
```

##### Example

```javascript
var _ = require( 'peako/_' );

_( document ).on( 'click', 'a', function ( event ) {
  event.preventDefault();
} );
```

### Installation

```html
<script src="peako.min.js"></script>
```

##### Example

```javascript
var listener = _.debounce( 50, function ( event ) {
  console.log( 'onscroll called!' );
} );

_( self ).scroll( listener );
```

### Development

##### Linting

* `make lint`

##### Testing

* `make test`

##### Before Committing

* `npm run prepublish`

### License

Released under the [MIT](LICENSE) license.
