'use strict';

var regexps = require( './template-regexps' );
var escape  = require( './escape' );

function replacer ( match, safe, html, comm, code ) {
  if ( safe !== null && typeof safe !== 'undefined' ) {
    return "'+_e(" + safe.replace( /\\n/g, '\n' ) + ")+'";
  }

  if ( html !== null && typeof html !== 'undefined' ) {
    return "'+(" + html.replace( /\\n/g, '\n' ) + ")+'";
  }

  if ( code !== null && typeof code !== 'undefined' ) {
    return "';" + code.replace( /\\n/g, '\n' ) + ";_r+='";
  }

  // comment is matched - do nothing
  return '';
}

/**
 * @memberof peako
 * @param {string} source The template source.
 * @example
 * var template = peako.template('<title><%- data.username %></title>');
 * var html = template.render({ username: 'John' });
 * // -> '<title>John</title>'
 */
function template ( source ) {
  var regexp = RegExp( regexps.safe +
    '|' + regexps.html +
    '|' + regexps.comm +
    '|' + regexps.code, 'g' );
  var result = '';
  var _render;

  result += "function print(){_r+=Array.prototype.join.call(arguments,'');}";

  result += "var _r='";

  result += source
    .replace( /\n/g, '\\n' )
    .replace( regexp, replacer );

  result += "';return _r;";

  _render = Function( 'data', '_e', result ); // jshint ignore: line

  return {
    render: function render ( data ) {
      return _render.call( this, data, escape );
    },

    result: result,
    source: source
  };
}

module.exports = template;
