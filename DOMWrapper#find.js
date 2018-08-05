'use strict';

var DOMWrapper = require( './DOMWrapper' );

module.exports = function find ( selector ) {
  return new DOMWrapper( selector, this );
};
