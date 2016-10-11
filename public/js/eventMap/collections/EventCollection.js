app.Collection.EventCollection = Backbone.Collection.extend({
    name: 'EventCollection',
    url: 'events',
    initialize: function(){
    },
    fetchEvents: function(){
      var that = this;
      this.fetch({
          success: function( colleciton, response, options ){
              if( typeof that.onDataLoaded == 'function' )
                that.onDataLoaded();
          },
          error: function( collection, respose, options ){
            if( typeof that.onDataCollectionError == 'function' )
              that.onDataCollectionError();
          }
      });
    }
  
    
});
