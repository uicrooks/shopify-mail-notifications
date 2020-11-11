const path = require('path')
const fs = require('fs-extra')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const yaml = require('js-yaml')
const requireContext = require('require-context')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  stats: 'minimal',
  entry: path.resolve(__dirname, '../src/main.js'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
    }
  },
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
                  .replace(/^.*templates/, '')
                  .replace(/\.twig/, '.html')

                return customPath
              }
            }
          },
          // include webpack-html-script-insert-loader only in development
          ...process.env.NODE_ENV === 'development' ?
          [{
            loader: 'webpack-html-script-insert-loader',
            options: {
              src: 'main.js',
              location: 'body'
            }
          }] : [],
          'extract-loader',
          // include liquid-template-loader only in development
          ...process.env.NODE_ENV === 'development' ?
          [{
            loader: 'liquid-template-loader',
            options: {
              data: (() => {
                let data

                requireContext(path.resolve(__dirname, '../src/data/shopify'), false, /\.yml$/)
                  .keys()
                  .forEach(file => {
                    const contents = fs.readFileSync(path.resolve(__dirname, `../src/data/shopify/${file}`))
                    data = { ...data, ...yaml.load(contents) }
                  })

                return data
              })()
            }
          }] : [],
          {
            loader: 'webpack-mjml-loader',
            options: {
              filePath: path.resolve(__dirname, '../src'),
              keepComments: process.env.NODE_ENV !== 'production',
              minify: process.env.NODE_ENV === 'production',
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
              namespaces: {
                '@layouts': path.resolve(__dirname, '../src/layouts'),
                '@templates': path.resolve(__dirname, '../src/templates'),
                '@components': path.resolve(__dirname, '../src/components')
              },
              data: (context) => {
                let data = {
                  env: process.env.NODE_ENV,
                  development: process.env.NODE_ENV === 'development',
                  production: process.env.NODE_ENV === 'production'
                }

                requireContext(path.resolve(__dirname, '../src/data'), false, /\.yml$/)
                  .keys()
                  .forEach(file => {
                    // force webpack to watch files
                    context.addDependency(path.resolve(__dirname, `../src/data/${file}`))

                    const contents = context.fs.readFileSync(path.resolve(__dirname, `../src/data/${file}`))
                    data = { ...data, ...yaml.load(contents) }
                  })

                return data
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new ProgressBarPlugin(),
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../src/img'),
          to: path.resolve(__dirname, '../dist/img')
        }
      ]
    })
  ]
}