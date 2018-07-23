'use strict';

if ( Object.assign ) {
  module.exports = Object.assign;
} else {
  module.exports = require( './create/create-assign' )( require( './keys' ) );
}
