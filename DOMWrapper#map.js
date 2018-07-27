'use strict';

module.exports = function map ( fun ) {
  var els = this.stack(),
      len = this.length,
      el, i;

  els.length = this.length;

  for ( i = 0; i < len; ++i ) {
    els[ i ] = fun.call( el = this[ i ], i, el );
  }

  return els;
};
