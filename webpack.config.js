/*
Tu Hoang
Dec 2016

Webpack configuration
*/
var webpack = require('webpack');

const config = {
  entry: {
    eventAdd: './public/js/event/add/index.js'
  },
  output: {
    filename: '[name]-bundle.js',
    path: __dirname + '/public/build'
  },
  plugin: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      _: 'underscore',
      Backbone: 'backbone'
    })
  ],
  resolve: {
    alias: {
      jquery: 'jquery-3.1.1/jquery.min.js',
      underscore: 'underscore/underscore-min.js',
      backbone: 'backbone/backbone-min.js'
    },
    modulesDirectories: ['lib','bower_components', 'node_modules']
  }
};

module.exports = config;
