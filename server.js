/*
Startup code for whatsup
*/

var app = require('./app.js');
var port = require('./config').port;

app.listen(port);
console.log('Server listening on port ' + port);
