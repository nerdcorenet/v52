var crypto = require('crypto');

exports.init = function(app){

  app.post('/new', function(req, res){

	//Generate a new gameID similar to how socket.io makes IDs
	var rand = new Buffer(15);
	rand.writeInt32BE((new Date()).getTime() | 0, 11);
	crypto.randomBytes(12).copy(rand);
	var gameID = rand.toString('base64').replace(/\//g, '_').replace(/\+/g, '-');

	//*****CS IMPORTANT: THESE OBJECTS LEAK. There is nothing (yet!) that cleans up games
	var engine = require('../v52Engine.js');
	engine.init(gameID);
	var chat = require('../v52Chat.js');
	chat.init(engine);

	engine.game.players.push(req.param('name'));

	global.games.push({ gameID: gameID, owner: req.param('name'), startTime: new Date() });

	res.render('table', { gameID: gameID });
  });

  //A page that asks for your name and posts to same URL
  app.get('/join/:gameID', function(req, res){
	res.render('table', { gameID: req.param('gameID') });
  });

  //Actually joins you to a game
  app.post(/\/join\/:gameID|\/join/, function(req, res){
	res.render('table', { gameID: req.param('gameID') });
  });

}
