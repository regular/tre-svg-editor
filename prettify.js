const {optimize} = require('svgo')

module.exports = function(svg) {
  return optimize(svg, {
    js2svg: {
      indent: 4,
      pretty: true,
      regValEntities: /[&"'<>]/g,
    },
    plugins: []
  }).data
}
