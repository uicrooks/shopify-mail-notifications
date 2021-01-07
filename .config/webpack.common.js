const path = require('path')
const fs = require('fs-extra')
const ProgressPlugin = require('progress-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const yaml = require('js-yaml')
const requireContext = require('require-context')
const package = require('../package.json')

const server = `http://localhost:${package.config.devServerPort}`

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
        test: /\.(png|svg|jpg|gif)$/,
        use: 'file-loader'
      },
      {
        test: /\.twig$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name (resourcePath) {
                const customPath = resourcePath
                  .replace(/^.*templates/, '')
                  .replace(/\.twig/, process.env.NODE_ENV === 'development' ? '.html' : '.liquid')

                return customPath
              }
            }
          },
          // include webpack-html-script-insert-loader only in development
          ...process.env.NODE_ENV === 'development' ?
          [{
            loader: 'webpack-html-script-insert-loader',
            options: {
              src: `${server}/main.js`,
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

                requireContext(path.resolve(__dirname, '../src/data/shopify'), true, /\.ya?ml$/)
                  .keys()
                  .forEach(file => {
                    const contents = fs.readFileSync(path.resolve(__dirname, `../src/data/shopify/${file}`))
                    data = { ...data, ...yaml.load(contents) }
                  })

                return data
              })(),
              filters: {
                /**
                 * shopify specific filters
                 */
                strip: input => String(input).trim(),
                where: (input, argument) => input.find(el => el === argument),
                money: input => {
                  const str = String(input)
                  return `$${str.substring(0, str.length - 2)}.${str.substring(str.length - 2)}`
                },
                money_with_currency: input => {
                  const str = String(input)
                  return `$${str.substring(0, str.length - 2)}.${str.substring(str.length - 2)} USD`
                },
                money_without_trailing_zeros: input => `$${String(input).slice(0, -2)}`,
                shopify_asset_url: input => `${server}/assets/${input}`,
                format_address: input => `${input.name}<br>${input.company}<br>${input.street}<br>${input.city} ${input.province_code} ${input.zip}<br>${input.country}`
              }
            }
          }] : [],
          {
            loader: 'webpack-mjml-loader',
            options: {
              filePath: path.resolve(__dirname, '../src'),
              keepComments: process.env.NODE_ENV !== 'production'
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
                  server: server, // absolute path to localhost address
                  env: process.env.NODE_ENV,
                  development: process.env.NODE_ENV === 'development',
                  production: process.env.NODE_ENV === 'production',
                  templates: null
                }

                // force webpack to watch folder
                context.addContextDependency(path.resolve(__dirname, '../src/templates'))

                // get all templates
                data.templates = requireContext(path.resolve(__dirname, '../src/templates'), true, /\.twig$/)
                  .keys()
                  .map(template => template.replace('.twig', ''))

                // get all yml data
                requireContext(path.resolve(__dirname, '../src/data'), false, /\.ya?ml$/)
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
    new ProgressPlugin(),
    new CleanWebpackPlugin()
  ]
}