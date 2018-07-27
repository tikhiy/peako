'use strict';

var isset = require( '../isset' );

module.exports = function baseCloneArray ( iterable ) {

  var i = iterable.length;

  var clone = Array( i-- );

  for ( ; i >= 0; --i ) {
    if ( isset( i, iterable ) ) {
      clone[ i ] = iterable[ i ];
    }
  }

  return clone;

};
