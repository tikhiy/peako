'use strict';

var escapeHTML = require( './escape-html' );

var regexps = require( './template-regexps' );

function replacer ( match, safe, html, comm, code ) {
  if ( safe != null ) {
    return "'+(" + escapeHTML( safe.replace( /\\n/g, '\n' ) ) + ")+'";
  }

  if ( html != null ) {
    return "'+(" + html.replace( /\\n/g, '\n' ) + ")+'";
  }

  if ( code != null ) {
    return "';" + code.replace( /\\n/g, '\n' ) + ";_r+='";
  }

  // comment is matched - do nothing

  return '';
}

/**
 * @param {string} source The template source.
 */

// var template = peako.template( '<title><%- data.username %></title>' );

// var html = template.render( {
//   username: 'John'
// } );

module.exports = function template ( source ) {

  var regexp = RegExp( regexps.safe +
    '|' + regexps.html +
    '|' + regexps.comm +
    '|' + regexps.code, 'g' );

  var result = '';

  result += "function print(){_r+=Array.prototype.join.call(arguments,'');}";

  result += "var _r='";

  result += source
    .replace( /\n/g, '\\n' )
    .replace( regexp, replacer );

  result += "';return _r;";

  return {
    render: Function( 'data', result ), // jshint ignore: line
    source: source
  };

};
