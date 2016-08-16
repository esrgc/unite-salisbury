app.View.EventAdd = Backbone.View.extend({
    name: 'EventAdd',
    el: '#addModal',
    events:{
	'click #addItem' : 'addItem'
    },
    addItem: function(){

	//Get data from form and pass to router
	var form = $('#eventAddForm :input');
	var values = {};
	form.each( function(){
	    values[this.name] = $(this).val();
	});
	console.log( values );
	if( typeof this.validateLocation == 'function' )
	    this.validateLocation( values );



    },
    //hide and reset modal
    hideModal: function(){
	console.log("hiding modal");
	$(this.el).modal('hide');
	$("#eventAddForm")[0].reset();
	$("#modalErr").html('');
    },
    modalError: function( err ){
	console.log("Error modal");
	$("#modalErr").html("&nbsp"+ err );
    }
});
