var nodeio = require('node.io');
var Bus = require('./bus.js');
var Stop = require('./stop.js');

process.setMaxListeners(20000);

//nodeio.setMaxListeners(200);

exports.services = function (url, cb) {
  nodeio.scrape( function () {
    this.getHtml(url, function (err, $) {
      if (err) { console.log(err); }

      var tr = $('.Section1 table tr');
      var busServices = [];
      var iRow = 1;
      
      for (iRow; iRow < (tr.length /2); iRow++) {
       
        var bus = new Bus();

        var service   = getFullText (tr[iRow].children[0]).toLowerCase();
        var routeName = getFullText (tr[iRow].children[1]);
        var operator  = getFullText (tr[iRow].children[2]);
        var area      = getFullText (tr[iRow].children[3]);

        bus.add(service, routeName, operator, area);
        busServices.push(bus);

      }
      if (iRow === (tr.length /2)){
        cb(null, busServices);
      }
    });
  });
};

exports.getServiceLinks = function (url, serviceNo, cb) {
  nodeio.scrape( function () {
    this.getHtml (url + '?service=' + serviceNo, function (err, $) {

      if (err) { console.error (err); }

      
      var tr = $('table tr');
      var iNoOfROws = tr.length;
      var iRow = 1;
      var serviceLinks = [];

      for (iRow; iRow < iNoOfROws; iRow ++) {
        if (getFullText(tr[iRow].children[0]) == serviceNo) {
          
          var serviceUrl = tr[iRow].children[2].children[0].attribs.href.split('?')[1];
          var direction = tr[iRow].children[2].children[0].children[0].data;
          var link = new Link(serviceUrl, direction);
          //link.addDirection(serviceUrl, direction);
          serviceLinks.push (link);
        }
      }

      if(iRow === iNoOfROws) {
        cb(null, serviceLinks);
      }

    });
  });
};

exports.getFullServiceLink = function (url, cb) {
  // console.log('getFullServiceLink: ', url);
  nodeio.scrape(function () {
    this.getHtml (url, function (err, $) {

      if (err) { console.error(err); }

      var majorStopRefs = [];

      var $table = $('div#centreblock table');
      $table.children.each(function (data) {
        var row = data.children[1];
        if(row.children[0].type === 'tag') {
          majorStopRefs.push (row.children[0].children[0].data);
        }
      });

      var newUrl = url + '&expand=';

      var i = 0;
      for(i; i < majorStopRefs.length; i++) {
        newUrl = newUrl + majorStopRefs[i] + '~|';

      }
      if(i === majorStopRefs.length) {
        // console.log('newUrl: ', newUrl);
        cb(null, newUrl.split("?")[1]);
      }

    });
  });
};

exports.getRoute = function (url, link, cb) {
  // console.log('getRoute: ', url);
  nodeio.scrape(function () {
    this.getHtml(url, function (err, $) {
      if (err) { console.error (err); }

      var stopRefs = [];
      var table = $('div#centreblock table');

      table.children.each(function (data) {
        var row = data.children[1].children;

        if(row[0].type === 'tag') {
          stopRefs.push (row[0].children[0].data);
        } else if (typeof row[1] === 'undefined') {
          // heading row
        } else {
          stopRefs.push (row[1].children[0].data);
        }
      });

      cb(null, {link: link, stops: stopRefs});

    });
  });
};

function getFullText (obj) {

  var fullText = '';
  if(typeof obj.children != "undefined") {
    var iNoOfChildren = obj.children.length;
    var i = 0;

    for(i; i < iNoOfChildren; i++) {
      if (obj.children[i].type === 'text') {
        fullText += obj.children[i].data.replace('\n', "");
      } else if (obj.children[i].type === 'tag') {
        fullText += getFullText(obj.children[i]);
      }
    }
  }
  fullText = fullText.replace(/&#8211;/g, '-');
  return fullText;

}


var Link = function (url, direction) {
  var that = this;
  return {
    url : url,
    direction: direction
  };
};
Link.prototype.addDirection = function(url, direction) {
  this.url = url;
  this.direction = direction;
};