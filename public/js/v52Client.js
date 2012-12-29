v52Client = {};

v52Client.init = function(){

	//Some top-level properties for the game engine
	//***** Copied from v52Engine - maybe we want a common include, or even a common game object that could be passed to new players?
	this.nextObjID = 1; //"Global ObjID for Sets, and Cards"
	this.players = {}; //Player objects indexed by player# AND name 
	this.allCards = { 0: {}}; //v52Card objects indexed by ObjID
	this.allSets = {0: {}}; //For when we implement sets


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
		v52Client.allCards[card.cardID] = card;
		v52Instance.layer.add(card.view);
		v52Instance.layer.draw();
	});
	this.clientSocket.on('CARDUPDATE', function(c){
		var card = v52Client.allCards[c.cardID];
		for (prop in c){
			card[prop] = c[prop];
		}
		card.refresh();
	});

	this.clientSocket.emit('PING');
};

v52Client.getDeck = function(){ this.clientSocket.emit('DECK'); };

v52Client.flipCard = function(cardID){ this.clientSocket.emit('FLIP', cardID); }

v52Client.sendMove = function(cardID, newx, newy){ this.clientSocket.emit('CARDMOVE', cardID, newx, newy); }

