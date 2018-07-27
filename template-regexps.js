'use strict';

module.exports = {
  safe: '<%-\\s*([^]*?)\\s*%>',
  html: '<%=\\s*([^]*?)\\s*%>',
  comm: '<%#([^]*?)%>',
  code: '<%[^%]\\s*([^]*?)\\s*%>'
};
