app.View.EventTable = Backbone.View.extend({
    name: 'EventTable',
    el: '#tableArea',
    addRow: function( data ){
	var tableArea = $(this.el);
	var newRow = tableArea.find('tr').clone(true);
	console.log( newRow );
	tableArea.find('table').append( newRow );
	console.log("adding row with data",data);
    },
    render: function( data ){

	console.log( "View render" , data );
	var source = $('#tableTemplate').html();
	var template = Handlebars.compile( source );
	var html = template( data );
	console.log( html );
	$( this.el ).html( html );
    }
});
