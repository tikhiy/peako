'use strict';

var toObject = require( './to-object' ),
    getKeys = require( './keys' ),
    isPlainObject = require( './is-plain-object' ),
    isArray = require( './is-array' );

function mixin ( deep, target ) {
  var length = arguments.length,
      i, keys, exp, j, k, val, key, nowArray, src;

  // example: mixin( {}, {} )
  if ( typeof deep !== 'boolean' ) {
    target = deep;
    deep = true;
    i = 1;
  // example: mixin( false, {}, {} )
  // NOTE: use assign( {}, {} ) function instead.
  } else {
    i = 2;
  }

  // example:
  // var extendable = {
  //   extend: require( 'peako/mixin' )
  // };

  // extendable.extend( { name: 'Extendable Object' } );
  if ( i === length ) {
    target = this;
    --i;
  }

  target = toObject( target );

  // loop through all expanders.
  for ( ; i < length; ++i ) {
    keys = getKeys( exp = toObject( arguments[ i ] ) );

    // loop through all expander's properties.
    for ( j = 0, k = keys.length; j < k; ++j ) {
      val = exp[ key = keys[ j ] ];

      // fall into recursion
      if ( deep && val !== exp && ( isPlainObject( val ) || ( nowArray = isArray( val ) ) ) ) {
        src = target[ key ];

        if ( nowArray ) {
          // don't replace the source if it's already an array.
          if ( !isArray( src ) ) {
            src = [];
          }

          nowArray = false;
        // don't replace the source if it's already an abject.
        } else if ( !isPlainObject( src ) ) {
          src = {};
        }

        // extend the source (recursion).
        target[ key ] = mixin( deep, src, val );
      // just assign the value
      } else {
        target[ key ] = val;
      }
    }
  }

  return target;
}

module.exports = mixin;
