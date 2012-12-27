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
					//Unless you're playing a "free-form" game, these should be 0,0 in most cases
}

v52Card.prototype = {

	faceUp: function(){
		this.facing = 'up';
	},

	faceDown: function(){
		this.facing = 'down';
	},

	flip: function(){
		if(this.facing == 'down'){
			this.faceUp();
		}else{
			this.faceDown();
		}
	},

	//Returns a version of a card suitable for the client seeing it
	strip: function(who){

		//Currently does not deal with card ownership, which is a rules things and we don't yet have rules
		if(who == 'Anyone'){
			if(this.facing == 'up'){ return this; }

			var safeCard = new v52Card(this);
			safeCard.suit = 'Unknown';
			safeCard.value = 'Unknown';
			return safeCard;
		}

	}

}
