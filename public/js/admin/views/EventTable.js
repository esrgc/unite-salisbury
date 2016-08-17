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
	console.log("View save");
	if( typeof this.saveCollection == 'function' )
	    this.saveCollection();
    },
    remove: function(){
	console.log("Removing");
	//$(this).parents('tr').detach();
    }

});
