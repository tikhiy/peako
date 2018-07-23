'use strict';

if ( Array.prototype.find ) {
  module.exports = require( './bind' )( Function.prototype.call, Array.prototype.find );
} else {
  module.exports = require( './create/create-find' )();
}
