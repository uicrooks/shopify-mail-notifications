const common = require('./webpack.common.js')
const { merge } = require('webpack-merge')
const HtmlMinimizerPlugin = require('html-minimizer-webpack-plugin')

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      new HtmlMinimizerPlugin({
        test: /\.liquid/i
      })
    ]
  }
})