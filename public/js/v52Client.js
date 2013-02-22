v52Client = {};

v52Client.init = function(gameID){

	var this_client = this;

	this.game = {}; //Initialized by PONG

	//Hook up our mighty websocket
	try{
		this.clientSocket = io.connect('/engine/' + gameID);
	}catch(exeption){
		$('#chatLog').append('<p class="warning">Engine Error:' + exception);
	}

	//Some event handlers
	this.clientSocket.on('PONG', function (m){ 
		//Game state object
		this_client.game = new v52Game(m);

		//Draw it
		for(var cardID in this_client.game.allCards){
			this_client.newCard(this_client.game.allCards[cardID]);
		}

		//Now go through them again (this is the clever part) BACKWARES adjusting the zIndexes
		for(var keys = Object.keys(this_client.game.allCards), l = keys.length; l; --l){
			this_client.game.allCards[ keys[l-1] ].view.setZIndex(this_client.game.allCards[ keys[l-1] ].posz);
		}
		v52Instance.layer.draw();
	});

	this.clientSocket.on('CARD', function (c){ 
		this_client.newCard(c);	
	});

	this.clientSocket.on('CARDUPDATE', function(c){
		var card = v52Client.game.allCards[c.cardID];
		for (var prop in c){
			card[prop] = c[prop];
		}
		card.view.moveToTop();
		card.refresh();
	});

	this.clientSocket.emit('PING');
};

v52Client.newCard = function(c){ 
	var card = v52CardView(new v52Card(c));
	v52Client.game.allCards[card.cardID] = card;
	v52Instance.layer.add(card.view);
	v52Instance.layer.add(card.view.baseToken);
	v52Instance.layer.draw();
	if(card.facing == "up"){ card.refresh(); }
}

v52Client.getDeck = function(){ this.clientSocket.emit('DECK'); };

v52Client.flipCard = function(cardID){ this.clientSocket.emit('FLIP', cardID); }

v52Client.sendMove = function(cardID, newx, newy, newz){ this.clientSocket.emit('CARDMOVE', cardID, newx, newy, newz); }

v52Client.tokenizeCard = function(cardID){ this.clientSocket.emit('TOKENIZE', cardID); }
