var http = require('http');
var cheerio = require('cheerio');
var fs = require('fs');
var url = require('url');
var path = require('path');
var querystring = require('querystring');

//var urlPath = 'http://www.ttmai.com/list/10041002?pageNum=4&pageSize=60';
var toHost = 'www.ttmai.com';
//默认页数从0开始
var pageNum = 0;
var pageSize = 60;
var routhNum = 10041002;

//url路径的json数据
var urlJson = {
    protocol:'http',
    slashes: true,
    auth: null,
    host: toHost,
    port: null,
    hostname: toHost,
    hash: null,
    search: '?pageNum='+pageNum+'&pageSize='+60,
    query: {pageNum:pageNum,pageSize:pageSize},
    path: '/list/'+routhNum+'?pageNum='+pageNum+'&pageSize='+pageSize
};

var urlPath = url.format(urlJson);

getJson(urlPath);

function getJson(urlPath){
    http.get(urlPath,function(res){
        var html = '';

        res.on('data',function(data){
            html += data;
        });

        res.on('end',function(){
            var arr = filterChar(html);
            //console.log(arr);
            var json = {
                goodsList: arr
            };

            var data = 'var data = ' + JSON.stringify(json);

            fs.writeFile('./data.js', data, function (err,data) {
                if(err){
                    console.log(err);
                }else{
                    console.log(data);
                }
            });
        });

    }).on('error',function(){
        console.log('error');
    });
};


function filterChar(html){
	var $ = cheerio.load(html);
	var goodsList = $('li.goodsBox');
    console.log(pageSum);
	var listData = [];
	goodsList.each(function(){
		var li = $(this).children();
		var imgDom = li.children().eq(0).find('img');
		var href = imgDom.parent().attr('href');
		var imgUrl = imgDom.attr('src');

		var temImg = li.children().eq(1).find('li');
		var temImgData = [];
		temImg.each(function(){
			var d = $(this);
			var h = d.find('img').attr('src');
			temImgData.push(h);
		});
		var nameDom = li.children().eq(2).children();
		var name = nameDom.text();
		var priceDom = li.children().eq(3);
		var skuId = priceDom.children().eq(0).val();
		var price = priceDom.children().eq(1).text().replace(/\s/g,'');
		var fr = priceDom.children().eq(2).text();
		var allData = {
			skuId: skuId,
			price: price,
			fr: fr,
			name: name,
			href: href,
			imgUrl:imgUrl,
			temImg: temImgData
		};
		listData.push(allData);
	});
	return listData;
}



