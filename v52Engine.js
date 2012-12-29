require('./v52Card.js');
require('./v52CardModel.js');

var allClientsSocket;
var clientSockets = [];

exports.init = function (io){

	//Some top-level properties for the game engine
	this.nextObjID = 1; //"Global ObjID for Sets, and Cards"
	this.players = {}; //Player objects indexed by player# AND name 
	this.allCards = { 0: {}}; //v52Card objects indexed by ObjID
	this.allSets = {0: {}}; //For when we implement sets

	allClientsSocket = io.of('/engine');
	allClientsSocket.on('connection', function(s){

		clientSockets.push(s);

		s.on('PING', function(m){
			s.emit('PONG', 'yaya');
		});

		s.on('DECK', function(){
			v52Engine.deck();
		});
	});
};

exports.deck = function (){
//function deck(){
	var allCards = [];
	var suits = ["C","S","H","D"];
	for(var v=2; v!="DONE"; ){
		for(var s in suits){
			allCards.push([v.toString(),suits[s]]);
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
	while(allCards.length > 0){
		var cardId = (allCards.splice(Math.random() * allCards.length, 1))[0];
		var card = new v52CardModel(new v52Card({value: cardId[0], suit: cardId[1], cardID: this.nextObjID++}));
		card.posx += i++ * 3;
		allClientsSocket.emit('CARD', card.strip('Anyone'));
	}
};


