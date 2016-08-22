app.View.EventAdd = Backbone.View.extend({
    name: 'EventAdd',
    el: '#addModal',
    templateEl: '#eventForm',
    events:{
	'click #validateEvent' : 'validateEvent'
    },
    addItem: function(){
	var modal = $(this.el);
	var template = Handlebars.compile(  $(this.templateEl).html() );
	var html = template( item.toJSON() );
	var content = modal.find('.modal-body');
	content.html( html );
	modal.modal('show');


    },
    validateEvent: function(){
	var form = $('#eventAddForm :input');
	var values = {};
	form.each( function(){
	    values[this.name] = $(this).val();
	});
	console.log( values );
	var newEvent = new app.Model.EventModel( values );
	console.log(" New event ", newEvent );
	//if( typeof this.validateLocation == 'function' )
	  //  this.validateLocation( values );
    },
    //
    editItem: function ( item ){
	var modal = $(this.el);
	var template = Handlebars.compile(  $(this.templateEl).html() );
	var html = template( item.toJSON() );
	var content = modal.find('.modal-body');
	content.html( html );
	modal.modal('show');
    },
    //hide and reset modal
    hideModal: function(){
	console.log("hiding modal");
	$(this.el).modal('hide');
	$("#eventAddForm")[0].reset();
	$("#modalErr").html('');
    },
    //Set error message on modal
    modalError: function( err ){
	console.log("Error modal");
	$("#modalErr").html("&nbsp"+ err );
    }
});
