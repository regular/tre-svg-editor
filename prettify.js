const format = require('nxmlpp').strPrint

module.exports = function(xml) {
  return format(xml)
}
