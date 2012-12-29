//Decorates a card object to be used server-side
v52CardModel = function(card){

        //Returns a version of a card suitable for the client seeing it
	card.strip = function(who){

		//Currently does not deal with card ownership, which is a rules things and we don't yet have rules
		//Should all rules be dealt with in the engine not the card model? Hmmm.... 
		if(who == 'Anyone'){
			if(this.facing == 'up'){ return this; }

			var safeCard = new v52Card(this);
			safeCard.suit = 'Unknown';
			safeCard.value = 'Unknown';
			return safeCard;
		}

	}
	
	return card;
}
