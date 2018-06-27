'use strict';

var getIterable  = require( '../iterable' ),
    wrapIteratee = require( '../iteratee' ),
    toObject     = require( '../to-object' ),
    baseForEach  = require( '../base/base-for-each' );

module.exports = function createForEach ( fromRight ) {
  return function ( iterable, iteratee, context ) {
    return baseForEach( getIterable( toObject( iterable ) ), wrapIteratee( iteratee ), context, fromRight );
  };
};
