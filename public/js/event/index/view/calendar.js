/*
Tu Hoang
March 2017

Calendar view

event callbacks: 
onEventClick(event, jsEvent, view)
onEventsLoaded(eventData, view)

*/


var Calendar = Backbone.View.extend({
  name: 'CalendarView',
  el: '#calendar-area',
  render: function() {
    var scope = this;
    this.$('#calendar').fullCalendar({
      //init full calendar 
      header: {
        left: 'prev,next,today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay,listMonth'
      },
      editable: false,
      eventSources: [
        //event feed
        {
          url: 'feed' // use the `url` property
            // color: 'yellow', // an option!
            // textColor: 'black' // an option!
        }

        // any other sources...

      ],
      eventLimit: true,
      eventMouseover: (event, jsEvent, view) => {
        //register call back and trigger here
        if (typeof scope.onEventMouseOver == 'function')
          scope.onEventMouseOver.call(scope, event, jsEvent, view);
      },
      eventClick: (event, jsEvent, view) => {
        console.log(event);
        //register call back and trigger here
        if (typeof scope.onEventClick == 'function')
          scope.onEventClick.call(scope, event, jsEvent, view);
      },
      loading: (isLoading, view) => {
        if (!isLoading){
          console.log('done fetching event data!');
          var eventData = $('#calendar').fullCalendar('clientEvents');
          // console.log(eventData);
          if(typeof scope.onEventsLoaded == 'function'){
          	scope.onEventsLoaded.call(scope, eventData, view);
          }

        }

      }

    });
  }
});

module.exports = Calendar;
