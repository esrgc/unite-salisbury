module.exports = {
  hbsHelpers: function(hbs) {
  	//register all helpers here

    hbs.registerHelper('parseEvent', function(object) {
      console.log("got object", object);

      return "<dt> Date Created: </dt>" +
        "<dd> " + object.date.getFullYear() + "</dd>";
    });
    return hbs;
  };
};
