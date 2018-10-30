'use strict';

/**
 * @private
 * @method memoize
 * @param  {function} function_
 * @return {function}
 */
module.exports = function ( function_ ) {
  var called = false;
  var lastResult;
  var lastValue;

  return function ( value ) {
    switch ( false ) {
      case called:
        called = true;
        // falls through
      case value === lastValue:
        return ( lastResult = function_( ( lastValue = value ) ) );
    }

    return lastResult;
  };
};
