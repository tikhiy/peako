'use strict';

var baseValues        = require( './base/base-values' );

var isArrayLikeObject = require( './is-array-like-object' );
var keys              = require( './keys' );

module.exports = function iterable ( value ) {
  if ( isArrayLikeObject( value ) ) {
    return value;
  }

  if ( typeof value === 'string' ) {
    return value.split( '' );
  }

  return baseValues( value, keys( value ) );
};
