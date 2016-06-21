/**
 * promise版
 * Created by Administrator on 2016/6/20.
 */
let fs = require('fs');
let path = require('path');
let request = require('request');
let cheerio = require('cheerio');
let reqUrl = '';
let pageSize = 25;
/**
 * http://www.twfun.info/html/2015/09/1009656.html
 * http://www.twfun.info/html/2015/07/928358.html
 * http://www.twfun.info/html/2014/03/42817.html
 * http://www.twfun.info/html/2013/12/24665.html
 * http://www.twfun.info/html/2013/12/22099.html
 * http://www.twfun.info/html/2013/12/208867.html
 * http://www.twfun.info/html/2013/12/208866.html
 * http://www.twfun.info/html/2013/12/208865.html
 * http://www.twfun.info/html/2013/12/16097.html
 * http://www.twfun.info/html/2013/11/11163.html
 * @type {string}
 */
let queryUrl = async (pageNum) => {
    console.log('第'+pageNum+'页开始');
    await getPageBody(reqUrl+'/'+pageNum);
};

let getPageBody = (reqUrl) => {
    request(reqUrl, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            //返回请求页面的HTML
            //console(body);
            //cheerio解析body
            //var $ = cheerio.load(body);
            //目标DOM
            (async () => {
                let meiren = cheerio.load(body)('.entry-content p img').toArray();
                await acquireData(meiren);
                console.log('一页完成');
            })();

        }else{
            console.log('页面爬取错误');
        }
    });
};

let acquireData = async (imgArr) => {
    for(let i=0,len=imgArr.length;i<len;i++){
        let imgSrc = imgArr[i].attribs.src;
        //重命名
        let filename = parseUrlForFileName(imgSrc);
        await downloadImg(imgSrc,filename);
    }
};

let parseUrlForFileName = (address) => {
    let filename = path.basename(address);
    return filename;
};

let downloadImg =(uri, filename) => {

    return new Promise((resolve, reject) => {
        request.head(uri, (err, res, body) => {
            // console.log('content-type:', res.headers['content-type']);  //这里返回图片的类型
            // console.log('content-length:', res.headers['content-length']);  //图片大小
            if (err) {
                console.log('err: '+ err);
                return false;
            }
            console.log("开始下载"+filename);
            //调用request的管道来下载到 images文件夹下
            request(uri).pipe(fs.createWriteStream('images/'+filename)).on('close', () => {
                console.log(filename+'下载完成');
                //此处一定要有返回值，否则系统不会默认返回，一直在等待
                resolve(1);
            });
        });
    });

};

(async () => {
    for(let j=pageStart;j<pageSize;j++){
        await queryUrl(j);
    }
})();

//queryUrl(1);