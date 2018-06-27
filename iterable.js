'use strict';

var isArrayLikeObject = require( './is-array-like-object' ),
    baseValues        = require( './base/base-values' ),
    getKeys           = require( './keys' );

module.exports = function iterable ( value ) {
  if ( isArrayLikeObject( value ) ) {
    return value;
  }

  if ( typeof value === 'string' ) {
    return value.split( '' );
  }

  return baseValues( value, getKeys( value ) );
};
