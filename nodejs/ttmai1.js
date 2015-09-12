var http = require('http');
var cheerio = require('cheerio');
var fs = require('fs');
var url = 'http://www.ttmai.com/list/10041002';

function filterChar(html){
	var $ = cheerio.load(html);

	var goodsList = $('li.goodsBox'); 

	var listData = [];

	goodsList.each(function(item){
		var li = $(this).children();
		var imgDom = li.children().eq(0).find('img');
		var href = imgDom.parent().attr('href');
		var imgUrl = imgDom.attr('src');

		var temImg = li.children().eq(1).find('li');
		var temImgData = [];
		temImg.each(function(ii){
			var d = $(this)
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

http.get(url,function(res){
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

		fs.writeFile('./data.js', data, function (e) {
			console.log('ok');
		});
	});

}).on('error',function(){
	console.log('error');
});

