'use strict';

var baseCloneArray = require( './base/base-clone-array' ),
    fragment       = require( './fragment' );

module.exports = function parseHTML ( data, ctx ) {
  var match = /^(?:<([\w-]+)><\/[\w-]+>|<([\w-]+)(?:\s*\/)?>)$/.exec( data );

  if ( match ) {
    return [ document.createElement( match[ 1 ] || match[ 2 ] ) ];
  }

  return baseCloneArray( fragment( [ data ], ctx || document ).childNodes );
};
