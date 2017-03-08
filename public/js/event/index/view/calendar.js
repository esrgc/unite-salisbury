/*
Tu Hoang
March 2017

Calendar view
*/


var Calendar = Backbone.View.extend({
  name: 'CalendarView',
  el: '#calendar-area',
  render: function() {
  	this.$('#calendar').fullCalendar({
  		//init full calendar 
  		header: {
  			left: 'prev,next,today',
  			center: 'title',
  			right: 'month,basicWeek,basicDay,listMonth'
  		},
  		editable: false,
  		events: 'feed',
  		views: {
  			month:{},
  			basicWeek: {},
  			basicDay: {}
  		}
  	});
  }
});

module.exports = Calendar;
