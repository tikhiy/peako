'use strict';

function replacer ( letter, matchIndex ) {

  letter = letter.toLowerCase();

  if ( matchIndex ) {
    return '-' + letter;
  }

  return letter;

}

// DOMString( 'backgroundRepeatX' ); // -> 'background-repeat-x'

module.exports = function DOMString ( string ) {
  return string.replace( /[A-Z]/g, replacer );
};
