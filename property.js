'use strict';

var castPath = require( './cast-path' ),
    noop     = require( './noop' ),
    get      = require( './base/base-get' );

module.exports = function property ( path ) {
  var l = ( path = castPath( path ) ).length;

  if ( ! l ) {
    return noop;
  }

  if ( l > 1 ) {
    return function ( obj ) {
      if ( obj != null ) {
        return get( obj, path, 0 );
      }
    };
  }

  path = path[ 0 ];

  return function ( obj ) {
    if ( obj != null ) {
      return obj[ path ];
    }
  };
};
