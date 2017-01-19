// webpack.config.prod.js
var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  devtool: 'source-map',
  entry: {
    eventAdd: './public/js/event/add/index.js'
  },
  output: {
    filename: '[name]-bundle.js',
    path: __dirname + '/public/build'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      },
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    // new HtmlWebpackPlugin({
    //   template: './src/index.html'
    // })
  ],
  module: {
    loaders: [{
      test: /\.css$/,
      loaders: ['style', 'css', 'less']
    }]
  }
}
