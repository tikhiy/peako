'use strict';

var DOMWrapper = require( './DOMWrapper' );

module.exports = function _ ( selector ) {
  return new DOMWrapper( selector );
};
