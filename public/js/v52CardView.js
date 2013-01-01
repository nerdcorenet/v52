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

	//Raise when touched
	card.view.on('mousedown touchstart dragstart', function(evt){
		this.moveToTop();
	});

	//Flip on DBLClick
	card.view.on('dblclick', function(evt){ 
		card.flip();
	});

	//Tell the server when we're being dragged around
	card.view.on('dragmove', function(evt){
		card.posx = card.view.attrs.x; //These are currenltly without any scaling for client view window size
		card.posy = card.view.attrs.y;

		v52Client.sendMove(card.cardID, card.posx, card.posy);
	});

	//*****CS Would it be better/possible to do this by hooking the Kinetic Draw function? (whatever it's called)
	card.refresh = function(){

		this.view.attrs.x = this.posx; //These are currenltly without any scaling for client view window size
		this.view.attrs.y = this.posy; 

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
			v52Instance.layer.draw();
		}
	}

	card.flip = function(){ v52Client.flipCard(this.cardID); }

	return card;
}


