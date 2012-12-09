
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var pg = require('pg');

var app = module.exports = express.createServer();

process.scrape_counter = 0;
process.env.DATABASE_URL = 'ec2-54-243-241-130.compute-1.amazonaws.com';


pg.connect(process.env.DATABASE_URL, function (err, client) {
  var query = client.query('CREATE TABLE user (username varchar(50));');
  
});

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {layout: false});
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function () {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
  app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);
app.get('/services', routes.services);

var port = process.env.PORT || 5000;
app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
