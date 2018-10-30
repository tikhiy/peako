'use strict';

module.exports = function isObjectLike ( value ) {
  return typeof value === 'object' && value !== null;
};
