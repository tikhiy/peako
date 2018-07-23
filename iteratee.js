'use strict';

var isObjectLike = require( './is-object-like' ),
    baseMatches  = require( './base/base-matches' ),
    property     = require( './property' );

exports.iteratee = function iteratee ( v ) {
  if ( typeof v === 'function' ) {
    return v;
  }

  if ( isObjectLike( v ) ) {
    return baseMatches( v );
  }

  return property( v );
};
