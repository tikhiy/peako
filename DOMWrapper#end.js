'use strict';

var DOMWrapper = require( './DOMWrapper' );

module.exports = function end () {
  return this._previous || new DOMWrapper();
};
