v52.Card = function(value, suit){ 

	this.suit = suit;
	this.value = value;
	this.face = 'down';

	this.visual = new Kinetic.Rect({ 
                                width: 72,
                                height: 96,
                                fill: "green",
                                stroke: "black",
                                strokeWidth: 1,
                                draggable: true,
				x: 0,
				y: 0
                        });

	this.visual.v52_parent = this;
	this.visual.image = new Image();
	this.visual.image.src = "img/cards-classic/" + this.value + this.suit + ".png";
	this.visual.on('dblclick', 	
		function(evt){ 
			this.v52_parent.flip();
		}
	);

}

v52.Card.prototype = {

	faceUp: function(){
		this.face = 'up';
		this.visual.setFill({image: this.visual.image});
	},

	faceDown: function(){
		this.face = 'down';
		this.visual.setFill("green");
	},

	flip: function(){
		if(this.face == 'down'){
			this.faceUp();
		}else{
			this.faceDown();
		}
	},
}
