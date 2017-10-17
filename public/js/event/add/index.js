/*
Author: Tu Hoang
Dec 2016

add event script
-Controls form elements to implement repeat event data 
*/


var AddEvent = require('./view/addEvent');

let startup = function() {
	
  let view = new AddEvent({el: '#event-form'});
  
};

//fire up the app
$(() => {
  startup();
});
