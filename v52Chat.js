
var allClientsSocket;
var clientSockets = [];

exports.init = function (engine){
	allClientsSocket = global.io.of('/chat/' + engine.gameID);
	allClientsSocket.on('connection', function(s){
		clientSockets.push(s);
		s.on('msg', function(m){

			//***** A "temporary" way to access a server-side Fn. It will expand and then hopefully it will disappear
			//Maybe it could survive for things like /invite and /ban
			switch(m){
				case '/deck': engine.deck(); break;
			}

			allClientsSocket.emit('msg', m);
		});
	});
}
