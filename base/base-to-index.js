'use strict';

/**
 * @private
 * @method baseToIndex
 * @param  {number} index
 * @param  {number} length
 * @return {number}
 */
module.exports = function baseToIndex ( index, length ) {
  if ( ! length || ! index ) {
    return 0;
  }

  if ( index < 0 ) {
    index += length;
  }

  return index || 0;
};
