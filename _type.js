'use strict';

var type = require( './type' );

var lastRes = 'undefined',
    lastVal;

module.exports = function _type ( val ) {
  if ( val === lastVal ) {
    return lastRes;
  }

  return ( lastRes = type( lastVal = val ) );
};
