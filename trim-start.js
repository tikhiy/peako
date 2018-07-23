'use strict';

if ( String.prototype.trimStart ) {
  module.exports = require( './bind' )( Function.prototype.call, String.prototype.trimStart );
} else {
  module.exports = require( './create/create-trim' )( /^[\s\uFEFF\xA0]+/ );
}
