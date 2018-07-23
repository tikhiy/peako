'use strict';

if ( Array.prototype.findIndex ) {
  module.exports = require( './bind' )( Function.prototype.call, Array.prototype.findIndex );
} else {
  module.exports = require( './create/create-find' )( true );
}
