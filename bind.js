'use strict';

var _processArgs = require( './internal/process-args' );

var placeholder  = require( './placeholder' );
// constants.PLACEHOLDER is for backward-compability.
var constants    = require( './constants' );
var indexOf      = require( './index-of' );

/**
 * Эта расширенная версия стандартного ES5 `Function.bind`, в которой есть поддержка placeholder`ов.
 * @method _.bind
 * @param  {Function} function_   Метод, который надо привязать к контексту (новый this).
 * @param  {any}      thisArg     Контекст (новый this для метода).
 * @param  {...any}   partialArgs Частичные аргументы с {@link _.placeholder}.
 * @return {Function}             Новый, привязанный к новому this метод.
 * @example
 * var bound = _.bind( function_, newThis, _._, '!' );
 */
function bind ( function_, thisArg ) {
  if ( typeof function_ !== 'function' ) {
    throw TypeError( 'in _.bind(), provided "function_" is not a function (' + typeof function_ + ')' );
  }

  // If no partialArgs were provided make a tiny optimization using built-in
  // `Function.bind`.
  if ( arguments.length <= 2 ) {
    return Function.prototype.bind.call( function_, thisArg );
  }

  var partialArgs = Array.prototype.slice.call( arguments, 2 );

  // If no placeholders in the partialArgs were provided make a tiny
  // optimization using built-in `Function.bind`.
  if ( indexOf( partialArgs, placeholder ) < 0 && indexOf( partialArgs, constants.PLACEHOLDER ) < 0 ) {
    return Function.prototype.call.apply( Function.prototype.bind, arguments );
  }

  return function bound () {
    // Call a function with new this (thisArg) and processed arguments.
    return function_.apply( thisArg, _processArgs( partialArgs, arguments ) );
  };
}

module.exports = bind;
