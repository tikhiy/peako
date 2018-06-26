'use strict';

module.exports = function baseToIndex ( value, length ) {
  if ( ! length || ! value ) {
    return 0;
  }

  if ( value < 0 ) {
    value += length;
  }

  return value || 0;
};
