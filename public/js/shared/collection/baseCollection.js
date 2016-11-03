/*
Tu Hoang
2015

Base collection
*/

app.Collection.BaseCollection = Backbone.Collection.extend({
  name: 'BaseCollection',
  socrataUrl: '',
  limit: 25000, //rows limit (this determines number of rows returned)
  
  getData: function() {
    return this.toJSON();
  },
  // template variables:
  // {{geom}}, {{geomName}}
  // if a variable is not provided, it will be ignored.
  queryCriterias: {

  },
  setCriterias: function(criterias) {
    copy(this.queryCriterias, criterias);
  },
  prepareQuery: function() {    
    //specify query templates
    //TO BE OVERRIDDEN IN SUBCLASS TO COMPILE QUERY WITH HANDLEBARS

    //FOR EXAMPLE
    // var select = [
    //   'date_trunc_y(date_paid) as year',
    //   '{{geom}}',
    //   'sum(total_project_claim_amount) as total',
    //   'sum(federal_co_payment) as federal',
    //   'sum(state_macs_payment) as state',
    //   'sum(farmer_amount) as farmer'
    // ].join(',');

    // var group = [
    //   'year',
    //   '{{geom}}'
    // ].join(',');

    // var where = [
    //   '{{#if geomName}}',
    //   "{{geom}} = '{{geomName}}'",
    //   '{{/if}}'
    // ].join('');

    // //template data
    // var criterias = this.queryCriterias;

    // //compile templates with data
    // this.query = {
    //   '$select': Handlebars.compile(select)(criterias),
    //   '$group': Handlebars.compile(group)(criterias),
    //   '$where': Handlebars.compile(where)(criterias)
    // };
  },
  //fetches data from socrata and parse returned data to 
  //make it ready for charts
  fetchData: function(criterias, cb) {
    var scope = this;
    scope.setCriterias(criterias);
    scope.prepareQuery(); //compile query templates and get query object
    this.fetch({
      reset: true, //fetch new data to replace existing models
      data: scope.query, //for query construction
      success: function(collection, response) {
        //console.log(collection.toJSON());

        //then invoke onDataLoaded event 
        if (typeof scope.onDataLoaded == 'function')
          scope.onDataLoaded.call(scope, scope);

        //call back invoked
        if (typeof cb == 'function')
          cb.call(this, this);
      },
      error: function(err) {
        console.log(err);
      }
    });
  }


});
