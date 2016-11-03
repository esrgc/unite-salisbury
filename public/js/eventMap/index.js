
var startup = function(){ 
  app.application({
    name: "WhatsUp-Map",
    views: [
      'UniteSalisburyMap'
    ],
    collections: [
      'EventCollection'
    ],
    routers: ['Map'],
    launch: function(){
      
    }
  });
}


