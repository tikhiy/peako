'use strict';

var castPath = require( './cast-path' ),
    toObject = require( './to-object' ),
    isset    = require( './isset' ),
    baseHas  = require( './base/base-has' ),
    ERR      = require( './constants' ).ERR;

module.exports = function has ( obj, path ) {
  var l = ( path = castPath( path ) ).length;

  if ( ! l ) {
    throw Error( ERR.NO_PATH );
  }

  if ( l > 1 ) {
    return baseHas( toObject( obj ), path );
  }

  return isset( toObject( obj ), path[ 0 ] );
};
