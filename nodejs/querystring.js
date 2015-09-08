var querystring = require('querystring');

var json1 = {
	name: 'zhangsan',
	age: '30',
	list: ['php','node'],
	search: ''
}

var str1 = querystring.stringify(json1);

console.log(str1);

var str2 = querystring.stringify(json1,',');

console.log(str2);

var str3 = querystring.stringify(json1,',',':');

console.log(str3);

var json2 = querystring.parse(str3,',',':');

console.log(json2);

var str3 = '使用的转意函数';
var escapeStr = querystring.escape(str3);
console.log(escapeStr);

var unEscapeStr = querystring.unescape(escapeStr);
console.log(unEscapeStr);