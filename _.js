'use strict';

var DOMWrapper = require( './DOMWrapper' );

function _ ( selector ) {
  return new DOMWrapper( selector );
}

_.prototype = DOMWrapper.prototype;
_.prototype.constructor = _;

module.exports = _;
