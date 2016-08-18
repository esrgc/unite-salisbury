console.log("Hello map");
function startApp(){
    app.application({
	name: 'WhatsUpMap',
	views: ['MapView'],
	collections: ['MapCollection'],
	routers: ['MapRouter']
    });
}
