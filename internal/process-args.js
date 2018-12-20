'use strict';

var placeholder = require( '../placeholder' );
// constants.PLACEHOLDER is for backward-compability.
var constants   = require( '../constants' );

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
  var i;
  var length;

  for ( i = 0, length = partialArgs.length; i < length; ++i ) {
    if ( partialArgs[ i ] === placeholder || partialArgs[ i ] === constants.PLACEHOLDER ) {
      result.push( args[ ++j ] );
    } else {
      result.push( partialArgs[ i ] );
    }
  }

  for ( length = args.length; j < length; ++j ) {
    result.push( args[ i ] );
  }

  return result;
}

module.exports = _processArgs;
