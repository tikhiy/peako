/**
 * Adapted from Jonathan Neal getComputedStyle polyfill.
 * https://github.com/jonathantneal/polyfill/blob/master/polyfills/getComputedStyle/polyfill.js
 */

'use strict';

var DOMString = require( './to-dom-string' );

var camelCase = require( './camel-case' );

var keys = require( './keys' );

var push = Array.prototype.push;

var getComputedStyle;

if ( typeof window !== 'undefined' || ! ( getComputedStyle = window.getComputedStyle ) ) {

  // disable 'Function declarations should not be placed in blocks.'
  // jshint -W082

  /**
   * @param {Element} e
   * @param {string} k
   * @param {number?} fz
   * @returns {number}
   */
  function getComputedStylePixel ( e, k, fz ) {

    // Internet Explorer sometimes struggles to read currentStyle until the
    // element's document is accessed.

    var v = e.currentStyle[ k ].match( /(\d+|\d*\.\d+)(em|\u0025|cm|in|mm|pc|pt)?/ ) || [ null, 0, '' ];

    var size = v[ 1 ],
        suff = v[ 2 ];

    var rz, parent;

    if ( typeof fz === 'undefined' ) {
      parent = e.parentElement;

      if ( ! parent || suff !== '\u0025' && suff !== 'em' ) {
        fz = 16;
      } else {
        fz = getComputedStylePixel( parent, 'fontSize' );
      }
    }

    if ( k === 'fontSize' ) {
      rz = fz;
    } else if ( /width/i.test( k ) ) {
      rz = e.clientWidth;
    } else {
      rz = e.clientHeight;
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
  }

  /**
   * @param {Object} style
   * @param {string} k
   */
  function setShortStyleProperty ( style, k ) {
    var suff, t, r, b, l;

    if ( k === 'border' ) {
      suff = 'Width';
    } else {
      suff = '';
    }

    t = k + 'Top' + suff;
    r = k + 'Right' + suff;
    b = k + 'Bottom' + suff;
    l = k + 'Left' + suff;

    if ( style[ t ] === style[ r ] && style[ t ] === style[ b ] && style[ t ] === style[ l ] ) {
      style[ k ] = style[ t ];
    } else if ( style[ t ] === style[ b ] && style[ l ] === style[ r ] ) {
      style[ k ] = style[ t ] + ' ' + style[ r ];
    } else if ( style[ l ] === style[ r ] ) {
      style[ k ] = style[ t ] + ' ' + style[ r ] + ' ' + style[ b ];
    } else {
      style[ k ] = style[ t ] + ' ' + style[ r ] + ' ' + style[ b ] + ' ' + style[ l ];
    }
  }

  /**
   * @constructor
   * @param {Element} e
   */
  function CSSStyleDeclaration ( e ) {

    var fz = getComputedStylePixel( e, 'fontSize' );

    var c = e.currentStyle;

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
        this.width = e.offsetWidth + 'px';
      } else if ( i === 'height' ) {
        this.height = e.offsetHeight + 'px';
      } else if ( c[ i ] !== 'auto' && /margin.|padding.|border.*W/.test( i ) ) {
        this[ i ] = Math.round( getComputedStylePixel( e, i, fz ) ) + 'px';
      } else if ( ! i.indexOf( 'outline' ) ) {

        // errors on checking outline

        try {
          this[ i ] = c[ i ];
        } catch ( e ) {
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

  }

  function reject () {
    throw Error();
  }

  CSSStyleDeclaration.prototype = {

    /**
     * @param {string} k
     * @returns {string}
     */
    getPropertyValue: function getPropertyValue ( k ) {
      return this[ camelCase( k ) ] || '';
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
   * @param {Element} element
   * @returns {CSSStyleDeclaration}
   */
  getComputedStyle = function getComputedStyle ( element ) {
    return new CSSStyleDeclaration( element );
  };

  // jshint +W082

}

module.exports = getComputedStyle;
