'use strict';

var baseForEach = require( '../base/base-for-each' ),
    toObject    = require( '../to-object' ),
    iteratee    = require( '../iteratee' ).iteratee,
    iterable    = require( '../iterable' );

module.exports = function createForEach ( fromRight ) {
  return function forEach ( arr, fn, ctx ) {
    return baseForEach( iterable( toObject( arr ) ), iteratee( fn ), ctx, fromRight );
  };
};
