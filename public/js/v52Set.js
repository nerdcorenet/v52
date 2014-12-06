v52Set = function(config){ 

	for (prop in config){
		this[prop] = config[prop];
	}

	if(!this.setID){ this.setID = v52Engine.nextObjID++ } 
	if(!this.owner){ this.owner = 'Anyone'} //Must be Player # or 'Anyone'
	if(!this.posx){ this.posx = 0 } //These are "Virtual" co-ordinates, not necesarrily the physical pixel coords on the client	
	if(!this.posy){ this.posy = 0 } //If the card becomes part of a set, these become an offset from the set's default layout position of the card
	if(!this.posz){ this.posz = 0 }	//Unless you're playing a "free-form" game, these should be 0,0 in most cases
	if(!this.cards){ this.cards = [] }
	if(!this.style){ this.style = 'facedownPile' } //<'faceupPile'|'facedownPile'|'faceupVert'|'facedownVert'|'faceupHoriz'|'facedownHoriz'|'privatehand'|'protectedhand'|'freeform'>
	
}

v52Set.prototype = {
	
	//Override these in Model/View classes
	add: function(cardID, index){}, //index is absolute if >0, and an offset from the top if <0. An index of 1 means the bottom
	remove: function(cardID){},
	splitOff: function(n, index){}, //index is absolute if >0, and an offset from the top if <0. An index of 1 means the bottom

	shuffle: function(){},
	drawFrom: function()(n, targetSet){}, //targetSet can be 0 for a "free" card that is not in a set
	deal: function()(n, players){}, //convenience function that does a drawFrom n times to each players' hand (default set)
	
	flip: function(){}, //flip all cards in the set

}
