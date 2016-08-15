var app = require('./app');

var config = require('./config/config');


app.listen( config.serverPort );


console.log("App listening on " + config.serverPort );

