/**
 * Based on Erik Möller requestAnimationFrame polyfill:
 *
 * Adapted from https://gist.github.com/paulirish/1579671 which derived from
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 * http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 *
 * requestAnimationFrame polyfill by Erik Möller.
 * Fixes from Paul Irish, Tino Zijdel, Andrew Mao, Klemen Slavič, Darius Bacon.
 *
 * MIT license
 */

'use strict';

var timestamp = require( './timestamp' );

var requestAF;
var cancelAF;

if ( typeof self !== 'undefined' ) {
  cancelAF = self.cancelAnimationFrame ||
    self.webkitCancelAnimationFrame ||
    self.webkitCancelRequestAnimationFrame ||
    self.mozCancelAnimationFrame ||
    self.mozCancelRequestAnimationFrame;
  requestAF = self.requestAnimationFrame ||
    self.webkitRequestAnimationFrame ||
    self.mozRequestAnimationFrame;
}

var noRequestAnimationFrame = ! requestAF || ! cancelAF ||
  typeof navigator !== 'undefined' && /iP(ad|hone|od).*OS\s6/.test( navigator.userAgent );

if ( noRequestAnimationFrame ) {
  var lastRequestTime = 0;
  var frameDuration   = 1000 / 60;

  exports.request = function request ( animate ) {
    var now             = timestamp();
    var nextRequestTime = Math.max( lastRequestTime + frameDuration, now );

    return setTimeout( function () {
      lastRequestTime = nextRequestTime;
      animate( now );
    }, nextRequestTime - now );
  };

  exports.cancel = clearTimeout;
} else {
  exports.request = function request ( animate ) {
    return requestAF( animate );
  };

  exports.cancel = function cancel ( id ) {
    return cancelAF( id );
  };
}
