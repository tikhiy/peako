'use strict';

module.exports = function baseAssign ( obj, src, k ) {
  var i, l;

  for ( i = 0, l = k.length; i < l; ++i ) {
    obj[ k[ i ] ] = src[ k[ i ] ];
  }
};
