//View for event adding and editing
app.View.EventAdd = Backbone.View.extend({
    name: 'EventAdd',
    el: '#addModal',
    templateEl: '#eventForm',
    events:{
	'click #validateEvent' : 'validateEvent',
	'click .closeModal': 'hideModal'
    },
    //When adding a brandnew item
    addItem: function(){
	//Render defaults with an event id of null
	var modal = $( this.el );
	var template = Handlebars.compile(  $( this.templateEl ).html() );
	var html = template({
	    "title": "Event Title",
	    "street": "Street Address",
	    "city": "City",
	    "startdate": "Start Date",
	    "starttime": "Start Time",
	    "enddate": "End Date",
	    "endtime" : "End Time",
	    "description": "Description",
	    "eventid": "null"
			     });
	var content = modal.find('.modal-body');
	content.html( html );
	$('.startdate').datepicker(); 
	$('.enddate').datepicker(); 
	modal.modal('show');
    },
    //When editing and existing event
    editItem: function ( model ){
	//Render based on model
	var modal = $( this.el );
	var template = Handlebars.compile(  $( this.templateEl ).html() );
	var html = template( model.toJSON() );
	var content = modal.find('.modal-body');
	content.html( html );
	$('.startdate').datepicker(); 
	$('.enddate').datepicker(); 
	modal.modal('show');
    },
    //Grab data from form and package in a new model for validation
    validateEvent: function(){
	var form = $('#eventAddForm :input');
	var id = String($('#eventId').attr('value'));
	console.log('id', id );
	var values = {};
	form.each( function(){
	    values[this.name] = $( this ).val();
	});
	values['eventid'] = id;
	var newEvent = new app.Model.EventModel( values );
	if( typeof this.validateInfo == 'function' )
	    this.validateInfo( newEvent );
    },
    //hide and reset modal
    hideModal: function(){
	$( this.el ).modal('hide');
	$("#modalErr").html('');
    },
    //Set error message on modal
    modalError: function( err ){
	$("#modalErr").html("&nbsp"+ err );
    }
});
