'use strict';

module.exports = function fromPairs ( pairs ) {
  var object = {};

  var i, l;

  for ( i = 0, l = pairs.length; i < l; ++i ) {
    object[ pairs[ i ][ 0 ] ] = pairs[ i ][ 1 ];
  }

  return object;
};
