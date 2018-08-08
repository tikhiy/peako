'use strict';

var span = document.createElement( 'span' );

try {
  if ( span.dataset.x = 'y', span.getAttribute( 'data-x' ) === 'y' ) {
    module.exports = true;
  } else {
    throw null;
  }
} catch ( error ) {
  module.exports = false;
}

span = null;
