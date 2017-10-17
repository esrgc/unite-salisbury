var pg = require('pg');
var conString = require('./config/database').url;
var conJson = require('./config/database').json;
var async = require('async');
var pool = new pg.Pool(conJson);
//Database functionality
module.exports = {
  //Get data for a logged in user
  getDataForUserId: function(id, cb) {
    var client = new pg.Client(conString);
    client.connect(function() {
      client.query({
        text: 'SELECT name, startdate::date as startdate, startdate::time as starttime, enddate::date as enddate, enddate::time as endtime, street, city, lat, lon, description, eventid, ownerid, updatekey FROM data where ownerid = $1',
        values: [id]
      }, function(err, result) {
        if (err)
          cb(err, null);
        else
          cb(null, result);
        client.end();
      });
    });
  },
  //Update user data
  updateByUserId: function(id, data, cb) {
    var scope = this;
    var updateKey = Math.floor((Math.random() * 1000000) + 1);
    for (i in data)
      data[i]['updatekey'] = updateKey;

    async.each(data, this.insertFunction, function(err) {
      if (err)
        scope.abort(cb);
      else
        scope.purgeFunction(id, updateKey, cb);
    });
  },
  getMapData: function(cb) {
    var client = new pg.Client(conString);
    client.connect();
    client.query('SELECT * FROM data', function(err, results) {
      if (err)
        cb(err)
      else
        cb(null, results.rows)
    });
  },
  insertFunction: function(item, cb) {
    var scope = module.exports;
    console.log(scope);
    pool.query({
        text: 'INSERT INTO data VALUES( $1,$2,$3,$4,$5,$6,$7,$8,$9,$10, $11 )',
        values: [item.name,
          item.startdate + ' ' + scope.check(item.starttime),
          item.enddate + ' ' + scope.check(item.endtime),
          item.street,
          item.city,
          item.lat,
          item.lon,
          item.descrition,
          item.eventid,
          item.ownerid,
          item.updatekey
        ]
      },
      function(err, result) { //query callback
        if (err)
          cb(err);
        else
          cb(null, result);
      }); //End Query
  },
  purgeFunction: function(id, updateKey, cb) {
    pool.query(
      "DELETE FROM data WHERE ownerid = $1 AND updatekey != $2", [id, updateKey],
      function(err) {
        console.log("Done purge");
        if (err)
          cb("Purge error", err);
        else
          cb(null);
      });
  },
  check: function(item) {
    if (item)
      return item
    return "";
  }





}
