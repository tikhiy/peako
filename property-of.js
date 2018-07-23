'use strict';

var castPath = require( './cast-path' ),
    get      = require( './base/base-get' ),
    ERR      = require( './constants' ).ERR;

module.exports = function propertyOf ( obj ) {
  if ( obj == null ) {
    throw TypeError( ERR.UNDEFINED_OR_NULL );
  }

  return function ( path ) {
    var l = ( path = castPath( path ) ).length;

    if ( ! l ) {
      throw Error( ERR.NO_PATH );
    }

    if ( l > 1 ) {
      return get( obj, path, 0 );
    }

    return obj[ path[ 0 ] ];
  };
};
