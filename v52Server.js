//Execute this like this:
//node v52Server.js -p <port>
v52Server = function(){

	//Parse command line options
	var argv = require('optimist').argv;
	var port = argv.p ? argv.p : 5252;
	console.info("Port is %d", port);

	//Create a node-static file server
	var static = require('node-static'); 
	this.fileServer = new(static.Server)();

	//Create an HTTP server and bind socket.io to it as well
	var httpServer = require('http').createServer(this.handleRequest);
	var io = require('socket.io').listen(httpServer);

	//Implement Chat - the easy version ;)
	this.chatSocket = io.of('/chat').on('connection', function(socket){ 
		socket.on('msg', function(m){
			v52Server.chatSocket.emit('msg', m);
		})
	});

	//Fire this sucker up
	httpServer.listen(port);
}

v52Server.prototype = {
	
	handleRequest: function(request, response) {
		request.addListener('end', function () {
		    v52Server.fileServer.serve(request, response);
		})
	}
}
			
var v52Server = new v52Server();
