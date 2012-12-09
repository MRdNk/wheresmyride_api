var timetable = require('../lib/timetable_scraper.js');

var BASE_URL = 'http://travelplus.acislive.com/';
var SERVICE_LIST = 'style/pages/services.asp';
var DIRECTIONS = 'web/public_service.asp';
var ROUTE = 'web/public_service_stops.asp';

function Services () {
  
  this.Services = [];
  return this;

}

Services.prototype.addBus = function (bus) {
  this.Services.push (bus);
};

Services.prototype.addServices = function (cb) {
  var that = this;

  timetable.services(BASE_URL + SERVICE_LIST, function (err, busServices) {
    if (err) {
      cb(err);
    } else {
      // console.log(busServices);
      that.setServices(busServices);
      cb(null, true);
      //cb(null, busServices);
    }
  });

};

Services.prototype.getServices = function (cb) {
  if(typeof this.Services == 'undefined') {
    cb('Services is empty');
  } else {
    cb(null, this.Services);
  }
};

Services.prototype.setServices = function (services) {
  var that = this;
  var i = 0;
  var iNoOfServices = services.length;

  for(i; i < iNoOfServices; i++) {
    that.addBus (services[i]);
  }
};

module.exports = Services;