const {optimize} = require('svgo')

module.exports = function(svg) {
  return optimize(svg, {
    js2svg: {
      indent: 2, // string with spaces or number of spaces. 4 by default
      pretty: false, // boolean, false by default
    },
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            removeViewBox: false
          }
        }
      },
      require('./cleanupQuotesInAttrs')
    ]
  }).data
}
