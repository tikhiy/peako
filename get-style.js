'use strict';

/**
 * @method getStyle
 * @param  {object}  element
 * @param  {string}  style
 * @param  {object} [computedStyle]
 * @return {string}
 */
module.exports = function getStyle ( element, style, computedStyle ) {
  return element.style[ style ] ||
    ( computedStyle || getComputedStyle( element ) ).getPropertyValue( style );
};
