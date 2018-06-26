'use strict';

module.exports = function isObjectLike ( value ) {
  return !! value && typeof value === 'object';
};
