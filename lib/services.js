var timetable = require('../lib/timetable_scraper.js');
var nodeio = require('node.io');

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

  nodeio.start(timetable.services, {args: [BASE_URL + SERVICE_LIST]}, function (err, busServices) {
    if(err) { console.error(err); }
    else {
      // console.log(busServices);
      that.setServices(busServices);
      cb(null, true);
    }
  }, true);

 /* timetable.services(BASE_URL + SERVICE_LIST, function (err, busServices) {
    if (err) {
      cb(err);
    } else {
      // console.log(busServices);
      that.setServices(busServices);
      cb(null, true);
      //cb(null, busServices);
    }
  });
*/
};

Services.prototype.getBaseLink = function (cb) {
  var that = this;
  // console.log('getBaseLink::init', this.Services[0].service);

  if (!this.Services) {
    cb(err);
  } else {

    var i = 0;
    var countReturned = 0;
    for(i; i < this.Services.length; i++) {
      
      var linkJob = new nodeio.Job({timeout: 500}, timetable.methodLinks);

      nodeio.start(linkJob, {args: [BASE_URL + DIRECTIONS, this.Services[i].service]}, function (err, links) {
        if(err) {console.error(err);}
        else {
          // console.log('links: ',links);
          that.getRoute (links);
          // that.getFullLink(links, function (err, fulllink) {});
          // this.Services[links.service[0]].
        }
      }, true);

    }

  }
};

Services.prototype.getRoute = function (links, cb) {
  var that = this;

  var i = 0;
  var countReturned = 0;
  for(i; i < links.length; i++) {

    var routeJob = new nodeio.Job({timeout: 500}, timetable.routeMethod);

    // console.log('getRoute: ', BASE_URL + ROUTE + '?' + links[i].url);
    nodeio.start(routeJob, {args: [BASE_URL + ROUTE + '?' + links[i].url]}, function (err, stops) {
      if (err) { console.error(err); }
      else {
        // console.log(stops);
      }
    }, true);

  }

};

/*Services.prototype.getFullLink = function (links, cb) {
  var that = this;

  var i = 0;
  var countReturned = 0;

  for(i; i < links.length; i++){
  
    var fulllinkJob = new nodeio.Job({timeout: 500}, timetable.methodFullLink, links.length);
    console.log('fulllinkJob url: ', BASE_URL + ROUTE + '?' + links[i].url);
    nodeio.start(fulllinkJob, {args: [BASE_URL + ROUTE + '?' + links[i].url, links[i].service]}, function (err, fulllink) {
      if (err) { console.error(err); }
      else {
        console.log('fulllink:', fulllink);
      }
    }, true);

  }
};*/

/*Services.prototype.getBaseLink = function (cb) {
  var that = this;
  console.log('getBaseLink::init', this.Services[0].service);

  if (!this.Services) {
    cb(err);
  } else {

    var i = 0;
    var countReturned = 0;
    for(i; i < 10; i++) {
      timetable.getServiceLinks(BASE_URL + DIRECTIONS, this.Services[i].service, function (err, links) {
        console.log('links: ',links);
        this.Services[i].setServiceLinks(links);
        countReturned++;
        // console.log(this.Services[i]);

        //if (this.Services -1 === countReturned) {
        // if (10 -1 === countReturned) {
          console.log('finisehd');
          cb(null, 'success');
        // }

      });
    }

  }
};*/

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