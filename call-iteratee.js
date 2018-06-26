'use strict';

module.exports = function callIteratee ( fun, ctx, val, key, obj ) {
  if ( ctx === undefined ) {
    return fun( val, key, obj );
  }

  return fun.call( ctx, val, key, obj );
};
