
var allClientsSocket;
var clientSockets = [];

exports.init = function (io){
	allClientsSocket = io.of('/chat');
	allClientsSocket.on('connection', function(s){
		clientSockets.push(s);
		s.on('msg', function(m){
			allClientsSocket.emit('msg', m);
		});
	});
	console.log(v52Engine);
}
