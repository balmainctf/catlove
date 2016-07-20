/**
 * 超级图片爬虫
 * Created by soraping on 16/6/28.
 */
let fs = require('fs');
let path = require('path');
let cheerio = require('cheerio');
let request = require('./request.js');

let startPageNum = 1;
let lastPageNum = 1;
let reqUrl = 'http://www.twfun.info/html/2014/03/46099.html';

let errorPage = [];

let getPage = async (url,pageNum)=>{
    let res;
    try{
        console.log('请求URL===》'+url);
        console.log('开始请求页面...');
        res = await request(url,{
            timeout:5000
        });
    }catch(e){
        console.error('第'+pageNum+'页请求页面异常');
        errorPage.push(pageNum);
        return;
    }
    if(res && res.status == 200){
        //拿到body字符串
        let body = res.data.toString();
        //解析页面body
        let $ = cheerio.load(body);
        //解析指定位置图片数组
        let meiren = $('.entry-content p img').toArray();
        await acquireData(meiren,pageNum);
    }

};

/**
 * 解析数组对象
 * @param imgArr
 */
let acquireData = async (imgArr,pageNum) => {
    for(let i=0,len=imgArr.length;i<len;i++){
        let imgSrc = imgArr[i].attribs.src;
        let filename = parseUrlForFileName(imgSrc,pageNum,i);
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
let parseUrlForFileName = (address,pageNum,index) => {
    //let filename = path.basename(address);
    let filename = "p"+pageNum+'-'+index+'.jpg';
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
        let url = reqUrl;
        if(i > 1){
            url = reqUrl + '/' + i;
        }
        console.log('第' + i + '页开始');
        await getPage(url,i);
        console.log('第' + i + '页结束');
    }
    console.log('爬取结束');
    if(errorPage.length){
        console.log('失败请求页面======>'+errorPage.toString());
    }
};

/**
 * 调用
 */
queryPage(startPageNum,lastPageNum,reqUrl);