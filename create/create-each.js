'use strict';

var toObject     = require( '../to-object' ),
    isArrayLike  = require( '../is-array-like' ),
    baseForEach  = require( '../base/base-for-each' ),
    baseForIn    = require( '../base/base-for-in' ),
    getKeys      = require( '../keys' ),
    wrapIteratee = require( '../iteratee' );

module.exports = function createEach ( fromRight ) {
  return function ( iterable, iteratee, context ) {
    iterable = toObject( iterable );
    iteratee = wrapIteratee( iteratee );

    if ( isArrayLike( iterable ) ) {
      return baseForEach( iterable, iteratee, context, fromRight );
    }

    return baseForIn( iterable, iteratee, context, getKeys( iterable ), fromRight );
  };
};
