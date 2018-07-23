'use strict';

module.exports = Date.now || function now () {
  return new Date().getTime();
};
