'use strict';

var ERR = require( './constants' ).ERR;

module.exports = function bindFast ( target, context ) {
  if ( typeof target !== 'function' ) {
    throw TypeError( ERR.FUNCTION_EXPECTED );
  }

  return function ( a, b, c, d, e, f, g, h ) {
    switch ( arguments.length ) {
      case 0:
        return target.call( context );
      case 1:
        return target.call( context, a );
      case 2:
        return target.call( context, a, b );
      case 3:
        return target.call( context, a, b, c );
      case 4:
        return target.call( context, a, b, c, d );
      case 5:
        return target.call( context, a, b, c, d, e );
      case 6:
        return target.call( context, a, b, c, d, e, f );
      case 7:
        return target.call( context, a, b, c, d, e, f, g );
      case 8:
        return target.call( context, a, b, c, d, e, f, g, h );
    }

    return target.apply( context, arguments );
  };
};
