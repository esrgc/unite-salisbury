var parseDate = function(d) {
  var date = new Date(d);
  return date.toLocaleDateString() +" "+ date.toLocaleTimeString();



 // return (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
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
  console.log("got object", object);
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

/*Handlebars.registerHelper('parseDateForEdit', function( d ){
  if( typeof d == 'undefined' )
    return null
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad( d.getDate() );
});

Handlebars.registerHelper('parseTimeForEdit', function( d ){
  if( typeof d == 'undefined' )
    return null
  return pad(d.getHours()) + ":" + pad( d.getMinutes() ) + ":" + pad( d.getSeconds() );
});
*/ 
