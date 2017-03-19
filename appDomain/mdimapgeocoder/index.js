var url = require('url')
var http;
function MDiMapGeocoder() {
  this.address_fields = ['Street', 'City', 'State', 'ZIP']

  this.defaults = {
    browser: false,
    wkid: 4326,
    outFields: [],
    get_url: {
      protocol: 'http:',
      host: 'geodata.md.gov',
      //pathname: 'imap/rest/services/GeocodeServices/MD_CompositeLocatorWithZIPCodeCentroids/GeocodeServer/findAddressCandidates'
      pathname: 'imap/rest/services/GeocodeServices/MD_AddressPointLocator/GeocodeServer/findAddressCandidates'
    }
  }

  this.options = JSON.parse(JSON.stringify(this.defaults))

  if (typeof module !== 'undefined' && module.exports) {
    this.browser = false
    http = require('http')
  } else {
    this.browser = true
  }
}

MDiMapGeocoder.prototype.search = function(term, options, next) {

  if (arguments.length === 2) {
    if (typeof options === 'function') {
      next = options
    }
    this.options = JSON.parse(JSON.stringify(this.defaults))
  } else if (arguments.length === 3) {
    if(options) {
      for(var option in options){
        this.options[option] = options[option]
      }
    }
  }

  var query = {
    outSR: this.options.wkid,
    outFields: this.options.outFields.join(','),
    f: 'json'
  }

  if(typeof term === 'string') {
    query.SingleLine = term
  } else if(typeof term === 'object') {
    for(var i = 0; i < this.address_fields.length; i++){
      var field = this.address_fields[i]
      if(term[field]) {
        query[field] = term[field]
      }
    }
  }

  var get_url = this.options.get_url
  get_url.query = query

  if(this.browser){
    browserGet(get_url, next)
  } else {
    nodeGet(get_url, next)
  }
}

function browserGet(get_url, next) {
  get_url.query.callback = '_MDiMapGeocoder_cb'
  window._MDiMapGeocoder_cb = function(data){
    next(null, data)
  }
  get_url = url.format(get_url)

  var script = document.createElement('script')
  script.onload = function() {
    document.head.removeChild(this)
  }
  script.src = get_url
  document.getElementsByTagName('head')[0].appendChild(script)
}

function nodeGet(get_url, next) {
  get_url = url.format(get_url)
  http.get(get_url, function(res){
    var data = ''
    res.on("data", function(chunk) {
      data += chunk
    })
    res.on('end', function(err){
      if(err) {
        next(err)
        return
      } else {
        var obj = JSON.parse(data)
        next(null, obj)
      }
    })
  })
}


module.exports = new MDiMapGeocoder()