'use strict';

var toPath       = require( './to-path' ),
    baseAccessor = require( './base/base-accessor' ),
    noop         = require( './noop' );

module.exports = function property ( path ) {
  var len = ( path = toPath( path ) ).length;

  if ( len > 1 ) {
    return function ( object ) {
      if ( object != null ) {
        return baseAccessor( object, path, 0 );
      }
    };
  }

  if ( len ) {
    return function ( object ) {
      if ( object != null ) {
        return object[ path ];
      }
    };
  }

  return noop;
};
