const path = require('path')
const fs = require('fs-extra')
const common = require('./webpack.common.js')
const { merge } = require('webpack-merge')
const yaml = require('js-yaml')
const requireContext = require('require-context')

module.exports = merge(common, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.twig$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name (resourcePath) {
                const customPath = resourcePath
                  .replace(/^.*mails/, '')
                  .replace(/twig/, 'html')

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
          },
          {
            loader: 'twig-html-loader',
            options: {
              data: (() => {
                let data = {}

                requireContext(path.resolve(__dirname, '../src/data'), false, /\.yml$/)
                  .keys()
                  .forEach(file => {
                    const contents = fs.readFileSync(path.resolve(__dirname, `../src/data/${file}`))
                    data = { ...data, ...yaml.load(contents) }
                  })

                return data
              })
            }
          }
        ]
      }
    ]
  }
})