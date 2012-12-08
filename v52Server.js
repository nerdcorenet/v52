//USAGE: start is like this
// PORT=4444 node v52Server.js

//Express modules
var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var app = express();

//Our top-level modules
v52Engine = require('./v52Engine.js');
v52Chat = require('./v52Chat.js');

app.configure(function(){
  app.set('port', process.env.PORT || 5252); 
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hjs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

//Will set up routing later 
//app.get('/', routes.index);

//Create an HTTP server and bind socket.io to it as well
var httpServer = http.createServer(app);
var v52io = require('socket.io').listen(httpServer);

//Get the engine and chat running
v52Engine.init(v52io);
v52Chat.init(v52io);

//Fire this sucker up
httpServer.listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});

