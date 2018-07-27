'use strict';

var ERR = require( '../constants' ).ERR;

module.exports = function createEscape ( regexp, map ) {
  function replacer ( c ) {
    return map[ c ];
  }

  return function escape ( string ) {
    if ( string == null ) {
      throw TypeError( ERR.UNDEFINED_OR_NULL );
    }

    return ( string += '' ).replace( regexp, replacer );
  };
};
