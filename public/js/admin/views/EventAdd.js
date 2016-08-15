app.View.EventAdd = Backbone.View.extend({
    name: 'EventAdd',
    el: '#addModal',
    events:{
	'click #addItem' : 'addItem'
    },
    addItem: function(){
	console.log("Adding item");
	var form = $('#eventAddForm :input');
	var values = {};
	form.each( function(){
	    values[this.name] = $(this).val();
	});
	console.log( values );
	if( typeof this.validateLocation == 'function' )
	    this.validateLocation( values );

    }
});
