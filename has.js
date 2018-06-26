'use strict';

module.exports = function has ( key, obj ) {
  if ( obj == null ) {
    return false;
  }

  return obj[ key ] !== undefined || key in obj;
};
