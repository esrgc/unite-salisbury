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




