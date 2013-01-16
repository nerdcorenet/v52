//Data-only object representing the entire game state
v52Game = function(config){

        this.players = []; //Player names
        this.allCards = {}; //v52Card objects **indexed by ObjID**
        this.allSets = {}; //For when we implement sets	

	for(var prop in config){
		this[prop] = config[prop];
	}
	
}
