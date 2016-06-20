/**
 * 美人图爬虫
 * Created by Administrator on 2016/6/20.
 */
var fs = require('fs');
var path = require('path');
var request = require('request');
var cheerio = require('cheerio');
var pageNum = 1;
var reqUrl = 'http://www.twfun.info/html/2013/11/11059.html';
//for(var j=1;j<28;j++){
//    if(j != 1){
//        reqUrl = reqUrl + '/' + j;
//    }
//    request(reqUrl, function (error, response, body) {
//        if (!error && response.statusCode == 200) {
//            //返回请求页面的HTML
//            acquireData(body);
//        }
//    });
//}
request(reqUrl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        //返回请求页面的HTML
        //console(body);
        //cheerio解析body
        var $ = cheerio.load(body);
        //目标DOM
        var meiren = $('.entry-content p img').toArray();
        acquireData(meiren,0);
    }
});

function acquireData(meiren,i){
    var imgsrc = meiren[i].attribs.src;
    //资源重命名
    var filename = parseUrlForFileName(imgsrc);
    downloadImg(imgsrc,filename,function() {
        console.log(filename + ' done');
        if(meiren[i+1]){
            acquireData(meiren,i+1);
        }else{
            console.log('下一页开始');
            request(reqUrl+'/'+(pageNum++), function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    //返回请求页面的HTML
                    //console(body);
                    //cheerio解析body
                    var $ = cheerio.load(body);
                    //目标DOM
                    var meiren = $('.entry-content p img').toArray();
                    acquireData(meiren,0);
                }
            });
        }
    });

}

function parseUrlForFileName(address) {
    var filename = path.basename(address);
    return filename;
}

var downloadImg = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
        // console.log('content-type:', res.headers['content-type']);  //这里返回图片的类型
        // console.log('content-length:', res.headers['content-length']);  //图片大小
        if (err) {
            console.log('err: '+ err);
            return false;
        }
        console.log("开始下载"+filename);
        request(uri).pipe(fs.createWriteStream('images/'+filename)).on('close', callback);  //调用request的管道来下载到 images文件夹下
    });
};