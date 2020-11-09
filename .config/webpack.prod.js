const path = require('path')
const common = require('./webpack.common.js')
const { merge } = require('webpack-merge')

module.exports = merge(common, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.mjml$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name (resourcePath) {
                const customPath = resourcePath
                  .replace(/^.*templates/, '')
                  .replace(/mjml/, 'html')

                return customPath
              }
            }
          },
          'extract-loader',
          {
            loader: 'webpack-mjml-loader',
            options: {
              filePath: path.resolve(__dirname, '../src'),
              keepComments: false,
              minify: true,
              minifyOptions: {
                'collapseWhitespace': true,
                'minifyCSS': true,
                'removeEmptyAttributes': true
              }
            }
          }
        ]
      }
    ]
  }
})