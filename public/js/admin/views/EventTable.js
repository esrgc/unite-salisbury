app.View.EventTable = Backbone.View.extend({
    name: 'EventTable',
    el: '#tableArea',
    addRow: function( data ){
	var tableArea = $(this.el);
	var newRow = tableArea.find('tr').clone(true);
	console.log( newRow );
	tableArea.find('table').append( newRow );
	console.log("adding row with data",data);
    }
    
});
