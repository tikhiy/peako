'use strict';

var DOMWrapper = require( './DOMWrapper' );

function _ ( selector, context ) {
  return new DOMWrapper( selector, context );
}

_.prototype = DOMWrapper.prototype;
_.prototype.constructor = _;

module.exports = _;
