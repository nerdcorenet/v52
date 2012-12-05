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
			var card = new v52.Card(cardId[0], cardId[1]);
			card.visual.attrs.x += i++ * 3;
			this.layer.add(card.visual);
		}
		this.layer.draw()
	},

//*****CS All Chat stuff is currently based on a firehose.io implementation that won't work very easily
	chatInit: function(){

		window.WEB_SOCKET_SWF_LOCATION = '/assets/firehose/WebSocketMain.swf';

		this.chatConsumer = new Firehose.Consumer({
			message: function(msg){
				$('#chatLog').append('<p class="message">'+msg+"</p>");
  			},

			connected: function(){
				$('#chatLog').append('<p class="info">Chat Connected</p>');
  			},

			disconnected: function(){
				$('#chatLog').append('<p class="error">Chat Disconnected</p>');
			},

  			error: function(){
				$('#chatLog').append('<p class="error">Chat Error');
  			},
			// Note that we do NOT specify a protocol here because we don't
			// know that yet.
//*****CS hardcoded firehose.io URL
			uri: '//fractalcube.net:7474/test'
		})
		this.chatConsumer.connect();


		$('#chattext').keypress(function(event) {  
		    if (event.keyCode == '13') {  
		        v52Instance.send();  
		    }  
		});  
	},

	send: function(){  
		var text = $('#chattext').val();  
		if(text==""){  
			$('#chatLog').append('<p class="warning">Please enter a message');  
			return ;  
		}  
		try{  
			var xhr = new XMLHttpRequest();
//*****CS hardcoded firehose.io URL
			xhr.open("PUT", "http://fractalcube.net:7474/test", false);
			xhr.send(text);
			alert(xhr.getAllResponseHeaders());
			$('#chatLog').append('<p class="event">Sent: '+text)  
		} catch(exception){  
			$('#chatLog').append('<p class="warning"> Error:' + exception);  
		}  
		$('#chattext').val("");  
	},

 
};

