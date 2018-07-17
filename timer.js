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

var request = window[ 'requestAnimationFrame' ] ||
  window[ 'webkitRequestAnimationFrame' ] ||
  window[ 'mozRequestAnimationFrame' ];

var cancel = window[ 'cancelAnimationFrame' ] ||
  window[ 'webkitCancelAnimationFrame' ] ||
  window[ 'webkitCancelRequestAnimationFrame' ] ||
  window[ 'mozCancelAnimationFrame' ] ||
  window[ 'mozCancelRequestAnimationFrame' ];

var usePolyfill = ! request || ! cancel ||
  typeof navigator !== 'undefined' &&
  /iP(ad|hone|od).*OS\s6/.test( navigator.userAgent );

var timer = {};

if ( usePolyfill ) {
  var lastRequestTime = 0,
      frameDuration   = 1000 / 60;

  timer.request = function request ( frame ) {
    var now             = timestamp(),
        nextRequestTime = Math.max( lastRequestTime + frameDuration, now );

    return setTimeout( function () {
      lastRequestTime = nextRequestTime;
      frame( now );
    }, nextRequestTime - now );
  };

  timer.cancel = clearTimeout;
} else {
  timer.request = function request ( frame ) {
    return request( frame );
  };

  timer.cancel = function cancel ( id ) {
    return cancel( id );
  };
}

module.exports = timer;
