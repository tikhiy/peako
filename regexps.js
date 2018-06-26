'use strict';

module.exports = {
  selector:  /^(?:#([\w-]+)|([\w-]+)|\.([\w-]+))$/,
  property:  /(^|\.)\s*([_a-z]\w*)\s*|\[\s*((?:-)?(?:\d+|\d*\.\d+)|("|')(([^\\]\\(\\\\)*|[^\4])*)\4)\s*\]/gi,
  deepKey:   /(^|[^\\])(\\\\)*(\.|\[)/,
  singleTag: /^(<([\w-]+)><\/[\w-]+>|<([\w-]+)(?:\s*\/)?>)$/,
  notSpaces: /[^\s\uFEFF\xA0]+/g
};
