var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('express-hbs');
var session = require("express-session");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var funct = require("./function.js");
var pg = require('pg');
var flash = require('connect-flash');
var User = require("./user");
var conString = require("./config/database").url;
var app = express();


require('./config/passport')(passport);

var client = new pg.Client(conString);

client.connect(function(err) {
  if (err) {
    return console.error('could not connection postgres', err);
  }
  client.query('SELECT NOW() AS "theTime"', function(err, result) {
    if (err) {
      return console.error('error running query', err);
    }
    console.log(result.rows[0].theTime);
    client.end();
  });
});

//++++++++PASSPORT++++++++++++


//++++++++EXPRESS STUFF++++++++
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', hbs.express4({
  partialsDir: __dirname + "/views/partials",
  defaultLayout: __dirname + "/views/layout.html"
}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({ secret: 'hellogoodbye' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

console.log(app.get('env'));

var routes = require('./routes/index')(app, passport);

module.exports = app;
