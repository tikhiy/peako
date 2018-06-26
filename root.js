'use strict';

var root;

if ( typeof global !== 'undefined' ) {
  root = global;
} else if ( typeof window !== 'undefined' ) {
  root = window;
} else if ( typeof self !== 'undefined' ) {
  root = self;
}

module.exports = root;
