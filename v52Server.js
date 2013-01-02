//USAGE: start is like this
// PORT=4444 node v52Server.js

//Express modules
var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 5252); 
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hjs');
  app.use(express.logger('dev'));
  app.use(express.favicon());
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

//Auto-load our routing modules, they handle their own app.VERB() additions through the init functions
//LICENSE: This code taken from: http://blog.pixelingene.com/2012/06/a-simple-organization-scheme-for-expressjs-apps/ (Jan 1 2013)
var fs = require('fs');
var path = require('path');

var RouteDir = 'routes';
var files = fs.readdirSync(RouteDir);

files.forEach(function (file) {
	if(file[0] == '.'){ return; }
	var filePath = path.resolve('./', RouteDir, file),
	route = require(filePath);
	route.init(app);
});

//Create an HTTP server and bind socket.io to it as well
var httpServer = http.createServer(app);
var v52io = require('socket.io').listen(httpServer);

//Get the engine and chat running
engine = require('./v52Engine.js');
engine.init(v52io);
chat = require('./v52Chat.js');
chat.init(v52io, engine);

//Fire this sucker up
httpServer.listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});

