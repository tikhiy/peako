'use strict';

var _throwArgumentException = require( './_throw-argument-exception' );

module.exports = function words ( string ) {
  if ( typeof string !== 'string' ) {
    _throwArgumentException( string, 'a string' );
  }

  return string.match( /[^\s\uFEFF\xA0]+/g ) || [];
};
