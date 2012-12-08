//JQuery event handler
$(document).ready(function() {  
    v52Instance = new v52();
});  

v52 = function(){
	this.stage =  new Kinetic.Stage({
		container: 'cardTable',
		width: 800,
		height: 600
	})

	this.layer = new Kinetic.Layer();

	this.stage.add(this.layer);

	this.chatInit();

}

v52.prototype = {

	drawDeck: function (){
		var allCards = [];
		var suits = ["C","S","H","D"]; 
		for(var v=2; v!="DONE"; ){
			for(var s in suits){
				allCards.push([v.toString(),suits[s]]);
			}
			if(v < 10){
				v += 1;
			}else{
				switch(v){
					case 10: v = "J"; break;
					case "J": v = "Q"; break;
					case "Q": v = "K"; break;
					case "K": v = "A"; break;
					case "A": v = "DONE"; break;
				}
			}
		}
		var i = 0;
		while(allCards.length > 0){
			var cardId = (allCards.splice(Math.random() * allCards.length, 1))[0];
			var card = v52.CardView(new v52.Card(cardId[0], cardId[1]));
			card.view.attrs.x += i++ * 3;
			this.layer.add(card.view);
		}
		this.layer.draw()
	},

	chatInit: function(){

		//Hook up our mighty websocket
		try{
			this.chatSocket = io.connect('/chat');
		}catch(exception){
			$('#chatLog').append('<p class="warning"> Error:' + exception);
		}

		//Hook receive message
		this.chatSocket.on('msg', this.recv);

		//Hook the input box
		$('#chattext').keypress(function(event){ 
			if (event.keyCode == '13'){
				v52Instance.send();
			}
		});
	},

	send: function(){  

		var text = $('#chattext').val();  
		if(text==""){  
			$('#chatLog').append('<p class="warning">Please enter a message');  
			return;  
		}  
		try{  
			this.chatSocket.emit('msg', text);
		} catch(exception){  
			$('#chatLog').append('<p class="warning"> Error:' + exception);  
		}  
		$('#chattext').val("");  
	},

	recv: function(msg){
		$('#chatLog').append("<p>" + msg +"</p>")
	}
 
};

