'use strict';

var _processArgs = require( './internal/process-args' );

var _            = require( './placeholder' );
// constants.PLACEHOLDER is for backward-compability.
var constants    = require( './constants' );

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

  var args = arguments;
  var argsLen = args.length;

  // If no partialArgs were provided make a tiny optimization using built-in
  // `Function.bind`.
  if ( argsLen <= 2 ) {
    return Function.prototype.bind.call( function_, thisArg );
  }

  // Skip function_ and thisArg.
  var i = 2;

  // Search for placeholders in the arguments.
  for ( ; i < argsLen; ++i ) {
    if ( args[ i ] === _ || args[ i ] === constants.PLACEHOLDER ) {
      break;
    }
  }

  // If no placeholders in the partialArgs were provided make a tiny
  // optimization using built-in `Function.bind`.
  if ( i === argsLen ) {
    return Function.prototype.call.apply( Function.prototype.bind, args );
  }

  return function bound () {
    // Call a function with new this (thisArg) and processed arguments.
    return function_.apply( thisArg, _processArgs( args, arguments ) );
  };
}

module.exports = bind;
