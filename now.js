'use strict';

var undefined;

module.exports = Date.now || function now () {
  return new Date().getTime();
};
