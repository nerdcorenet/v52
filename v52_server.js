var static = require('node-static');
var file = new(static.Server)('.');

require('http').createServer(function (request, response) {
  request.addListener('end', function () {
    file.serve(request, response);
  });
}).listen(5252); //Need a command line arg for the port #
