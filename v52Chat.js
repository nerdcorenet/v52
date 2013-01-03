
v52Chat = function(engine){

	var this_chat = this;

	this.allClientsSocket = global.io.of('/chat/' + engine.gameID);
	this.clientSockets = [];

	this.allClientsSocket.on('connection', function(s){
		this_chat.clientSockets.push(s);
		s.on('msg', function(m){

			//***** A "temporary" way to access a server-side Fn. It will expand and then hopefully it will disappear
			//Maybe it could survive for things like /invite and /ban
			switch(m){
				case '/deck': engine.deck(); break;
			}

			this_chat.allClientsSocket.emit('msg', m);
		});
	});
}
