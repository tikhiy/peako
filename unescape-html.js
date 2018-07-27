'use strict';

module.exports = require( './create/create-escape' )( /(?:&lt;|&gt;|&amp;)/g, {
  '&lt;':  '<',
  '&gt;':  '>',
  '&amp;': '&'
} );
