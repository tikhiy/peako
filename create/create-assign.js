'use strict';

var baseAssign = require( '../base/base-assign' ),
    ERR        = require( '../constants').ERR;

module.exports = function createAssign ( keys ) {
  return function assign ( obj ) {
    var l, i, src;

    if ( obj == null ) {
      throw TypeError( ERR.UNDEFINED_OR_NULL );
    }

    for ( i = 1, l = arguments.length; i < l; ++i ) {
      if ( ( src = arguments[ i ] ) != null ) {
        baseAssign( obj, src, keys( src ) );
      }
    }

    return obj;
  };
};
