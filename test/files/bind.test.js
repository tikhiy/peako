'use strict';

var bind = require( '../../bind' );
var _    = require( '../../placeholder' );

describe( 'peako.bind', function () {
  before( function () {
    this.greet = function greet ( greeting, name, exclamation ) {
      return greeting + ' ' + name + exclamation;
    }
  } );

  it( 'should work', function () {
    bind( this.greet ).should.be.a( 'function' );
  } );

  it( 'should work with partial arguments', function () {
    var hi = bind( this.greet, null, 'Hi' );
    hi( 'John', '!' ).should.equal( 'Hi John!' );
  } );

  it( 'should work with placeholders', function () {
    var hello = bind( this.greet, null, 'Hello', _, '.' );
    hello( 'Alice' ).should.equal( 'Hello Alice.' );
  } );

  it( 'should handle context', function () {
    function greet ( greeting ) {
      return greeting + ', my name is ' + this.name + ' and I am ' + this.age + ' years old.';
    }

    var person = {
      name: 'James',
      age: 17
    };

    var bound = bind( greet, person, _ );
    bound( 'Hello' ).should.equal( 'Hello, my name is James and I am 17 years old.' );
  } );

  it( 'should work as for what it was created', function () {
    var toString = bind( Function.prototype.call, Object.prototype.toString );
    toString( [] ).should.equal( '[object Array]' );
  } );
} );
