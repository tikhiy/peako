'use strict';

var baseIsMatch = require( './base-is-match' );

module.exports = function baseMatches ( src ) {
  return function matches ( obj ) {
    if ( obj == null ) {
      return false;
    }

    return obj === src || baseIsMatch( src, obj );
  };
};
