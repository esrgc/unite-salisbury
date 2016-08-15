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

app.View.EventTable = Backbone.View.extend({
    el: '#tableArea',
    addRow: function( data ){
	console.log("adding row with data",data);
    }
    
});



app.Model.EventModel = Backbone.Model.extend({
    initialize: function(){
	console.log("New event created");
    }
});

//To hold our event models as they are created
app.Collection.EventCollection = Backbone.Collection.extend({
    name: "EventCollection",
    initialize: function(){
	console.log("New event collection created");
    },
    newLocation: function( values ){
	var req = new XMLHttpRequest();
	var scope = this;
	var qString = 'http://nominatim.openstreetmap.org/search/q='
	              + values.street +
	             ',' + values.city +
	              '?format=json';
 
	req.addEventListener("load", this.nominatimListener );
	req.collectionCallback = function( response ){
	    scope.validationCallback( response );
	}
	req.open('GET', qString );
	req.send();
        console.log("Verification request sent");                                                                            	
    },
    nominatimListener: function(){
	console.log(this.responseText);
	this.collectionCallback( this.responseText );
    },
    validationCallback: function( response ){
	console.log("Got response callback" , response );
	if( typeof this.validationSuccess == 'function' )
	    this.validationSuccess();
    }
	
	
});


app.Router.AdminRouter = Backbone.Router.extend({
    routes:{
	"": "defaultRoute",
    },
    defaultRoute: function(){
	console.log("Admin router routing default route");
	var eventAddView = app.getViewByName('EventAdd');
	var eventTableView = app.getViewByName('EventTable');
	var eventCollection = app.getCollection('EventCollection');
	eventAddView.validateLocation = function( values ){
	    var success = eventCollection.newLocation( values );
	    console.log("Validation was a ", success );
	}
	eventCollection.validationSuccess = function(){
	    console.log("Validation was a success");
	}
	    
	
	//Initialize MVC
   },
});

function startApp(){
    app.application({
	name:"WhatsUpAdmin",
	views: ['EventTable','EventAdd'],
	collections : ['EventCollection'],
	routers: ['AdminRouter']
    });
}

//for admin page




var $table = $('.adminTable');
var $saveButton = $('#saveButton');
var $tableArea = $('#tableArea');

$('.table-remove').click( function(){
    $(this).parents('tr').detach();
});


function listener(){
    console.log(this.responseText);
}


$saveButton.click( function(){
    var rows = $tableArea.find('tr:not(:hidden)');
    var data;
    for( var i =1; i < rows.length; i++ )
	console.log(rows[i]);
    var req = new XMLHttpRequest();
    req.addEventListener( "load", listener );
    req.collectionCallback = this;
    req.open( "GET", "http://nominatim.openstreetmap.org/search/q=705%20edgewater%20drive,%20salisbury?format=json");
    req.send();
});




