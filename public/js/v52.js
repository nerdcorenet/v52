//JQuery event handler
$(document).ready(function() {  
    v52Instance = new v52();
});  

v52 = function(){

	this.stage =  new Kinetic.Stage({
		container: 'cardTable',
		width: 800,
		height: 600
	});
	this.layer = new Kinetic.Layer();
	this.stage.add(this.layer);
	this.cardBack = new Image();
	this.cardBack.src = "img/backs/bkkgraff.png";

	v52Client.init();
	v52ChatClient.init();
}

v52.prototype = {

};

