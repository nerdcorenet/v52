
var allClientsSocket;
var clientSockets = [];

exports.init = function (io){
	allClientsSocket = io.of('/chat');
	allClientsSocket.on('connection', function(s){
		clientSockets.push(s);
		s.on('msg', function(m){

			//***** A "temporary" way to access a server-side Fn. It will expand and then hopefully it will disappear
			switch(m){
				case '/deck': v52Engine.deck(); break;
			}

			allClientsSocket.emit('msg', m);
		});
	});
	console.log(v52Engine);
}
