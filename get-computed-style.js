/*!
 * Adapted from Jonathan Neal getComputedStyle polyfill.
 * https://github.com/jonathantneal/polyfill/blob/master/polyfills/getComputedStyle/polyfill.js
 */

'use strict';

var DOMString = require( './dom-string' );
var camelize = require( './camelize' );
var keys = require( './keys' );
var push = Array.prototype.push;
var getComputedStyle, getComputedStylePixel, setShortStyleProperty, CSSStyleDeclaration, reject;

if ( typeof window !== 'undefined' || ! ( getComputedStyle = window.getComputedStyle ) ) {

  // disable 'Function declarations should not be placed in blocks.'
  // jshint -W082

  /**
   * @private
   * @param {Node} element
   * @param {string} key
   * @param {number?} fz
   * @returns {number}
   */
  getComputedStylePixel = function getComputedStylePixel ( element, key, fz ) {

    // Internet Explorer sometimes struggles to read currentStyle until the
    // element's document is accessed.

    var value = element.currentStyle[ key ].match( /(\d+|\d*\.\d+)(em|\u0025|cm|in|mm|pc|pt)?/ ) || [ null, 0, '' ];
    var size = value[ 1 ];
    var suff = value[ 2 ];
    var rz, parent;

    if ( typeof fz === 'undefined' ) {
      parent = element.parentElement;

      if ( ! parent || suff !== '\u0025' && suff !== 'em' ) {
        fz = 16;
      } else {
        fz = getComputedStylePixel( parent, 'fontSize' );
      }
    }

    if ( key === 'fontSize' ) {
      rz = fz;
    } else if ( /width/i.test( key ) ) {
      rz = element.clientWidth;
    } else {
      rz = element.clientHeight;
    }

    switch ( suff ) {
      case 'em':
        return size * fz;
      case'\u0025':
        return size * 0.01 * rz;
      case'cm':
        return size * 0.3937 * 96;
      case'in':
        return size * 96;
      case'mm':
        return size * 0.3937 * 9.6;
      case'pc':
        return size * 12 * 96 / 72;
      case'pt':
        return size * 96 / 72;
    }

    // no suffix or suffix is 'px' (default case)

    return size;
  };

  /**
   * @private
   * @param {Object} style
   * @param {string} key
   */
  setShortStyleProperty = function setShortStyleProperty ( style, key ) {
    var suff, t, r, b, l;

    if ( key === 'border' ) {
      suff = 'Width';
    } else {
      suff = '';
    }

    t = key + 'Top' + suff;
    r = key + 'Right' + suff;
    b = key + 'Bottom' + suff;
    l = key + 'Left' + suff;

    if ( style[ t ] === style[ r ] && style[ t ] === style[ b ] && style[ t ] === style[ l ] ) {
      style[ key ] = style[ t ];
    } else if ( style[ t ] === style[ b ] && style[ l ] === style[ r ] ) {
      style[ key ] = style[ t ] + ' ' + style[ r ];
    } else if ( style[ l ] === style[ r ] ) {
      style[ key ] = style[ t ] + ' ' + style[ r ] + ' ' + style[ b ];
    } else {
      style[ key ] = style[ t ] + ' ' + style[ r ] + ' ' + style[ b ] + ' ' + style[ l ];
    }
  };

  /**
   * @private
   * @constructor
   * @param {Node} element
   */
  CSSStyleDeclaration = function CSSStyleDeclaration ( element ) {
    var fz = getComputedStylePixel( element, 'fontSize' );
    var c = element.currentStyle;
    var k, i, j, l;

    for ( j = 0, k = keys( c ), l = k.length - 1; j < l; ++j ) {
      i = k[ j ];

      if ( i === 'styleFloat' ) {
        push.call( this, 'float' );
      } else {
        push.call( this, DOMString( i ) );
      }

      if ( i === 'styleFloat' ) {
        this[ 'float' ] = c.styleFloat;
      } else if ( i === 'width' ) {
        this.width = element.offsetWidth + 'px';
      } else if ( i === 'height' ) {
        this.height = element.offsetHeight + 'px';
      } else if ( c[ i ] !== 'auto' && /margin.|padding.|border.*W/.test( i ) ) {
        this[ i ] = Math.round( getComputedStylePixel( element, i, fz ) ) + 'px';
      } else if ( ! i.indexOf( 'outline' ) ) {

        // errors on checking outline

        try {
          this[ i ] = c[ i ];
        } catch ( element ) {
          if ( ! this.outlineColor ) {
            this.outlineColor = c.outlineColor || c.color;
          }

          if ( ! this.outlineStyle ) {
            this.outlineStyle = c.outlineStyle || 'none';
          }

          if ( ! this.outlineWidth ) {
            this.outlineWidth = c.outlineWidth || '0px';
          }

          if ( ! this.outline ) {
            this.outline = this.outlineColor + ' ' + this.outlineStyle + ' ' + this.outlineWidth;
          }
        }
      } else {
        this[ i ] = c[ i ];
      }
    }

    this.fontSize = Math.round( fz ) + 'px';

    setShortStyleProperty( this, 'padding' );
    setShortStyleProperty( this, 'margin' );
    setShortStyleProperty( this, 'border' );

  };

  reject = function reject () {
    throw Error();
  };

  CSSStyleDeclaration.prototype = {

    /**
     * @param {string} key
     * @returns {string}
     */
    getPropertyValue: function getPropertyValue ( key ) {
      return this[ camelize( key ) ] || '';
    },

    /**
     * @param {number} i
     * @returns {string}
     */
    item: function item ( i ) {
      return this[ i ];
    },

    getPropertyPriority: reject,
    removeProperty: reject,
    setProperty: reject,
    constructor: CSSStyleDeclaration
  };

  /**
   * @param {Node} element
   * @returns {CSSStyleDeclaration}
   */
  getComputedStyle = function getComputedStyle ( element ) {
    return new CSSStyleDeclaration( element );
  };

  // jshint +W082

}

module.exports = getComputedStyle;
