'use strict';

if ( String.prototype.trimEnd ) {
  module.exports = require( './bind' )( Function.prototype.call, String.prototype.trimEnd );
} else {
  module.exports = require( './create/create-trim' )( /[\s\uFEFF\xA0]+$/ );
}
