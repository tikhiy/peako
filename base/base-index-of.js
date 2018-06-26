'use strict';

var baseToIndex = require( './base-to-index' );

var arr = [];

function baseIndexOf ( iterable, search, fromIndex, fromRight ) {
  var length, i, j, index, value;

  // use the native functions if supported and the search is not nan.
  if ( arr.indexOf && search === search ) {
    if ( ! fromRight ) {
      return arr.indexOf.call( iterable, search, fromIndex );
    }

    if ( arr.lastIndexOf ) {
      return arr.lastIndexOf.call( iterable, search, fromIndex );
    }
  }

  length = iterable.length;

  // if the iterable is empty then just return -1.
  if ( ! length ) {
    return -1;
  }

  j = length - 1;

  if ( fromIndex !== undefined ) {
    fromIndex = baseToIndex( fromIndex, length );

    if ( fromRight ) {
      j = Math.min( j, fromIndex );
    } else {
      j = Math.max( 0, fromIndex );
    }

    i = j - 1;
  } else {
    i = -1;
  }

  for ( ; j >= 0; --j ) {
    if ( fromRight ) {
      index = j;
    } else {
      index = ++i;
    }

    value = iterable[ index ];

    if ( value === search || value !== value && search !== search ) {
      return index;
    }
  }

  return -1;
}

module.exports = baseIndexOf;
