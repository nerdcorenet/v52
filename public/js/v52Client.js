v52Client = {};

v52Client.init = function(){

	//Hook up our mighty websocket
	try{
		this.clientSocket = io.connect('/engine');
	}catch(exeption){
		$('#chatLog').append('<p class="warning">Engine Error:' + exception);
	}

	//Some event handlers
	this.clientSocket.on('PONG', function (m){ $('#chatLog').append('<p class="warning">Engine got PONG: ' + m) });
	this.clientSocket.on('CARD', function (c){ 
		var card = v52CardView(new v52Card(c));
		v52Instance.layer.add(card.view);
		v52Instance.layer.draw();
	});

	this.clientSocket.emit('PING');
};

v52Client.getDeck = function(){

	this.clientSocket.emit('DECK');
};
