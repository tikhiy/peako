'use strict';

var isArrayLikeObject = require( './is-array-like-object' ),
    baseValues        = require( './base/base-values' ),
    keys              = require( './keys' );

module.exports = function iterable ( value ) {
  if ( isArrayLikeObject( value ) ) {
    return value;
  }

  if ( typeof value === 'string' ) {
    return value.split( '' );
  }

  return baseValues( value, keys( value ) );
};
