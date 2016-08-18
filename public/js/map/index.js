console.log("Hello map");
function startApp(){
    app.application({
	name: 'WhatsUpMap',
	collections: ['MapCollection'],
	views: ['MapView'],
	routers: ['Map']
    });
}
