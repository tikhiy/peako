'use strict';

/**
 * @method peako.clamp
 * @param  {number} value A number to be clamped.
 * @param  {number} lower Lower bound of the clamp.
 * @param  {number} upper Upper bound of the clamp.
 * @return {number}
 */
module.exports = function clamp ( value, lower, upper ) {
  if ( value >= upper ) {
    return upper;
  }

  if ( value <= lower ) {
    return lower;
  }

  return value;
};
