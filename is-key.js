'use strict';

var isArray  = require( './is-array' ),
    rDeepKey = require( './regexps' ).deepKey;

module.exports = function isKey ( value ) {
  var type;

  if ( ! value ) {
    return true;
  }

  if ( isArray( value ) ) {
    return false;
  }

  type = typeof value;

  if ( type === 'number' || type === 'symbol' || type === 'boolean' ) {
    return true;
  }

  return ! rDeepKey.test( value );
};
