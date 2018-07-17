'use strict';

var ERR = require( '../constants' ).ERR;

module.exports = function createStringTrim ( regexp ) {
  return function ( string ) {
    if ( string == null ) {
      throw TypeError( ERR.UNDEFINED_OR_NULL );
    }

    return ( '' + string ).replace( regexp, '' );
  };
};
