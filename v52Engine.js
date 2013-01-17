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

	var possibleCards = [["2","C"],["2","S"],["2","H"],["2","D"],["3","C"],["3","S"],["3","H"],["3","D"],["4","C"],["4","S"],["4","H"],["4","D"],["5","C"],["5","S"],["5","H"],["5","D"],["6","C"],["6","S"],["6","H"],["6","D"],["7","C"],["7","S"],["7","H"],["7","D"],["8","C"],["8","S"],["8","H"],["8","D"],["9","C"],["9","S"],["9","H"],["9","D"],["10","C"],["10","S"],["10","H"],["10","D"],["J","C"],["J","S"],["J","H"],["J","D"],["Q","C"],["Q","S"],["Q","H"],["Q","D"],["K","C"],["K","S"],["K","H"],["K","D"],["A","C"],["A","S"],["A","H"],["A","D"]];

	var i = 0;
	while(possibleCards.length > 0){

		var whichCard = (possibleCards.splice(Math.random() * possibleCards.length, 1))[0];
		var card = new v52CardModel(new v52Card({value: whichCard[0], suit: whichCard[1], cardID: this.nextObjID}));
		this.game.allCards[this.nextObjID++] = card;
	
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
