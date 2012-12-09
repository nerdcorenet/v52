//Decorates a card object to be used client-side
v52CardView = function(card){

	card.view = new Kinetic.Rect({ 
                                width: 72,
                                height: 96,
                                fill: "green",
                                stroke: "black",
                                strokeWidth: 1,
                                draggable: true,
				x: 0,
				y: 0
                        });

	card.view.v52_parent = card;
	card.view.image = new Image();
	card.view.on('dblclick', 	
		function(evt){ 
			this.v52_parent.flip();
			this.v52_parent.refresh();
		}
	);

	card.refresh = function(){
		if(this.face == 'up'){
			this.view.image.src = "img/cards-classic/" + this.value + this.suit + ".png";
			var updateFn = function (){ 
				card.view.setFill({image: card.view.image});
				v52Instance.layer.draw();
			};

			if(this.view.image.complete){
				updateFn();
			}else{
				this.view.image.onload = updateFn;
			}
		}else{
			this.view.setFill("green");
		}
	}

	return card;
}


