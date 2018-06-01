# Peako

With Peako, you can work in JavaScript, like with [jQuery](https://jquery.com) **and** [Lodash](https://lodash.com).

Initially, Peako was aimed at speed and work in older browsers (IE8).

You can use some modern featurs in old browsers: `_.Promise`, `_.fetch()`... (Thanks to everyone who made these polyfills).

## Install

This is easy and only one way to do it:

```html
<!-- Import from GitHub CDN. -->
<script src="https://rawgit.com/silent-tempest/Peako/master/peako.js"></script>
<!-- Import local file. -->
<script src="peako.js"></script>
```

## Examples

##### Event Delegation

```
_( document ).on( 'click', 'button', function () {
  _( this ).toggleClass( 'active' );
} );
```

##### AJAX

POST:

```
_.ajax( '/add-task', {
  error: function () {
    alert( 'Something went wrong' );
  },

  data: {
    message: 'Buy a milk.'
  }
} );
```

GET:

```
_.ajax( '/get-task/0', {
  success: function ( data ) {
    _( '#tasks' ).append( '<li>' + data.message + '</li>' );
  }
} );
```

##### Chains

```
_( 'button.active' )
  .siblings( 'button' )
    .css( 'color', 'black' )
  .end()
  .css( 'color', 'red' );
```
