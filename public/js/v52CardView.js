//Decorates a card object to be used client-side

//This implementation uses Kinetic.js
//  API: http://kineticjs.com/docs/symbols/Kinetic.php
v52CardView = function(card){

	card.view = new Kinetic.Rect({ 
                                width: 72,
                                height: 96,
                                fill: "green",
                                stroke: "black",
                                strokeWidth: 0,
                                draggable: true,
				x: card.posx, //These are currenltly without any scaling for client view window size
				y: card.posy
                        });

	card.view.baseToken = new Kinetic.Rect({
				width: 24,
				height: 24,
				fill: "white",
				draggable: false,
				visible: false,
				x: card.posx,
				y: card.posy
			});
	//NOTE: baseToken.image does not get inherited during a Kinetic.Rect.clone()
	card.view.baseToken.image = new Image();
	card.view.baseToken.image.src = "/img/tokens/v52token.png";
	card.view.tokens = new Array();

	card.view.v52_parent = card;
	card.view.image = new Image();
	card.view.setFill({image: v52Instance.cardBack});

	//Functions to manage the tokens
	card.view.hideTokens = function(){
		for (var i=0; i<card.view.tokens.length; i++){
			card.view.tokens[i].setVisible(false);
		}
		v52Instance.layer.draw();
	}
	card.view.showTokens = function(){
		for (var i=0; i<card.view.tokens.length; i++){
			card.view.tokens[i].setX(card.view.getX() + (24 * i));
			card.view.tokens[i].setY(card.view.getY());
			card.view.tokens[i].setVisible(true);
			card.view.tokens[i].moveToTop();
		}
		v52Instance.layer.draw();
	}

	//Raise when touched
	card.view.on('mousedown touchstart dragstart', function(evt){
		this.moveToTop();
		this.hideTokens();
		card.sendUpdate();
	});

	//Flip on dblclick, dbltap
	card.view.on('dblclick dbltap', function(evt){ 
		card.flip();
	});

	//Tell the server when we're being dragged around
	card.view.on('dragmove', function(evt){
		card.sendUpdate();
	});

	//Turn the tokens back on again
	card.view.on('dragend touchend', function(evt){
		this.showTokens();
		card.sendUpdate();
	});

	//Single-click to tokenize a card
	//Clearly this needs to change for touch screens...
	card.view.on('click tap', function(evt){
		this.hideTokens();
		card.tokenize();

		if (card.tokens == 0){
			//Clear previous tokens...
			while(card.view.tokens.length > 0){
				oldToken = card.view.tokens.pop();
				oldToken.destroy();
				v52Instance.layer.draw();
			}
		} else {
			//Add new token to the cardView.tokens[] array
			var newToken = card.view.baseToken.clone();
			newToken.setVisible(true);
			newToken.image = card.view.baseToken.image;
			newToken.setFill({image: card.view.baseToken.image});
			card.view.tokens.push(newToken);
		}
		this.showTokens();
	});

	card.sendUpdate = function(){ 
		card.posx = card.view.attrs.x; //These are currently without any scaling for client view window size
		card.posy = card.view.attrs.y;
		card.posz = card.view.getZIndex();

		v52Client.sendMove(card.cardID, card.posx, card.posy, card.posz);
	}

	//*****CS Would it be better/possible to do this by hooking the Kinetic Draw function? (whatever it's called)
	card.refresh = function(){

		this.view.attrs.x = this.posx; //These are currenltly without any scaling for client view window size
		this.view.attrs.y = this.posy; 

		if(this.facing == 'up'){
			if(this.suit == "Unknown" || this.value == "Unknown"){
				this.view.image.src = "/img/cards-classic/unknown.png";
			}else{
				this.view.image.src = "/img/cards-classic/" + this.value + this.suit + ".png";
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
			this.view.setFill({image: v52Instance.cardBack});
		}

		//Tokenize the card if needed
		for(var t=0; t<this.view.tokens.length; t++){
			var token = this.view.tokens[t];
			v52Instance.layer.add(token);
                        token.moveToTop();
		}

		v52Instance.layer.draw();
	}

	card.flip = function(){ v52Client.flipCard(this.cardID); }

	card.tokenize = function(){ v52Client.tokenizeCard(this.cardID); }

	return card;
}


