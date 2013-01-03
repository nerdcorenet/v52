//Data-only object representing the entire game state
v52Game = function(){
	
        this.players = {}; //Player objects indexed by player# AND name
        this.allCards = { 0: {}}; //v52Card objects indexed by ObjID
        this.allSets = {0: {}}; //For when we implement sets	
}

v52Game.prototype = {}
