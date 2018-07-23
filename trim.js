'use strict';

if ( String.prototype.trim ) {
  module.exports = require( './bind' )( Function.prototype.call, String.prototype.trim );
} else {
  module.exports = require( './create/create-trim' )( /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/ );
}
