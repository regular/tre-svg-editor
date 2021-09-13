const {optimize} = require('svgo')

module.exports = function(svg) {
  return optimize(svg, {
    js2svg: {
      regValEntities: /[&"'<>]/g,
    },
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            removeViewBox: false
          }
        }
      }
    ]
  }).data
}
