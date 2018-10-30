'use strict';

var baseIndexOf = require( '../base/base-index-of' );
var toObject    = require( '../to-object' );

module.exports = function createIndexOf ( fromRight ) {
  return function indexOf ( arr, search, fromIndex ) {
    return baseIndexOf( toObject( arr ), search, fromIndex, fromRight );
  };
};
