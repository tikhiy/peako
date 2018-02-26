
/* jshint esversion: 6, unused: true, undef: true */

exports.defineTags = function ( dictionary ) {
  /**
   * @chainable
   */
  dictionary.defineTag( 'chainable', {
    onTagged: function ( doclet, tag ) {
      doclet.chainable = true;
    },

    mustNotHaveDescription: true,
    mustHaveValue: false,
    canHaveType: false,
    canHaveName: false
  } );

  /**
   * @category name
   */
  dictionary.defineTag( 'category', {
    onTagged: function ( doclet, tag ) {
      doclet.category = tag.value;
    },

    mustNotHaveDescription: true,
    mustHaveValue: false,
    canHaveType: false,
    canHaveName: false
  } );
};
