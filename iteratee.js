'use strict';

var isKey    = require( './is-key' ),
    property = require( './property' ),
    ERR      = require( './constants' ).ERR;

module.exports = function iteratee ( value ) {
  if ( typeof value === 'function' ) {
    return value;
  }

  if ( isKey( value ) ) {
    return property( value );
  }

  throw TypeError( ERR.FUNCTION_EXPECTED );
};
