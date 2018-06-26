'use strict';

var has          = require( '../has' ),
    callIteratee = require( '../call-iteratee' );

module.exports = function baseForEach ( arr, fun, ctx, fromRight ) {
  var i = -1,
      j = arr.length - 1,
      index;

  for ( ; j >= 0; --j ) {
    if ( fromRight ) {
      index = j;
    } else {
      index = ++i;
    }

    if ( has( index, arr ) && callIteratee( fun, ctx, arr[ index ], index, arr ) === false ) {
      break;
    }
  }

  return arr;
};
