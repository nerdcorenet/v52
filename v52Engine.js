require('./v52Card.js');
require('./v52CardModel.js');
require('./v52Game.js');
var _ = require('cloneextend');

v52Engine = function(gameID){

	var this_engine = this;

	this.gameID = gameID;
	this.game = new v52Game();

	this.nextObjID = 1; //"Global ObjID for Sets, and Cards"

	this.clientSockets = [];
	this.allClientsSocket = io.of('/engine/' + gameID);
	this.allClientsSocket.on('connection', function(s){

		//Track this new socket
		this_engine.clientSockets.push(s);

		//Attach our event handlers to this new socket
		s.on('PING', function(m){ this_engine.sendGame(s); });
		s.on('DECK', function(){ this_engine.deck(); });
		s.on('FLIP', function(cardID){ this_engine.flipCard(cardID); });

		s.on('CARDMOVE', function(cardID, x, y, z){ 
			with(this_engine.game.allCards[cardID]){ 
				posx=x; posy=y; posz=z;
			} 

			s.broadcast.emit('CARDUPDATE', this_engine.game.allCards[cardID].strip('Anyone'));
		});

	});
}

v52Engine.prototype.deck = function (){

	var possibleCards = [];
	var suits = ["C","S","H","D"];
	for(var v=2; v!="DONE"; ){
		for(var s in suits){
			possibleCards.push([v.toString(),suits[s]]);
		}
		if(v < 10){
			v += 1;
		}else{
			switch(v){
				case 10: v = "J"; break;
					 case "J": v = "Q"; break;
					 case "Q": v = "K"; break;
					 case "K": v = "A"; break;
					 case "A": v = "DONE"; break;
			}
		}
	}
	var i = 0;
	while(possibleCards.length > 0){

		var whichCard = (possibleCards.splice(Math.random() * possibleCards.length, 1))[0];
		var card = new v52CardModel(new v52Card({value: whichCard[0], suit: whichCard[1], cardID: this.nextObjID}));
		this.game.allCards[this.nextObjID] = card;
		this.nextObjID++;
	
		card.posx += i++ * 3;
		this.allClientsSocket.emit('CARD', card.strip('Anyone'));
	}
}

v52Engine.prototype.flipCard = function(cardID){

	//If we had rules, it is here that we might want to consult them to see who is allowed to flip a card
	//For today, we will assume that YES, you can flip the card!
	card = this.game.allCards[cardID];
	card.flip();

	this.allClientsSocket.emit('CARDUPDATE', card);
}

v52Engine.prototype.sendGame = function(socket){
	
	//Clone the game and strip all the cards
	var clientGame = _.clone(this.game);
	for(var cardID in clientGame.allCards){
		clientGame.allCards[cardID] = clientGame.allCards[cardID].strip('Anyone');
	}

	socket.emit('PONG', clientGame);
}
