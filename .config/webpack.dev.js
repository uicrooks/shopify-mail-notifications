const path = require('path')
const common = require('./webpack.common.js')
const { merge } = require('webpack-merge')
const package = require('../package.json')

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
  }
})