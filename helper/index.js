module.exports = {
  hbsHelpers: function(hbs) {
    //register all helpers here

    hbs.registerHelper('parseEvent', function(object) {
      console.log("got object", object);

      return "<dt> Date Created: </dt>" +
        "<dd> " + object.date.getFullYear() + "</dd>";
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
