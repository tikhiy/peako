'use strict';

var isKey     = require( './is-key' ),
    toKey     = require( './to-key' ),
    isArray   = require( './is-array' ),
    unescape  = require( './unescape' ),
    baseExec  = require( './base/base-exec' ),
    rProperty = require( './regexps' ).property;

function stringToPath ( string ) {
  var path = baseExec( rProperty, string ),
      i = path.length - 1,
      value;

  for ( ; i >= 0; --i ) {
    value = path[ i ];

    // .name
    if ( value[ 2 ] ) {
      path[ i ] = value[ 2 ];
    // [ "" ] || [ '' ]
    } else if ( value[ 5 ] != null ) {
      path[ i ] = unescape( value[ 5 ] );
    // [ 0 ]
    } else {
      path[ i ] = value[ 3 ];
    }
  }

  return path;
}

module.exports = function toPath ( value ) {
  var parsed, len, i;

  if ( isKey( value ) ) {
    return [
      toKey( value )
    ];
  }

  if ( isArray( value ) ) {
    parsed = Array( len = value.length );

    for ( i = len - 1; i >= 0; --i ) {
      parsed[ i ] = toKey( value[ i ] );
    }
  } else {
    parsed = stringToPath( '' + value );
  }

  return parsed;
};
