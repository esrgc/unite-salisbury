module.exports = {
  registerHelpers: function(hbs) {
    //register all helpers here
    var scope = this;
    hbs.registerHelper('parseEvent', function(object) {
      console.log("got object", object);
      var detail = object.detail;
      return "<dt> Date Created: </dt>" +
        "<dd> " + scope.parseDate(object.date) + "</dd>" +
        "<dt> Description </dt>" +
        "<dd> " + detail.description + "</dd>" +
        "<dt> Start Date </dt>" +
        "<dd> " + scope.parseDate(detail.startDate) + "</dd>" +
        "<dt> End Date </dt>" +
        "<dd> " + scope.parseDate(detail.endDate) + "</dd>" +
        "<dt> Address </dt>" +
        "<dd> " + detail.address + "</dd>";
    });

    //generate listing link
    hbs.registerHelper('generateSortUrl', function(data, baseUrl, sortBy, label) {
      var url = baseUrl + '?' + [
        'pageSize=' + data.pageSize,
        'page=' + data.page,
        'sortBy=' + sortBy,
        'order=' + (data.order == 'asc' ? 'desc' : 'asc'), //flip flop order
        'search=' + data.search,
        'searchBy=' + data.searchBy
      ].join('&');

      var showIndicator = data.sortBy == sortBy;
      var orderIndicator = data.order == 'asc' ?
        '&nbsp;<i class="fa fa-arrow-up"></i>' :
        '&nbsp;<i class="fa fa-arrow-down"></i>';
      var html = [
        '<a href="' + url + '">',
        label,
        showIndicator ? orderIndicator : '',
        '</a>'
      ].join('');
      return html;
    });

    hbs.registerHelper('generatePageUrl', function(data, baseUrl) {
      var url = baseUrl + '?' + [
        'pageSize=' + data.pageSize,        
        'sortBy=' + sortBy,
        'order=' + data.order, 
        'search=' + data.search,
        'searchBy=' + data.searchBy
      ].join('&');

     
      return html;
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
  },
  parseDate: function(d) {
    return (d.getMonth() + 1) + "/" + (d.getDay() + 1) + "/" + d.getFullYear();
  }
};
