/*
 * GET home page.
 */

var Services = require('../lib/services.js');
var services = new Services();


(function () {
  console.log(new Date());
  services.addServices(function (err, success) {
    if (err) {
      console.error (err);
    } else {
      // console.log ('Services: ', success);
      services.getBaseLink(function (err, baselinks_success) {
        // console.log ('Base Links: ', err, baselinks_success);
        // console.log(new Date());
      });
    }
  });
  console.log(new Date());
}).call();

/*(function () {
  var array = [];
  array.push ({
    url : 'service=6&operatorid=1&systemid=3&goingto=Baldwin+Street',
    service : 6
  });

  services.getFullLink (array, function (err, fulllink) {
    console.log (fulllink);
  });
}).call();
*/
exports.index = function (req, res) {
  res.render('index', { title: 'Where\'s my ride: API', scraped: process.scrape_counter });
};

exports.services = function (req, res) {

  services.getServices(function (err, services) {
    if (err) {
      res.writeHead(500);
      res.write('Unable to get services');
      res.end();
    }

    res.json(services);

  });
};

