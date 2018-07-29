'use strict';

var optional = require;

if ( typeof qs === 'undefined' ) {
  var qs;

  try {
    qs = optional( 'qs' );
  } catch ( e ) {}
}

module.exports = qs;
