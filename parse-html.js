'use strict';

var baseCloneArray = require( './base/base-clone-array' );

var fragment       = require( './fragment' );

/**
 * @method _.parseHTML
 * @param  {string}          string
 * @param  {object}          context
 * @return {Array.<Element>}
 * @example
 * var elements = _.parseHTML( '<input type="submit" value="submit" />' );
 */
module.exports = function parseHTML ( string, context ) {
  if ( /^(?:<([\w-]+)><\/[\w-]+>|<([\w-]+)(?:\s*\/)?>)$/.test( string ) ) {
    return [ document.createElement( RegExp.$1 || RegExp.$2 ) ];
  }

  return baseCloneArray( fragment( [ string ], context || document ).childNodes );
};
