'use strict';

var castPath = require( './cast-path' ),
    toObject = require( './to-object' ),
    baseGet  = require( './base/base-get' ),
    ERR      = require( './constants' ).ERR;

module.exports = function get ( obj, path ) {
  var l = ( path = castPath( path ) ).length;

  if ( ! l ) {
    throw Error( ERR.NO_PATH );
  }

  if ( l > 1 ) {
    return baseGet( toObject( obj ), path, 0 );
  }

  return toObject( obj )[ path[ 0 ] ];
};
