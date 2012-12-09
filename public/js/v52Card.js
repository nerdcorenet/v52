v52Card = function(config){ 

	for (prop in config){
		this[prop] = config[prop];
	}

	if(!this.suit){ this.suit = 'Unknown'}  //Must be H, C, S, D, or Unknown
	if(!this.value){ this.value = 'Unknown'} //Must be A,2-10,J,Q,K or Unknown
	if(!this.facing){ this.facing = 'down'}  //Must be 'up' or 'down'
	if(!this.owner){ this.owner = 'Anyone'} //Must be a v52GUID

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
}
