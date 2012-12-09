var timetable = require('../lib/timetable_scraper.js');

var BASE_URL = 'http://travelplus.acislive.com/';
var SERVICE_LIST = 'style/pages/services.asp';
var DIRECTIONS = 'web/public_service.asp';
var ROUTE = 'web/public_service_stops.asp';

function Bus () {

  this.service = null;
  this.operator = null;
  this.area = null;
  this.routeName = null;
  this.route = null;

  return this;
}

Bus.prototype.add = function (service, routeName, operator, area) {
  this.service = service;
  this.routeName = routeName;
  this.operator = operator;
  this.area = area;
};

Bus.prototype.setService = function (service) {
  this.service = service;
};

Bus.prototype.setRouteName = function (routeName) {
  this.routeName = routeName;
};

module.exports = Bus;