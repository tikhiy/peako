'use strict';

var bindFast         = require( './bind-fast' ),
    createStringTrim = require( './create/create-string-trim' );

if ( String.prototype.trim ) {
  trim = bindFast( Function.prototype.call, String.prototype.trim );
} else {
  trim = createStringTrim( /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/ );
}

module.exports = trim;
