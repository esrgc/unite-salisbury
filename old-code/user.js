var pg = require('pg');
var conString = require('./config/database').url;
console.log("Connection string", conString);
var client = new pg.Client(conString);

//User profile 
function User(idIn, emailIn, passIn) {
  this.id = idIn;
  this.email = emailIn;
  this.password = passIn;
};


module.exports = {
  //Find a matching email and check password
  findOne: function(email, pass, callback) {
    var client = new pg.Client(conString);
    var user;
    var message = null;
    //check if there is a user available for this email;
    client.connect();
    client.query("SELECT * from login where email=$1", [email], function(err, result) {
      if (err) {
        return callback(err, null);
      }
      //if no rows were returned from query, then new user
      if (result.rows.length > 0) {
        var record = result.rows[0];
        if (pass == record.pass)
          user = new User(result.rows[0].id, email, pass);
        else {
          user = null;
          message = "Invalid Password";
        }
      } else {
        user = null;
        message = "Email not found.";
      }
      client.end();
      return callback(message, user);
    });
  },
  //Get info based on just id number
  findById: function(id, cb) {
    var client = new pg.Client(conString);
    var user;
    var error = false;
    client.on('error', function(err) {
      console.log("Cleint error", err);
    });
    client.connect(function() {
      client.query({
        text: "SELECT * from login where id=$1",
        values: [id],
      }, function(err, result) {
        cb(err, result);
        client.end();
      });
    });
  },
  createOne: function(email, pass, cb) {
    var client = new pg.Client(conString);
    var user;
    var id = 0;
    var scope = this;
    client.connect(function() {
      //callback on connect
      client.query({
          text: 'SELECT "id" FROM login ORDER BY "id" DESC;',
        },
        //Callback on query 
        function(err, result) {
          if (err)
            return cb(err, null);
          if (result.rows.length < 1)
            id = 1;
          else
            id = parseInt(result.rows[0].id) + 1;
          console.log("Id is", id);
          client.end();
          user = new User(id, email, pass);
          console.log("Saving");
          scope.save(user, cb);

        });
    });
  },
  save: function(user, cb) {
    var client = new pg.Client(conString);
    client.connect(function() {
      //callback on connect
      client.query({
          text: 'INSERT INTO login (pass, id, email ) VALUES ( $1, $2, $3 )',
          values: [user.password, user.id, user.email]
        },
        //callback on query
        function(err, result) {
          console.log("Save complete");
          if (err) cb(err, null);
          else cb(null, user);
          client.end();

        });
    });

  }
};
