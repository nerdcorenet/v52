v52Card = function(value, suit, facing){ 

	this.suit = suit ? suit : 'Unknown'; //Should be H, C, S, D, or Unknown
	this.value = value ? value : 'Unknown'; //Should be A,2-10,J,Q,K or Unknown
	this.face = facing ? facing : 'down'; //Should be'up' or 'down'
}

v52Card.prototype = {

	faceUp: function(){
		this.face = 'up';
	},

	faceDown: function(){
		this.face = 'down';
	},

	flip: function(){
		if(this.face == 'down'){
			this.faceUp();
		}else{
			this.faceDown();
		}
	},
}
