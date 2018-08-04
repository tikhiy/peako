'use strict';

var ERR = require( './constants' ).ERR;

module.exports = function words ( string ) {
  if ( typeof string !== 'string' ) {
    throw TypeError( ERR.STRING_EXPECTED );
  }

  return string.match( /[^\s\uFEFF\xA0]+/g ) || [];
};
