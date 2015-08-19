var http = require('http');
var jade = require('jade');

http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});

	//1.compile
	// var fn = jade.compile('div #{course}',{});
	// var html = fn({course:'shengchengde compile html'});

	//2.compileFile
	//var fn = jade.compileFile('demo002.jade',{});
	//var html = fn({course:'shengchengde compile html'});

	//3.jade.render
	//var html = jade.render('div #{course}',{course:'shengchengde render html'});

	//5.jade.renderFile
	var html = jade.renderFile('demo001.jade',{course:'shengchengde renderFile html',pretty:true});

	res.end(html);
}).listen(1337,'127.0.0.1');

console.log('serve running');