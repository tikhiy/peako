'use strict';

var callIteratee = require( '../call-iteratee' );

module.exports = function baseForIn ( object, iteratee, context, keys, fromRight ) {
  var i = -1,
      j = keys.length - 1,
      key;

  for ( ; j >= 0; --j ) {
    if ( fromRight ) {
      key = keys[ j ];
    } else {
      key = keys[ ++i ];
    }

    if ( callIteratee( iteratee, context, object[ key ], key, object ) === false ) {
      break;
    }
  }

  return object;
};
