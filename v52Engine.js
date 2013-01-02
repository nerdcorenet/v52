require('./v52Card.js');
require('./v52CardModel.js');

var allClientsSocket;
var clientSockets = [];

exports.init = function (io){

	//Some top-level properties for the game engine
// ***** Copied from v52Client - maybe we want a common include, or even a common game object that could be passed to new players?
	this.nextObjID = 1; //"Global ObjID for Sets, and Cards"
	this.players = {}; //Player objects indexed by player# AND name 
	this.allCards = { 0: {}}; //v52Card objects indexed by ObjID
	this.allSets = {0: {}}; //For when we implement sets

	this_engine = this;

	allClientsSocket = io.of('/engine');
	allClientsSocket.on('connection', function(s){

		//Track this new socket
		clientSockets.push(s);

		//Attach our event handlers to this new socket
		s.on('PING', function(m){ s.emit('PONG', 'yaya'); });
		s.on('DECK', function(){ this_engine.deck(); });
		s.on('FLIP', function(cardID){ this_engine.flipCard(cardID); });

		s.on('CARDMOVE', function(cardID, x, y){ 
			with(this_engine.allCards[cardID]){ 
				posx=x; posy=y 
			} 

			s.broadcast.emit('CARDUPDATE', this_engine.allCards[cardID].strip('Anyone'));
		});

	});
};

exports.deck = function (){

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
		this.allCards[this.nextObjID] = card;
		this.nextObjID++;
	
		card.posx += i++ * 3;
		allClientsSocket.emit('CARD', card.strip('Anyone'));
	}
};

exports.flipCard = function(cardID){

	//If we had rules, it is here that we might want to consult them to see who is allowed to flip a card
	//For today, we will assume that YES, you can flip the card!
	card = this.allCards[cardID];
	card.flip();

	allClientsSocket.emit('CARDUPDATE', card);
}
