app.View.EventTable = Backbone.View.extend({
    name: 'EventTable',
    el: '#tableViewArea',
    events:{
	'click #saveButton': 'saveData',
	'click .table-remove': 'remove'
    },
   render: function( data ){

	console.log( "View render" , data );
	var source = $('#tableTemplate').html();
	var template = Handlebars.compile( source );
	var html = template( data );
	console.log( html );
	$( "#tableArea" ).html( html );
    },
    saveData: function(){
	if( typeof this.saveCollection == 'function' )
	    this.saveCollection();
    },
    remove: function( e ){
	$(e.target).parents('tr').detach();
	if( typeof this.removeById == 'function' )
	    this.removeById( $(e.target).attr('value')  );
    }

});
