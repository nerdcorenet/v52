v52Server = new v52_server();

v52_server = function(){
	this.static = require('node-static'); 

	this.httpServer = require('http').createServer(this.handleRequest);

	this.fileServer = new(static.Server)();

	this.httpServer.listen(5252);

});


}

v52_server.prototype = {
	
	handleRequest: function(request, response) {
		request.addListener('end', function () {
		    this.fileServer.serve(request, response);
		}
	}
}
			
