/*
Tu Hoang	
ESRGC2017

map view package

*/

var MainRouter = require('./router/main.js');

$(() => {
  var router = new MainRouter();
  //finally starts backbone history;
  Backbone.history.start();
  console.log('App initiated...')
});
