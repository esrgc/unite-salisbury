//To hold our event models as they are created
app.Collection.EventCollection = Backbone.Collection.extend({
  name: "EventCollection",
  url: 'getUserEvents',
  cache: null,
  model: app.Model.EventModel,
  topId: 0,
  userId: 0,
  initialize: function() {},
  getUserData: function() {
    var scope = this;
    this.fetch({
      success: function(c, r, o) {
        scope.userId = o.xhr.getResponseHeader('id');
        if (typeof scope.onDataLoaded == 'function')
          scope.onDataLoaded();
        else
          console.error("No handle for data load");
      },
      error: function() {
        if (typeof scope.onDataError == 'function')
          scope.onDataError();
        else
          console.error("No handle for data error");
      }
    });
  },
  // addNewModel: function( model ){
  //	console.log( model.validate() );	    
  //  },
  update: function(model) {
    console.log("Updating collection with", model);
  },
  saveData: function() {
    console.log("Collection saving data");
    this.sync('create', this);
  },
  enterEvent: function(model) {
    this.cache = model;
    model.validate(this.validationCallback.bind(this));


    //if( datesResult == true )
    //   this.validateLocation( values );
    //else
    //  if( typeof this.validationFailure == 'function' )
    //	this.validationFailure( datesResult );
  },
  validationCallback: function(err, model) {

    console.log("Collection callback called", err);
    if (!err)
      this.update(model);
    if (typeof this.validationDone == 'function')
      this.validationDone(err);
  },
  removeById: function(eventid) {
    console.log("Removing event id", eventid);
    this.remove(this.where({ eventid: Number(eventid) }));
  },
  getModelById: function(id) {
    console.log(this.models);
    console.log(" finding ", id);
    return this.findWhere({ "eventid": Number(id) });
  }

});
