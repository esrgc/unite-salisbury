/*
Author: Tu Hoang
Dec 2016

add event script
-Controls form elements to implement repeat event data 
*/


var AddEvent = require('./view/addEvent.js');

let startup = function() {
  let view = new AddEvent('#event-form');

};

//fire up the app
$(() => {
  startup();
});
