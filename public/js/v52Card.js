v52Card = function(config){ 

	for (prop in config){
		this[prop] = config[prop];
	}

	if(!this.cardID){ this.cardID = 0 } //*****CS This should probably be an exception, but we haven't designed an exception model yet
	if(!this.owner){ this.owner = 'Anyone'} //Must be Player # or 'Anyone'
	if(!this.suit){ this.suit = 'Unknown'}  //Must be H, C, S, D, or Unknown
	if(!this.value){ this.value = 'Unknown'} //Must be A,2-10,J,Q,K or Unknown
	if(!this.facing){ this.facing = 'down'}  //Must be 'up' or 'down'
	if(!this.posx){ this.posx = 0 } //These are "Virtual" co-ordinates, not necesarrily the physical pixel coords on the client	
	if(!this.posy){ this.posy = 0 } //If the card becomes part of a set, these become an offset from the set's default layout position of the card
	if(!this.posz){ this.posz = 0 }	//Unless you're playing a "free-form" game, these should be 0,0 in most cases
	if(!this.tokens){ this.tokens = 0 } //Initial card tokens
}

v52Card.prototype = {

	//Override this in Model/View classes
	flip: function(){},
	tokenize: function(){},

}
