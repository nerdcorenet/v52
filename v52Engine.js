
var allClientsSocket;
var clientSockets = [];

exports.init = function (io){
	allClientsSocket = io.of('/engine');
	allClientsSocket.on('connection', function(s){

		clientSockets.push(s);

		s.on('PING', function(m){
			s.emit('PONG');
		});
	});
}

