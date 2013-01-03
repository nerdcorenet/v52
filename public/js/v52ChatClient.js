v52ChatClient = {};

v52ChatClient.init = function (gameID){

	//Hook up our mighty websocket
	try{
		this.chatSocket = io.connect('/chat/' + gameID);
	}catch(exception){
		$('#chatLog').append('<p class="warning"> Error:' + exception);
	}

	//Hook receive message
	this.chatSocket.on('msg', this.recv);

	//Hook the input box
	$('#chatText').keypress(function(event){ 
		if (event.keyCode == '13'){
			v52ChatClient.send();
		}
	});
};

v52ChatClient.send = function (){

	var text = $('#chatText').val();  
	if(text==""){  
		$('#chatLog').append('<p class="warning">Please enter a message');  
		return;  
	}  

	try{  
		this.chatSocket.emit('msg', text);
	} catch(exception){  
		$('#chatLog').append('<p class="warning"> Error:' + exception);  
	}  

	$('#chatText').val("");  
};

v52ChatClient.recv = function (m){

	$('#chatLog').append('<p class="chatLine">' + m +"</p>");
	$("#chatLog").scrollTop($("#chatLog").scrollTop() + 100);
};
