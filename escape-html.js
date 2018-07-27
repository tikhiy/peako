'use strict';

module.exports = require( './create/create-escape' )( /[<&]/g, {
  '<': '&lt;',
  '&': '&amp;'
} );
