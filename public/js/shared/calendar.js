/**
 * @param {int} The month number, 0 based
 * @param {int} The year, not zero based, required to account for leap years
 * @return {Date[]} List with date objects for each day of the month
 */
var getDaysInMonth = function(month, year) {
  var date = new Date(year, month, 1);
  var days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

//get days in months
var todayDate = new Date();
var daysOfMonth = getDaysInMonth(todayDate.getMonth(), todayDate.getFullYear());
var dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var monthLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
Date.prototype.toShortTimeString = function() {
  var hours = this.getHours();
  var minutes = this.getMinutes();
  var ampm = hours > 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ampm;
  return strTime;

};

app.Shared.Calendar = define({
  name: 'Calendar',
  _className: 'Calendar',
  initialize: function(month, year) {
    this.month = (isNaN(month) || month == null) ? todayDate.getMonth() : month;
    this.year = (isNaN(year) || year == null) ? todayDate.getFullYear() : year;
  },
  html: '',
  generateHtml: function() {
    var firstDay = new Date(this.year, this.month, 1);
    var startingDay = firstDay.getDay();
    var monthLength = daysInMonth[this.month];
    //compensate leap year (thanks to tutorial online and google code)
    if (this.month == 1) { // February only!
      if ((this.year % 4 == 0 && this.year % 100 != 0) || this.year % 400 == 0) {
        monthLength = 29;
      }
    }

    var monthName = monthLabels[this.month];

    var headerHtml = '',
      bodyHtml = '';

    //generate header (days)
    for (var i = 0; i < 7; i++) {
      headerHtml += '<th>' + dayLabels[i] + '</th>';
    }
    //generate body 
    var day = 1;
    var lastMonth = (this.month - 1) < 0 ? 11 : this.month - 1; //get previous month
    lastMonthDay = daysInMonth[lastMonth]; //previous month day length is the last day of previous month
    nextMonthDay = 1;
    for (var i = 0; i < 9; i++) { //weeks
      bodyHtml += '<tr>';
      for (var j = 0; j < 7; j++) { //days in week
        if (day <= monthLength && (j >= startingDay || i > 0)) {
          //fill day in and assign id to that date (for example march 21st id is "3-21")
          if (day == todayDate.getDate() && todayDate.getMonth() == this.month && todayDate.getFullYear() == this.year)
            bodyHtml += '<td class="today" id="' + (this.month + 1) + '-' + day + '">' + day + '<div class="day-event"></div></td>';
          else
            bodyHtml += '<td id="' + (this.month + 1) + '-' + day + '">' + day + '<div class="day-event"></div></td>';
          day++;
        } else {
          if (j < startingDay && i == 0) {
            var ld = lastMonthDay - (startingDay - j - 1);
            bodyHtml += '<td class="gray-out">' + ld + '</td>';
          } else
            bodyHtml += '<td class="gray-out">' + nextMonthDay++ + '</td>';
        }
      }
      bodyHtml += '</tr>';
      if (day > monthLength)
        break;
    }
    var html = [
      '<h4>',
      monthName + ', ' + this.year,
      '</h4>',
      '<table class="calendar-table table table-bordered">',
      '<thead>',
      '<tr>',
      headerHtml,
      '</tr>',
      '</thead>',
      '<tbody>',
      bodyHtml,
      '</tbody>',
      '</table>'
    ].join('');

    return html;
  },
  setMonth: function(month) {
    if (typeof month == 'undefined') return; //does nothing if undefined
    if (isNaN(month) || month == null) {
      console.log('Month must be a valid month number');
      return;
    }
    this.month = month;
  },
  incrementMonth: function() {
    this.month += 1;
    if (this.month > 11) {
      this.year++;
      this.month = 0;
    }
  },
  decrementMonth: function() {
    this.month -= 1;
    if (this.month < 0) {
      this.year--;
      this.month = 11;
    }
  },
  getMonth: function() {
    return this.month + 1; //month starts at 0
  },
  getYear: function() {
    return this.year;
  }

});
