'use strict';

var chai  = require( 'chai' );
var like  = require( 'chai-like' );

chai.should();
chai.use( like );

global.expect = chai.expect;
global.should = null;

chai.truncateThreshold = 0;
