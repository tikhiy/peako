'use strict';

var getTime = require( './now' );

var timestamp, navigatorStart;

if ( typeof performance === 'undefined' || ! performance.now ) {
  navigatorStart = getTime();

  timestamp = function timestamp () {
    return getTime() - navigatorStart;
  };
} else {
  timestamp = performance.now;
}

module.exports = timestamp;
