const path = require('path')
const fs = require('fs-extra')
const common = require('./webpack.common.js')
const { merge } = require('webpack-merge')
const yaml = require('js-yaml')
const requireContext = require('require-context')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    // port: 8070,
    // index: 'index.html',
    writeToDisk: true,
    liveReload: true,
    stats: 'minimal',
    overlay: true,
    contentBase: path.resolve(__dirname, '../dist'),
    contentBasePublicPath: path.resolve(__dirname, '../dist'),
    historyApiFallback: {
      rewrites: [
        {
          from: /^\/.*$/,
          to: (context) => `${context.parsedUrl.pathname}.html`
        }
      ]
    }
  },
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
          {
            loader: 'webpack-html-script-insert-loader',
            options: {
              src: 'main.js',
              location: 'body'
            }
          },
          'extract-loader',
          {
            loader: 'liquid-template-loader',
            options: {
              data: (() => {
                let data

                requireContext(path.resolve(__dirname, '../src/data'), true, /\.yml$/)
                  .keys()
                  .forEach(file => {
                    const contents = fs.readFileSync(path.resolve(__dirname, `../src/data/${file}`))
                    data = { ...data, ...yaml.load(contents) }
                  })

                return data
              })()
            }
          },
          {
            loader: 'webpack-mjml-loader',
            options: {
              filePath: path.resolve(__dirname, '../src')
            }
          }
        ]
      }
    ]
  }
})