module.exports = {
  hbsHelpers: function(hbs) {
    //register all helpers here

    hbs.registerHelper('parseEvent', function(object) {
      console.log("got object", object);
      var detail = object.detail;
      return "<dt> Date Created: </dt>" +
        "<dd> " + parseDate( object.date ) + "</dd>" +
        "<dt> Description </dt>" +
        "<dd> " + detail.description + "</dd>" +
        "<dt> Start Date </dt>" +
        "<dd> " + parseDate( detail.startDate ) + "</dd>" +
        "<dt> End Date </dt>" +
        "<dd> " + parseDate( detail.endDate ) + "</dd>" +
        "<dt> Address </dt>" +
        "<dd> " + detail.address + "</dd>";
    });
    return hbs;
  },
  copy: function(dest, source) {
    dest = dest || {};
    if (source) {
      for (var property in source) {
        var value = source[property];
        if (value !== undefined) {
          dest[property] = value;
        }
      }     
    }
    return dest;
  }
};
function parseDate( d ){
    return (d.getMonth()+1) + "/" + (d.getDay()+1) + "/" + d.getFullYear();
}
