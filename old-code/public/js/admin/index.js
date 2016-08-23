function startApp(){
    app.application({
	name:"WhatsUpAdmin",
	views: ['EventTable','EventAdd'],
	collections : ['EventCollection'],
	routers: ['AdminRouter']
    });

}










