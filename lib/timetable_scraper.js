var nodeio = require('node.io');
var Bus = require('./bus.js');
var Stop = require('./stop.js');

//process.setMaxListeners(20000);

var servicesMethod = {
  input: false,
  run: function () {

    var url = this.options.args[0];
    this.getHtml(url, function (err, $) {
      if (err) { this.exit(err); }

      process.scrape_counter++;

      var tr = $('.Section1 table tr');
      var busServices = [];
      var iRow = 1;
      
      for (iRow; iRow < tr.length; iRow++) {
       
        var bus = new Bus();

        var service   = getFullText (tr[iRow].children[0]).toLowerCase();
        var routeName = getFullText (tr[iRow].children[1]);
        var operator  = getFullText (tr[iRow].children[2]);
        var area      = getFullText (tr[iRow].children[3]);

        bus.add(service, routeName, operator, area);

        busServices.push(bus);
        console.log(busServices.length, tr.length-1);
      
        if (busServices.length === (tr.length-1)){
          this.emit(busServices);
        }
      }
      
    });

  }
};

module.exports.services = new nodeio.Job({timeout: 10}, servicesMethod);

var serviceLinksMethod = {
  input: false,
  run: function () {

    var url = this.options.args[0];
    var serviceNo = this.options.args[1];
    this.getHtml (url + '?service=' + serviceNo, function (err, $) {
      process.scrape_counter++;
      // console.log(url + '?service=' + serviceNo);

      if (err) { this.exit(err); }

      var tr = $('table tr');
      var iNoOfROws = tr.length;
      var iRow = 1;
      var serviceLinks = [];

      for (iRow; iRow < iNoOfROws; iRow ++) {
        if (getFullText(tr[iRow].children[0]) == serviceNo) {
          
          var serviceUrl = tr[iRow].children[2].children[0].attribs.href.split('?')[1] + '&showall=1';
          var direction = tr[iRow].children[2].children[0].children[0].data;
          var link = new Link(serviceNo, serviceUrl, direction);
          //link.addDirection(serviceUrl, direction);
          // console.log('job link: ',link);
          serviceLinks.push (link);
        }

        if(serviceLinks.length === iRow) {
          this.emit(serviceLinks);
        }

      }


    });
  }
};

module.exports.serviceLinks = new nodeio.Job({timeout: 10}, serviceLinksMethod);
module.exports.methodLinks = serviceLinksMethod;

var routeMethod = {
  input: false,
  run: function () {
    var url = this.options.args[0];
    this.getHtml(url, function (err, $) {
      if (err) { this.exit (err); }
      process.scrape_counter++;

      var stopRefs = [];
      var table;
      try {
        table = $('div#centreblock table');
      
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

        // cb(null, {link: link, stops: stopRefs});
        this.emit({
          url: url,
          stops: stopRefs
        });

      } catch (e) {
        // console.error(e, url);
        this.exit('stop doesn\'t exist');
        // throw new Error();
      }

    });
  }
};

module.exports.routeMethod = routeMethod;

/*exports.getRoute = function (url, link, cb) {
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
};*/

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


var Link = function (service, url, direction) {
  var that = this;
  return {
    service: service,
    url : url,
    direction: direction
  };
};
Link.prototype.addDirection = function(serviceNo, url, direction) {
  this.service = serviceNo;
  this.url = url;
  this.direction = direction;
};