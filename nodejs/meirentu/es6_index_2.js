/**
 * 超级图片爬虫
 * Created by soraping on 16/6/28.
 */
let fs = require('fs');
let path = require('path');
let cheerio = require('cheerio');
let request = require('./request.js');

let startPageNum = 1;
let lastPageNum = 2;
let reqUrl = 'http://www.pic177.com/html/2015/07/923717.html';

let getPage = async (url)=>{
    let res;
    try{
        console.log('请求URL===》'+url);
        console.log('开始请求页面...');
        res = await request(url,{
            timeout:5000
        });
    }catch(e){
        console.error('请求页面异常=====>',e);
        return;
    }
    if(res && res.status == 200){
        //拿到body字符串
        let body = res.data.toString();
        //解析页面body
        let $ = cheerio.load(body);
        //解析指定位置图片数组
        let meiren = $('.entry-content p img').toArray();
        await acquireData(meiren);
    }

};

/**
 * 解析数组对象
 * @param imgArr
 */
let acquireData = async (imgArr) => {
    for(let i=0,len=imgArr.length;i<len;i++){
        let imgSrc = imgArr[i].attribs.src;
        let filename = parseUrlForFileName(imgSrc);
        console.log('开始下载图片'+filename);
        await downloadImg(imgSrc,filename);
        console.log(filename+"下载完成");
    }
};
/**
 * 重命名
 * @param address
 * @returns {*}
 */
let parseUrlForFileName = (address) => {
    let filename = path.basename(address);
    return filename;
};

/**
 * 下载图片
 * @param url
 * @param filename
 */
let downloadImg = async (url, filename) => {
    //stream stream.Writable类型
    let writeAble = fs.createWriteStream('images/'+filename);
    try{
        await request(url,{
            writeStream:writeAble
        });
    }catch(e){
        console.error(filename + '图片保存错误');
    }
};

/**
 * 分页循环
 * @param start 开始页码
 * @param last  结束页码
 * @param reqUrl 请求url
 */
var queryPage = async (startPageNum,lastPageNum,reqUrl) => {
    for(let i=startPageNum;i<lastPageNum+1;i++){
        let url = reqUrl + '/' + i;
        console.log('第' + i + '页开始');
        await getPage(url);
        console.log('第' + i + '页结束');
    }
    console.log('爬取结束');
};

/**
 * 调用
 */
queryPage(startPageNum,lastPageNum,reqUrl);