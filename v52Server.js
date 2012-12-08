//USAGE: start is like this
// PORT=4444 node v52Server.js

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var app = express();

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
app.v52io = require('socket.io').listen(httpServer);


//Implement Chat - the easy version ;)
app.v52chatSocket = app.v52io.of('/chat').on('connection', function(socket){ 
	socket.on('msg', function(m){
		app.v52chatSocket.emit('msg', m);
	})
});

//Fire this sucker up
httpServer.listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});

