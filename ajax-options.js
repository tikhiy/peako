'use strict';

/**
 * @property {Object} headers
 * @property {number} timeout
 * @property {string} type
 */
module.exports = {

  /**
   * Request headers.
   */
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  },

  /**
   * Milliseconds after which the request should be canceled.
   */
  timeout: 1000 * 60,

  /**
   * The request type: 'GET', 'POST' (others are ignored, instead, 'GET' will be used).
   */
  type: 'GET'
};
