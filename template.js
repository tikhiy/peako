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
 * @method peako.template
 * @param  {string} source            The template source.
 * @param  {object} [options]         An options.
 * @param  {object} [options.regexps] Custom patterns.
 *                                    See {@link peako.templateRegexps}.
 * @return {object}                   An object with `render` method.
 * @example
 * var template = peako.template('<title><%- data.username %></title>');
 * var html = template.render({ username: 'John' });
 * // -> '<title>John</title>'
 */
function template ( source, options ) {
  var result = '';
  var regexp;
  var render_;

  if ( ! options ) {
    options = {};
  }

  if ( ! options.regexps ) {
    options.regexps = regexps;
  }

  regexp = RegExp(
    ( options.regexps.safe || regexps.safe ) + '|' +
    ( options.regexps.html || regexps.html ) + '|' +
    ( options.regexps.comm || regexps.comm ) + '|' +
    ( options.regexps.code || regexps.code ), 'g' );

  result += "function print(){_r+=Array.prototype.join.call(arguments,'');}";

  result += "var _r='";

  result += source
    .replace( /\n/g, '\\n' )
    .replace( regexp, replacer );

  result += "';return _r;";

  render_ = Function( 'data', '_e', result );

  return {
    render: function render ( data ) {
      return render_.call( this, data, escape );
    },

    result: result,
    source: source
  };
}

module.exports = template;
