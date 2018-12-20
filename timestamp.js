'use strict';

var navigatorStart;

if ( typeof performance === 'undefined' || ! performance.now ) {
  navigatorStart = Date.now();

  module.exports = function timestamp () {
    return Date.now() - navigatorStart;
  };
} else {
  module.exports = function timestamp () {
    return performance.now();
  };
}
