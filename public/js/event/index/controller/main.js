/*
Tu Hoang
March 2017

Controller class that handles map and calendar view 

ES6 rocks
*/
var MapView = require('../view/map.js');
var CalendarView = require('../view/calendar');


class mainController {
  constructor() {
      //views
      this._mapView = new MapView();
      this._calendarView = new CalendarView();
    }
    //initialize view components 
  initialize() {
    console.log('Initializing...');
    var scope = this;
    //render map
    scope._mapView.render();
    //wire event callback for calendar
    scope._calendarView.onEventsLoaded = (eventData, view) => {
      console.log(`this event is called from controller!`);
      console.log(eventData);
      let group = _.groupBy(eventData, (v)=>{return v.id;});
      let data = _.map(group, (v, index) => {
        let value = v[0];//only take the first element
        let start = value.start.local().format('dddd, MMMM Do YYYY, h:mm:ss a');
        let end = value.end != null ?
          value.end.local().format('dddd, MMMM Do YYYY, h: mm: ss a') : '';
        return {
          id: value._id,
          x_coord: value.location.x,
          y_coord: value.location.y,
          template: `
      			<h4>
              <strong>${value.title}</strong>
              <small>
                <a href="edit?id=${value._id}"><i class="fa fa-pencil"></i></a>
              </small>
            </h4>
      			<p>
      				<strong>Start</strong>: ${start} <br/>
      				<strong>End</strong>: ${end} <br/>
      				<strong>Description</strong>: ${value.description} <br/>
      				<strong>Location</strong>: ${value.address} ${value.city}, ${value.state} ${value.zip}
      			</p>
      		`
        };
      });

      
      // console.log(g);

      scope._mapView.addClusterMarkers(data);

    };

    scope._calendarView.onEventClick = (event, jsEvent, view) => {
    	
    	var location = event.location;
      if (typeof location == 'undefined')
        return;
      scope._mapView.zoomToLocation(location.x, location.y);
    };
    scope._calendarView.onEventMouseOver = (event, jsEvent, view) => {
      //for editing
    };

    //render calendar
    scope._calendarView.render();
  }

  get mapView() {
    return this._mapView;
  }

  get calendarView() {
    return this._calendarView;
  }

  zoomToLocation(x, y) {
    this._mapView.zoomToLocation(x, y, 16);
  }
}

module.exports = mainController;
