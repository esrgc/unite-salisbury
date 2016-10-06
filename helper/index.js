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
    hbs.registerHelper('parseDateForEdit', function( d ){
      if( typeof d == 'undefined' )
        return null
      return d.getFullYear() + "-" + scope.pad(d.getMonth() + 1) + "-" + scope.pad( d.getDate() );
    });
    hbs.registerHelper('parseTimeForEdit', function( d ){
      if( typeof d == 'undefined' )
        return null
      return scope.pad(d.getHours()) + ":" + scope.pad( d.getMinutes() ) + ":" + scope.pad( d.getSeconds() );
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

    hbs.registerHelper('generatePagination', function(data, baseUrl) {
      var url = baseUrl + '?' + [
        'pageSize=' + data.pageSize,
        'sortBy=' + data.sortBy,
        'order=' + data.order,
        'search=' + data.search,
        'searchBy=' + data.searchBy
      ].join('&');


      var html = [
        '<small> Showing ' + data.page + ' of ' + data.pageCount + '</small>',
        '<nav aria-label="Page navigation">',
        '<ul class="pagination">'
      ];

      var firstBtn = [
        '<li class="' + (data.page != 1 ? '' : 'disabled') + '"">',
        '<a href="' + url + '&page=1" aria-label="Previous">',
        '<span aria-hidden="true">&laquo;&laquo;</span>',
        '</a>',
        '</li>'
      ];
      html = html.concat(firstBtn);
      //generate previous link btn
      var prevBtn = [
        '<li class="' + (data.page > 1 ? '' : 'disabled') + '"">',
        '<a href="' + url + '&page=' + (data.page - 1) + '" aria-label="Previous">',
        '<span aria-hidden="true">&laquo;</span>',
        '</a>',
        '</li>'
      ];
      //merge to html
      html = html.concat(prevBtn);


      //generate paging buttons
      for (var i = data.page - 2; i < data.page + 3; i++) {
        if (i > 0 && i <= data.pageCount) {
          html = html.concat([
            '<li class="' + (i != data.page ? '' : 'disabled') + '"">',
            '<a href="' + url + '&page=' + i + '" aria-label="page ' + i + '">',
            '<span aria-hidden="true">' + i + '</span>',
            '</a>',
            '</li>'
          ]);
        }
      }
      //generate next btn
      var nextBtn = [
        '<li class="' + (data.pageCount > data.page ? '' : 'disabled') + '"">',
        '<a href="' + url + '&page=' + (data.page - 1) + '" aria-label="Next">',
        '<span aria-hidden="true">&raquo;</span>',
        '</a>',
        '</li>'
      ];
      //merge to html
      html = html.concat(nextBtn);
      //last btn
      var lastBtn = [
        '<li class="' + (data.page != data.pageCount ? '' : 'disabled') + '"">',
        '<a href="' + url + '&page=1" aria-label="Previous">',
        '<span aria-hidden="true">&raquo;&raquo;</span>',
        '</a>',
        '</li>'
      ];
      html = html.concat(lastBtn);

      //closing tags
      html = html.concat([
        '</ul>',
        '</nav>'
      ]);
      // console.log(html.join(''));
      return html.join('');
    });

    hbs.registerHelper('ifCond', function(v1, v2, options) {
      if (v1 === v2) {
        return options.fn(this);
      }
      return options.inverse(this);
    });

    hbs.registerHelper('parseDateTime', function(d) {
      return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
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
    return d.toLocaleDateString();
    //return (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
  },
  paseTime: function(d){
    return d.toLocaleTimeString();
  },
  pad: function(str) {
    if (String(str).length == 1)
      return "0" + str;
    return str;
  }
};
