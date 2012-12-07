//Execute this like this:
//node v52Server.js -p <port>

var express = require('express');
var app = express();

v52Server = function(){

	//Parse command line options
	var argv = require('optimist').argv;
	this.port = argv.p ? argv.p : 5252;
	console.info("Port is %d", this.port);

	//Create a node-static file server
	var static = require('node-static'); 
	this.fileServer = new(static.Server)();

	//Create an HTTP server and bind socket.io to it as well
	var httpServer = require('http').createServer(app);
	this.io = require('socket.io').listen(httpServer);

	//Implement Chat - the easy version ;)
	this.chatSocket = this.io.of('/chat').on('connection', function(socket){ 
		socket.on('msg', function(m){
			v52Server.chatSocket.emit('msg', m);
		})
	});

	//Fire this sucker up
	httpServer.listen(this.port);
}

app.get( /^\/|(.*\.html)|(.*\.js)$/ , function(req, res){
	v52Server.fileServer.serve(req, res);
});

var v52Server = new v52Server();
