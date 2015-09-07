var http1 = "http://www.baidu.com";
var http2 = 'http://www.baidu.com/list/item?name=zhangsan&age=30#from';

var url = require('url');

var json1 = url.parse(http1);
console.log(json1);

var json2 = url.parse(http2);
console.log(json2);

var json3 = url.parse(http2,true);
console.log(json3);

var urlStr = url.format(json3);
console.log(urlStr);

var resolvUrl1 = url.resolve(http1,'/search/list');
console.log(resolvUrl1);

var resolvUrl2 = url.resolve(resolvUrl1,'/search2/list2');
console.log(resolvUrl2);