'use strict';

try {
  module.exports = Object.keys( '' ), 'es2015'; // eslint-disable-line no-unused-expressions, no-sequences
} catch ( error ) {
  module.exports = 'es5';
}
