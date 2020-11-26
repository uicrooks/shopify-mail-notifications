const path = require('path')
const common = require('./webpack.common.js')
const { merge } = require('webpack-merge')
const chalk = require('chalk')
const boxen = require('boxen')
const CopyPlugin = require('copy-webpack-plugin')
const package = require('../package.json')

// pretty log localhost address to terminal
console.log(boxen(
  chalk.green(`Project is running at http://localhost:${package.config.devServerPort}`),
  {
    padding: 1,
    margin: { top: 1, right: 0, bottom: 2, left: 0 },
    borderColor: 'green'
  }
))

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    // index: 'index.html',
    port: package.config.devServerPort,
    writeToDisk: true,
    liveReload: true,
    stats: 'minimal',
    overlay: true,
    contentBase: '/',
    contentBasePublicPath: '/',
    publicPath: '/',
    historyApiFallback: {
      rewrites: [
        {
          from: /^\/.*$/,
          to: (context) => `${context.parsedUrl.pathname}.html`
        }
      ]
    }
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../src/assets'),
          to: path.resolve(__dirname, '../dist/assets')
        }
      ]
    })
  ]
})