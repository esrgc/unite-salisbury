var parseDate = function(d) {
  var date = new Date(d);
  return date.toLocaleDateString()+" "+ date.toLocaleTimeString().replace(/:\d\d /,' ');
}

var parseTime = function(d){
  var time = new Date(d);
  return time.toLocaleTimeString();
}
var pad = function(str) {
  if (String(str).length == 1)
    return "0" + str;
  return str;
}


Handlebars.registerHelper('parseEvent', function(object) {
  var detail = object.detail;
  return new Handlebars.SafeString( 
    "<dt> Description: </dt>" +
    "<dd> " + detail.description + "</dd>" +
    "<dt> Start Date: </dt>" +
    "<dd> " + parseDate(detail.startDate) + "</dd>" +
    "<dt> End Date: </dt>" +
    "<dd> " + parseDate(detail.endDate) + "</dd>" +
    "<dt> Address: </dt>" +
    "<dd> " + detail.address + "</dd>" +
    "<dt> Date Created: </dt>" +
    "<dd> " + parseDate(object.date) + "</dd>" 
  );
});

