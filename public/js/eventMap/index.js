console.log(" Hello world" );
var startup = function(){ 
  app.application({
    name: "WhatsUp-Map",
    views: [
      'MapView'
    ],
    collections: [
      'EventCollection'
    ],
    routers: ['Map'],
    launch: function(){
      
    }
  });
}


