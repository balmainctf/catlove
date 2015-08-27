var http = require('http');

var url = require('url');

http.createServer(function(req,res){
	//200 status
	res.writeHead(200,{'Content-Type':"text/plain"});
	res.end('Hello World\n');
}).listen(5858,'127.0.0.1');
console.log('Server running at port 5858');