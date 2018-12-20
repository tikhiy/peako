'use strict';

var _ = require( '../placeholder' );

/**
 * Этот метод возращает один массив аргументов из частичных аргументов с placeholder`ами, и
 * аргументов которые были при вызове.
 * @private
 * @method _processArgs
 * @param  {Array.<any>} partialArgs Частичные аргументы с placeholder`ами ('peako/placeholder').
 * @param  {Array.<any>} args        Аргументы вызова какого-либо метода.
 * @return {Array.<any>}             Обработанные аргументы.
 * @example
 * var args = _processArgs( [ _, '!' ], [ 'John' ] );
 */
function _processArgs ( partialArgs, args ) {
  var result = [];
  var j = -1;
  // Skip function_ and thisArg.
  var i = 2;
  var length = partialArgs.length;

  for ( ; i < length; ++i ) {
    if ( partialArgs[ i ] === _ ) {
      result.push( args[ ++j ] );
    } else {
      result.push( partialArgs[ i ] );
    }
  }

  for ( length = args.length; j < length; ++j ) {
    result.push( args[ j ] );
  }

  return result;
}

module.exports = _processArgs;
