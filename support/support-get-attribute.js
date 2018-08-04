'use strict';

var span = document.createElement( 'span' );

try {
  if ( span.setAttribute( 'key', '' ), span.getAttribute( 'key' ) === '' ) {
    module.exports = true;
  } else {
    throw Error();
  }
} catch ( error ) {
  module.exports = false;
}

span = null;
