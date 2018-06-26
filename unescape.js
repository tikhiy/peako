'use strict';

module.exports = function unescape ( string ) {
  return string.replace( /\\(\\)?/g, '$1' );
};
