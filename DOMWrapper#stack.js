'use strict';

var baseCopyArray = require( './base/base-copy-array' ),
    DOMWrapper    = require( './DOMWrapper' ),
    _first        = require( './_first' );

module.exports = function stack ( elements ) {
  var wrapper = new DOMWrapper();

  if ( elements ) {
    if ( elements.length ) {
      baseCopyArray( wrapper, elements ).length = elements.length;
    } else {
      _first( wrapper, elements );
    }
  }

  wrapper._previous = wrapper.prevObject = this;

  return wrapper;
};
