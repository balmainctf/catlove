var http = require('http');

var url = 'http://www.ttmai.com/list/10041001';

http.get(url,function(res){
	var html = '';

	res.on('data',function(data){
		html += data;
	});

	res.on('end',function(){
		console.log(html);
	});

}).on('error',function(){
	console.log('error');
});

