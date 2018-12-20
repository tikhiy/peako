'use strict';

var support  = require( './support/support-keys' );

var toObject = require( './to-object' );

if ( support !== 'es2015' ) {
  module.exports = function keys ( value ) {
    return Object.keys( toObject( value ) );
  };
} else {
  module.exports = Object.keys;
}
