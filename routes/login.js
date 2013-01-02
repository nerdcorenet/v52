exports.init = function(app){

  app.post('/newGame', function(req, res){
	res.render('index', { title: 'I got your new game right here: ' + req.param('name') });
  });

}
