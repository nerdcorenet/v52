exports.init = function(app){

  app.post('/newGame', function(req, res){
	
	res.render('table', { gameHash: req.param('gameHash') });
  });

  //A page that asks for your name and posts to same URL
  app.get('/join/:gameHash', function(req, res){
	res.render('table', { gameHash: req.param('gameHash') });
  });

  //Actually joins you to a game
  app.post('/join/:gameHash', function(req, res){

  });

}
