
/*!
 * Based on the default JSDoc template.
 */

/* jshint esversion: 6, unused: true, undef: true */
/* global require, exports */

;( ( global, undefined ) => {

'use strict';

let view, dest_path, _data;

const
  fs = require( 'jsdoc/fs' ),
  env = require( 'jsdoc/env' ),
  path = require( 'jsdoc/path' ),
  helper = require( 'jsdoc/util/templateHelper' ),
  template = require( 'jsdoc/template' ),
  util = require( 'util' ),
  logger = require( 'jsdoc/util/logger' ),
  doop = require( 'jsdoc/util/doop' ),
  taffy = require( 'taffydb' ).taffy,
  hasOwnProp = Object.prototype.hasOwnProperty;

/**
 * @param {TAFFY} data See <http://taffydb.com/>.
 * @param {Object} options
 * @param {Tutorial} tutorials
 */
exports.publish = ( data, options, tutorials ) => {
  let
    // path of the templates
    template_path = path.normalize( options.template ),
    // path of the static files
    // static_path = path.join( template_path, 'static' ),
    // "template" object in the jsdoc config
    config = env.conf.templates,
    // url of the global.html file
    global_url = helper.getUniqueFilename( 'global' ),
    pkg_info, conf_files;

  const
    src_file_paths = [],
    src_files = {};

  // the destination path
  dest_path = path.normalize( env.opts.destination );

  // add url to the link map object
  // it's something like
  // [ 'global' ] => global_url
  // [ global_url ] => 'global'
  helper.registerLink( 'global', global_url );

  // config may not exist
  if ( !config ) {
    config = env.conf.templates = {
      default: {}
    };
  } else if ( !config.default ) {
    config.default = {};
  }

  // set up tutorials for helper
  helper.setTutorials( tutorials );

  // remove undocumented, private (if needs), ... elements
  data = _data = helper.prune( data );

  data.sort( 'longname, version, since' );

  helper.addEventListeners( data );

  data().each( ( doclet ) => {
    let src_path;

    doclet.attribs = '';

    if ( doclet.examples ) {
      doclet.examples.forEach( ( example, i, examples ) => {
        let caption = '';

        if ( example.match( /^\s*<caption>([\s\S]+?)<\/caption>(\s*[\n\r])([\s\S]+)$/i ) ) {
          caption = RegExp.$1;
          example = RegExp.$3;
        }
        
        examples[ i ] = {
          caption: caption,
          code: example
        };
      } );
    }

    // build a list of source files
    if ( doclet.meta ) {
      src_path = get_path_from_doclet( doclet );

      if ( !src_files[ src_path ] ) {
        src_files[ src_path ] = {
          resolved: src_path,
          shortened: null
        };

        src_file_paths.push( src_path );
      }
    }

    if ( doclet.see ) {
      doclet.see.forEach( ( item, i, see ) => {
        see[ i ] = hash_to_link( doclet, item );
      } );
    }

    // console.dir( doclet );
  } );

  // update outdir if necessary, then create outdir
  pkg_info = get_data( { kind: 'package' } );

  if ( pkg_info && ( pkg_info = pkg_info[ 0 ] ) && pkg_info.name ) {
    dest_path = path.join( dest_path, pkg_info.name, pkg_info.version || '' );
  }

  fs.mkPath( dest_path );

  // copy the template static files into the destination dir
  // for ( let filename of fs.ls( static_path, 5 ) ) {
  //   copy_to_dest( filename, static_path, dest_path );
  // }

  // copy user-specified static files to outdir
  if ( ( conf_files = config.default.staticFiles ) ) {
    // The canonical property name is `include`. We
    // accept `paths` for backwards compatibility
    // with a bug in JSDoc 3.2.x.
    const static_file_paths = conf_files.include || conf_files.paths || [];

    const
      static_file_filter = new ( require('jsdoc/src/filter') )
        .Filter( conf_files ),
      static_file_scanner = new ( require('jsdoc/src/scanner') )
        .Scanner();

    for ( let file_path of static_file_paths ) {
      let extra_files, src_path;

      file_path = path.resolve( env.pwd, file_path );
      src_path = fs.toDir( file_path );

      extra_files = static_file_scanner
        .scan( [ file_path ], 10, static_file_filter );

      for ( let filename of extra_files ) {
        copy_to_dest( filename, src_path, dest_path );
      }
    }
  }

  if ( src_file_paths.length ) {
    shorten_paths( src_files, path.commonPrefix( src_file_paths ) );
  }

  data().each( ( doclet ) => {
    let
      url = helper.createLink( doclet ),
      doclet_path;

    helper.registerLink( doclet.longname, url );

    // add a shortened version of the full path
    if ( doclet.meta ) {
      doclet_path = src_files[ get_path_from_doclet( doclet ) ].shortened;

      if ( doclet_path ) {
        doclet.meta.shortpath = doclet_path;
      }
    }
  } );

  data().each( ( doclet ) => {
    const url = helper.longnameToUrl[ doclet.longname ];

    if ( url.indexOf('#') >= 0 ) {
      doclet.id = url.split(/#/).pop();
    } else {
      doclet.id = doclet.name;
    }

    if ( needs_signature( doclet ) ) {
      doclet.signature = '';
      add_signature_params( doclet );
      add_signature_returns( doclet );
      add_attrs( doclet );
    }
  } );

  // do this after the urls have all been generated
  data().each( ( doclet ) => {
    const kind = doclet.kind;

    doclet.ancestors = helper.getAncestorLinks( data, doclet );

    if ( kind === 'member' || kind === 'constant' ) {
      add_signature_types( doclet );
      add_attrs( doclet );

      if ( kind === 'constant' ) {
        doclet.kind = 'member';
      }
    }
  } );

  const members = helper.getMembers( data );

  members.tutorials = tutorials.children;

  // template
  // from it will be created static files
  // e.g. index.html
  // see the ".tmpl" files
  view = new template.Template( path.join( template_path, 'tmpl' ) );
  view.settings = null;

  // set up templating
  if ( ( conf_files = config.default.layoutFile ) ) {
    view.layout = path.getResourcePath(
      path.dirname( conf_files ),
      path.basename( conf_files ) );
  } else {
    view.layout = 'layout.tmpl';
  }

  // add template helpers
  view.find = get_data;
  view.linkto = helper.linkto;
  view.resolveAuthorLinks = helper.resolveAuthorLinks;
  view.tutoriallink = tutorial_link;
  view.htmlsafe = helper.htmlsafe;
  view.outputSourceFiles = config.default.outputSourceFiles !== false;

  attach_module_symbols(
    get_data( { longname: { left: 'module:' } } ),
    members.modules );

  // output pretty-printed source files by default
  if ( config.default.outputSourceFiles !== false ) {
    generate_src_files( src_files, options.encoding );
  }

  view.nav = build_nav( members );

  if ( members.globals.length ) {
    generate( 'Global', [ { kind: 'globalobj' } ], global_url );
  }

  // index page displays information from package.json and lists files

  generate( 'Home', get_data( { kind: 'package' } ).concat( {
    kind: 'mainpage',
    readme: options.readme,
    longname: options.mainpagetitle ? options.mainpagetitle : 'Main Page'
  }, get_data( { kind: 'file' } ) ), helper.getUniqueFilename( 'index' ) );

  // set up the lists that we'll use to generate pages
  const
    namespaces = taffy( members.namespaces ),
    interfaces = taffy( members.interfaces ),
    externals = taffy( members.externals ),
    modules = taffy( members.modules ),
    classes = taffy( members.classes ),
    mixins = taffy( members.mixins );

  for ( let longname of Object.keys( helper.longnameToUrl ) ) {
    const
      url = helper.longnameToUrl[ longname ],
      spec = { longname: longname },
      _namespaces = helper.find( namespaces, spec ),
      _interfaces = helper.find( interfaces, spec ),
      _externals = helper.find( externals, spec ),
      _modules = helper.find( modules, spec ),
      _classes = helper.find( classes, spec ),
      _mixins = helper.find( mixins, spec );

    if ( _modules.length ) {
      generate( 'Module: ' + _modules[ 0 ].name, _modules, url );
    }

    if ( _classes.length ) {
      generate( 'Class: ' + _classes[ 0 ].name, _classes, url );
    }

    if ( _namespaces.length ) {
      generate( 'Namespace: ' + _namespaces[ 0 ].name, _namespaces, url );
    }

    if ( _mixins.length ) {
      generate( 'Mixin: ' + _mixins[ 0 ].name, _mixins, url );
    }

    if ( _externals.length ) {
      generate( 'External: ' + _externals[ 0 ].name, _externals, url );
    }

    if ( _interfaces.length ) {
      generate( 'Interface: ' + _interfaces[ 0 ].name, _interfaces, url );
    }
  }

  // TODO: move the tutorial functions to templateHelper.js
  const generate_tutorial = ( title, tutorial, filename ) => {
    let html = view.render( 'tutorial.tmpl', {
      children: tutorial.children,
      content: tutorial.parse(),
      header: tutorial.title,
      title: title,
      now: now
    } );

    fs.writeFileSync(
      path.join( dest_path, filename ),
      // yes, you can use {@link} in tutorials too!
      // turn {@link foo} into <a href="foodoc.html">foo</a>
      helper.resolveLinks( html ),
      'utf8' );
  };

  // tutorials can have only one parent so there is no risk for loops
  const save_children = ( node ) => {
    for ( let child of node.children ) {
      generate_tutorial( 'Tutorial: ' + child.title, child, helper.tutorialToUrl( child.name ) );
      save_children( child );
    }
  };

  save_children( tutorials );
};

/**
 * Look for classes or functions with the same name as modules (which indicates that the module
 * exports only that class or function), then attach the classes or functions to the `module`
 * property of the appropriate module doclets. The name of each class or function is also updated
 * for display purposes. This function mutates the original arrays.
 *
 * @private
 * @param {Array.<module:jsdoc/doclet.Doclet>} doclets
 * The array of classes and functions to check.
 * @param {Array.<module:jsdoc/doclet.Doclet>} modules
 * The array of module doclets to search.
 */
const attach_module_symbols = ( () => {
  function map ( symbol ) {
    // this = doop
    symbol = this( symbol );

    if ( symbol.kind === 'class' || symbol.kind === 'function' ) {
      symbol.name = symbol.name.replace('module:', '(require("') + '"))';
    }

    return symbol;
  }

  const filter = ( symbol ) => {
    return symbol.description || symbol.kind === 'class';
  };

  return ( doclets, modules ) => {
    const symbols = {};

    // build a lookup table
    for ( let symbol of doclets ) {
      if ( symbols[ symbol.longname ] ) {
        symbols[ symbol.longname ].push( symbol );
      } else {
        symbols[ symbol.longname ] = [ symbol ];
      }
    }

    for ( let module of modules ) {
      if ( !symbols[ module.longname ] ) {
        continue;
      }

      module.modules = symbols[ module.longname ]
        // Only show symbols that have a description. Make an exception for classes, because
        // we want to show the constructor-signature heading no matter what.
        .filter( filter )
        .map( map, doop );
    }
  };
} )();

/**
 * @example
 * get_now( new Date() );
 * // -> '19 February 2018 (Monday)'
 */
const get_now = ( date ) => {
  let day, month;

  switch ( date.getMonth() ) {
    case 0:  month = 'January';   break;
    case 1:  month = 'February';  break;
    case 2:  month = 'March';     break;
    case 3:  month = 'April';     break;
    case 4:  month = 'May';       break;
    case 5:  month = 'June';      break;
    case 6:  month = 'July';      break;
    case 7:  month = 'August';    break;
    case 8:  month = 'September'; break;
    case 9:  month = 'October';   break;
    case 10: month = 'November';  break;
    case 11: month = 'December';
  }

  switch ( date.getDay() ) {
    case 0: day = 'Monday';    break;
    case 1: day = 'Tuesday';   break;
    case 2: day = 'Wednesday'; break;
    case 3: day = 'Thursday';  break;
    case 4: day = 'Friday';    break;
    case 5: day = 'Saturday';  break;
    case 6: day = 'Sunday';
  }

  return date.getDate() + ' ' + month + ' ' + date.getFullYear() + ' (' + day + ')';
};

/**
 * Create the navigation sidebar.
 * @param {object} members The members that will be used to create the sidebar.
 * @param {array<object>} members.classes
 * @param {array<object>} members.externals
 * @param {array<object>} members.globals
 * @param {array<object>} members.mixins
 * @param {array<object>} members.modules
 * @param {array<object>} members.namespaces
 * @param {array<object>} members.tutorials
 * @param {array<object>} members.events
 * @param {array<object>} members.interfaces
 * @return {string} The HTML for the navigation sidebar.
 */
const build_nav = ( members ) => {
  let
    nav = '<h2><a href="index.html">Home</a></h2>',
    i, l;

  const seen = {};

  const imlazy = [
    members.modules,    'Modules',    {},   helper.linkto,
    members.externals,  'Externals',  seen, linkto_external,
    members.classes,    'Classes',    seen, helper.linkto,
    members.events,     'Events',     seen, helper.linkto,
    members.namespaces, 'Namespaces', seen, helper.linkto,
    members.mixins,     'Mixins',     seen, helper.linkto,
    members.tutorials,  'Tutorials',  {},   linkto_tutorial,
    members.interfaces, 'Interfaces', seen, helper.linkto
  ];

  for ( i = 0, l = imlazy.length; i < l; i += 4 ) {
    nav += build_member_nav( imlazy[ i ], imlazy[ i + 1 ], imlazy[ i + 2 ], imlazy[ i + 3 ] );
  }

  if ( members.globals.length ) {
    let global_nav = '';

    for ( let member of members.globals ) {
      if ( member.kind !== 'typedef' && !seen[ member.longname ] ) {
        global_nav += '<li>' + helper.linkto( member.longname, member.name ) + '</li>';
      }

      seen[ member.longname ] = true;
    }

    if ( !global_nav ) {
      // turn the heading into a link so you can actually get to the global page
      nav += '<h3>' + helper.linkto( 'global', 'Global' ) + '</h3>';
    } else {
      nav += '<h3>Global</h3><ul>' + global_nav + '</ul>';
    }
  }

  return nav;
};

const build_member_nav = ( items, item_heading, seen, linkto ) => {
  let nav = '';

  for ( let item of items ) {
    let display_name;

    if ( !hasOwnProp.call( item, 'longname' ) ) {
      nav += '<li>' + linkto( '', item.name ) + '</li>';
    } else if ( !hasOwnProp.call( seen, item.longname ) ) {
      if ( env.conf.templates.default.useLongnameInNav ) {
        display_name = item.longname;
      } else {
        display_name = item.name;
      }

      nav += '<li>' + linkto( item.longname, display_name.replace(/\b(module|event):/g, '') ) + '</li>';
      seen[ item.longname ] = true;
    }
  }

  if ( nav ) {
    nav = '<h3>' + item_heading + '</h3><ul>' + nav + '</ul>';
  }

  return nav;
};

const generate = ( title, docs, filename, resolve_links ) => {
  let html = view.render( 'container.tmpl', {
    title: title,
    docs: docs,
    env: env,
    now: now
  } );

  if ( resolve_links !== false ) {
    // turn {@link foo} into <a href="foodoc.html">foo</a>
    html = helper.resolveLinks( html );
  }

  fs.writeFileSync( path.join( dest_path, filename ), html, 'utf8' );
};

const generate_src_files = ( src_files, encoding = 'utf8' ) => {
  for ( let file of Object.keys( src_files ) ) {
    const
      shortened = src_files[ file ].shortened,
      // links are keyed to the shortened path in each doclet's `meta.shortpath` property
      src_path = helper.getUniqueFilename( shortened ),
      src = [];

    helper.registerLink( shortened, src_path );

    try {
      src.push( {
        kind: 'source',
        code: helper.htmlsafe( fs.readFileSync( src_files[ file ].resolved, encoding ) )
      } );
    } catch ( ex ) {
      logger.error( 'Error while generating source file %s: %s', file, ex.message );
    }

    generate( 'Source: ' + shortened, src, src_path, false );
  }
};

const add_signature_params = ( doclet ) => {
  if ( doclet.params ) {
    doclet.signature = util.format(
      '%s( %s )',
      doclet.signature,
      add_param_attrs( doclet.params ).join( ', ' ) );
  } else {
    doclet.signature += '()';
  }
};

const update_item_name = ( item ) => {
  let name;

  if ( item.optional ) {
    if ( item.defaultvalue ) {
      // [name=value]
      item.name = '[' + item.name + '=' + item.defaultvalue + ']';
    } else {
      // [name]
      item.name = '[' + item.name + ']';
    }
  }

  if ( item.variable ) {
    // ...[name=value]
    // ...[name]
    // ...name
    item.name = '...' + item.name;
  }

  if ( item.nullable != null ) {
    name = util.format(
      '%s<span class="signature-attrs"> - %s</span>',
      item.name,
      item.nullable ? 'nullable' : 'non-null' );
  } else {
    name = item.name;
  }

  return name;
};

const add_param_attrs = ( params ) => {
  let
    res = [],
    added = {},
    param;

  for ( param of params ) {
    if ( param.name && param.name.indexOf( '.' ) < 0 ) {
      // Handle this case:
      // function_name( same_name, same_name, same_name ) -> {Whatever}
      // Params:
      // same_name (Array) - Very long blabla...
      // same_name (String) - Very long blabla...
      // same_name (Number) - Very long blabla...
      if ( !added[ param.name ] ) {
        added[ param.name ] = true;
        res.push( update_item_name( param ) );
      } else {
        update_item_name( param );
      }
    }
  }

  return res;
};

const add_signature_returns = ( doclet ) => {
  const
    src = doclet.yields || doclet.returns,
    return_types = src && add_non_param_attrs( src );

  doclet.signature = '<span class="signature">' + doclet.signature + '</span>';

  // jam all the return-type attributes into an array. this could create odd results (for example,
  // if there are both nullable and non-nullable return types), but let's assume that most people
  // who use multiple @return tags aren't using Closure Compiler type annotations, and vice-versa.
  if ( src && return_types.length ) {
    const attrs = [];

    for ( let item in src ) {
      for ( let attr of helper.getAttribs( item ) ) {
        if ( attrs.indexOf( attr ) < 0 ) {
          attrs.push( attr );
        }
      }
    }

    doclet.signature += ' -> ' +
      build_attrs_str( attrs ) + '{' +
      return_types.join( '|' ) + '}';
  }
};

const needs_signature = ( doclet ) => {
  let
    kind = doclet.kind,
    needs = false,
    type_names, i;

  // function and class definitions always get a signature
  if ( kind === 'function' || kind === 'class' ||
  // and namespaces that are functions get a signature (but finding them is a
  // bit messy)
    kind === 'namespace' && doclet.meta && doclet.meta.code &&
    doclet.meta.code.type && doclet.meta.code.type.match( /[Ff]unction/ ) )
  {
    needs = true;

  // typedefs that contain functions get a signature, too
  } else if ( kind === 'typedef' && doclet.type &&
    ( type_names = doclet.type.names ) && type_names.length )
  {
    for ( i = type_names.length - 1; i >= 0; --i ) {
      if ( type_names[ i ].toLowerCase() === 'function' ) {
        needs = true;
        break;
      }
    }
  }

  return needs;
};

const hash_to_link = ( doclet, hash ) => {
  if ( !/^(#.+)/.test( hash ) ) {
    return hash;
  }

  return '<a href="' + helper
    .createLink( doclet )
    .replace( /(#.+|$)/, hash ) + '">' + hash + '</a>';
};

const get_path_from_doclet = ( doclet ) => {
  const meta = doclet.meta;

  if ( meta.path && meta.path !== 'null' ) {
    return path.join( meta.path, meta.filename );
  }

  return meta.filename;
};

const add_signature_types = ( doclet ) => {
  const types = build_item_type_strings( doclet );

  if ( types.length ) {
    doclet.signature += '<span class="type-signature">' +
      ( ' :' + types.join( '|' ) ) + '</span>';
  }
};

const build_item_type_strings = ( item ) => {
  if ( !item || !item.type || !item.type.names ) {
    return [];
  }

  const types = [];

  for ( let name of item.type.names ) {
    types.push( helper.linkto( name, helper.htmlsafe( name ) ) );
  }

  return types;
};

const add_non_param_attrs = ( () => {
  const foobaz = ( types, item ) => {
    return types.concat( build_item_type_strings( item ) );
  };

  return ( items ) => {
    return items.reduce( foobaz, [] );
  };
} )();

const add_attrs = ( doclet ) => {
  doclet.attribs = util.format(
    '<span class="type-signature">%s</span>',
    build_attrs_str( helper.getAttribs( doclet ) ) );
};

const build_attrs_str = ( attrs ) => {
  if ( !attrs.length ) {
    return '';
  }

  return helper.htmlsafe( '(' + attrs.join( ', ' ) + ') ' );
};

const shorten_paths = ( files, prefix ) => {
  for ( let file of Object.keys( files ) ) {
    files[ file ].shortened = files[ file ].resolved
      .replace( prefix, '' )
      // always use forward slashes
      .replace( /\\/g, '/' );
  }
};

const copy_to_dest = ( filename, src_path, res_path ) => {
  const dest = fs.toDir( change_path( filename, src_path, res_path ) );
  fs.mkPath( dest );
  fs.copyFileSync( filename, dest );
};

/**
 * change_path( 'abc/abc/.js', 'abc/', 'xyz/' );
 * // -> 'xyz/abc/file.js'
 */
const change_path = ( dir, from, to ) => {
  return to + dir.slice( from.length );
};

const tutorial_link = ( () => {
  const options = {
    classname: 'disabled',
    prefix: 'Tutorial: ',
    tag: 'em'
  };

  return ( name ) => {
    return helper.toTutorial( name, null, options );
  };
} )();

const linkto_tutorial = ( longname, name ) => {
  return tutorial_link( name );
};

const linkto_external = ( longname, name ) => {
  return helper.linkto( longname, name.replace( /(^"|"$)/g, '' ) );
};

const get_data = ( spec ) => {
  return _data( spec ).get();
};

const now = get_now( new Date() );

} )( this );
