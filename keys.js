'use strict';

var baseKeys = require( './base/base-keys' );

var toObject = require( './to-object' );

var support = require( './support/support-keys' );

var keys;

if ( support !== 'es2015' ) {
  keys = function keys ( v ) {
    return baseKeys( toObject( v ) );
  };
} else {
  keys = Object.keys;
}

module.exports = keys;
