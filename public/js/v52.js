
v52 = function(gameID){

	this.stage =  new Kinetic.Stage({
		container: 'cardTable',
		width: 800,
		height: 600
	});
	this.layer = new Kinetic.Layer();
	this.stage.add(this.layer);
	this.cardBack = new Image();
	this.cardBack.src = "/img/backs/bkkgraff.png";
	this.cardMaxTokens = 12;

	v52Client.init(gameID);
	v52ChatClient.init(gameID);
}

v52.prototype = {

};

