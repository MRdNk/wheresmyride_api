/*
 * GET home page.
 */

var Services = require('../lib/services.js');
var services = new Services();

(function () {
  services.addServices(function (err, success) {
    if (err) {
      console.error (err);
    } else {
      console.log (success);
    }
  });
}).call();

exports.index = function (req, res) {
  res.render('index', { title: 'Where\'s my ride: API' });
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