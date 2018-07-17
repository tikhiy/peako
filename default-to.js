'use strict';

module.exports = function defaultTo ( value, defaultValue ) {
  if ( value != null && value === value ) {
    return value;
  }

  return defaultValue;
};
