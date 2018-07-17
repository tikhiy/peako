'use strict';

var ERR       = require( './constants' ).ERR,
    defaultTo = require( './default-to' ),
    apply     = require( './apply' );

module.exports = function before ( n, target ) {
  var value;

  if ( typeof target !== 'function' ) {
    throw TypeError( ERR.FUNCTION_EXPECTED );
  }

  n = defaultTo( n, 1 );

  return function () {
    if ( --n >= 0 ) {
      value = apply( target, this, arguments );
    }

    return value;
  };
};
