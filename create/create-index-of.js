'use strict';

var baseIndexOf = require( '../base/base-index-of' ),
    toObject = require( '../to-object' );

module.exports = function createIndexOf ( fromRight ) {
  return function ( iterable, search, fromIndex ) {
    return baseIndexOf( toObject( iterable ), search, fromIndex, fromRight );
  };
};
