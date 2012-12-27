//Decorates a card object to be used client-side
v52CardView = function(card){

	card.view = new Kinetic.Rect({ 
                                width: 72,
                                height: 96,
                                fill: "green",
                                stroke: "black",
                                strokeWidth: 1,
                                draggable: true,
				x: card.posx, //These are currenltly without any scaling for client view window size
				y: card.posy
                        });

	card.view.v52_parent = card;
	card.view.image = new Image();
	card.view.on('dblclick', 	
		function(evt){ 
			this.v52_parent.flip();
			this.v52_parent.refresh();
		}
	);

	//*****CS Would it be better/possible to do this by hooking the Kinetic Draw function? (whatever it's called)
	card.refresh = function(){
		if(this.facing == 'up'){
			if(this.suit == "Unknown" || this.value == "Unknown"){
				this.view.image.src = "img/cards-classic/unknown.png";
			}else{
				this.view.image.src = "img/cards-classic/" + this.value + this.suit + ".png";
			}
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

	//Override the default face_up() action
/*	card.faceUp(){
		if(this.suit == 'Unknown' OR this.value == 'Unknown'){
			v52Client.flipCard(this.cardId);
		}
	}
*/
	return card;
}


