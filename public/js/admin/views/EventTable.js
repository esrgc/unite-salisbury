app.View.EventTable = Backbone.View.extend({
    name: 'EventTable',
    el: '#tableViewArea',
    events:{
	'click #saveButton': 'saveData',
	'click .table-remove': 'remove',
	'click .edit-row': 'edit',
	'click #addItem':'addItem'
    },
    //Render event table based on user data records
   render: function( data ){
	var source = $('#tableTemplate').html();
	var template = Handlebars.compile( source );
	var html = template( data );
	console.log( html );
	$( "#tableArea" ).html( html );
    },
    //Add a new event item
    addItem: function(){
	if( typeof this.addEvent == 'function' )
	    this.addEvent();
    },
    //Save the client data to server
    saveData: function(){
	if( typeof this.saveCollection == 'function' )
	    this.saveCollection();
    },
    //remove a row and its corresponding data model
    remove: function( e ){
	$(e.target).parents('tr').detach();
	if( typeof this.removeById == 'function' )
	    this.removeById( $(e.target).attr('value')  );
    },
    //Edit an existing row and its corresponding data model
    edit: function( e ){
	var rowVal = $(e.target).attr('value');
	if( typeof this.editById == 'function' )
	    this.editById( rowVal );
    }
});
