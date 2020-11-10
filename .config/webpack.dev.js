const path = require('path')
const common = require('./webpack.common.js')
const { merge } = require('webpack-merge')

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
  }
})