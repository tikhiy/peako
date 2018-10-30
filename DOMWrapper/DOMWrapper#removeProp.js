'use strict';

module.exports = require( '../create/create-remove-prop' )( function _removeProp ( element, key ) {
  delete element[ key ];
} );
