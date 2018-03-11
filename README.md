# Peako

With Peako, you can work in JavaScript, like with [jQuery](https://jquery.com) **and** [Lodash](https://lodash.com).

Initially, Peako was aimed at speed and work in older browsers (IE8...) (Something really works).

You can use some modern featurs in old browsers: `_.Promise`, `_.fetch()`... (Thanks to everyone who maked these polyfills).

## Install

This is easy and only one (not only) way to do it:

```html
<!-- Import from GitHub CDN. -->
<script src="https://rawgit.com/silent-tempest/Peako/master/peako.js"></script>
<!-- Import local file. -->
<script src="peako.js"></script>
```

## Example

```javascript
// shortcut for _( document ).ready( fn )
_( function ( _ ) {
  _( 'button' ).click( function ( event ) {
    // event.timeStamp is a DOMHighResTimeStamp always
    if ( event.timeStamp > 5000 ) {
      console.log( 'More than 5 seconds has been passed before you clicked this button.' );
    }

    _( this )
      .siblings( 'button' )
        .css( 'color', 'initial' )
      .end()
      .css( 'color', 'red' );
  } );

  _( window ).scroll( function () {
    // for some optimization
    var hidden = _( '#go-up' ).css( 'display' ) === 'none';

    if ( _( this ).scrollTop() > _( this ).height() ) {
      if ( hidden ) {
        _( '#go-up' ).show();
      }
    } else if ( !hidden ) {
      _( '#go-up' ).hide();
    }
  } );
} );
```
