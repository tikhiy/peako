'use strict';

module.exports = function each ( fun ) {
  var len = this.length,
      i = 0;

  for ( ; i < len; ++i ) {
    if ( fun.call( this[ i ], i, this[ i ] ) === false ) {
      break;
    }
  }

  return this;
};
