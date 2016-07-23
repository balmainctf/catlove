/**
 * 超级图片爬虫
 * Created by soraping on 16/6/28.
 */
let fs = require('fs');
let path = require('path');
let cheerio = require('cheerio');
let request = require('./request.js');
let _ = require('lodash');

let startPageNum = 1;
let lastPageNum = 23;
let reqUrl = 'http://www.twfun.info/html/2015/07/965213.html';

let errorPage = [];

let getPage = async (url,pageNum,lostImgArr)=>{
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
        await acquireData(meiren,pageNum,lostImgArr);
    }

};

/**
 * 解析数组对象
 * @param imgArr
 */
let acquireData = async (imgArr,pageNum,lostImgArr) => {
    if(lostImgArr){
        for(let i=0,len=lostImgArr.length;i<len;i++){
            let imgSrc = imgArr[lostImgArr[i]].attribs.src;
            let filename = parseUrlForFileName(imgSrc,pageNum,lostImgArr[i]);
            console.log('开始下载图片'+filename);
            await downloadImg(imgSrc,filename);
            console.log(filename+"下载完成");
        }
    }else{
        for(let i=0,len=imgArr.length;i<len;i++){
            let imgSrc = imgArr[i].attribs.src;
            let filename = parseUrlForFileName(imgSrc,pageNum,i);
            console.log('开始下载图片'+filename);
            await downloadImg(imgSrc,filename);
            console.log(filename+"下载完成");
        }
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
        console.error(filename + '图片保存错误，重新开始下载');
        await downloadImg(url,filename);
    }
};

/**
 * 分页循环
 * @param start 开始页码
 * @param last  结束页码
 * @param reqUrl 请求url
 */
let queryPage = async (startPageNum,lastPageNum,reqUrl) => {
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
        for(let j=0,len=errorPage.length;j<len;j++){
            let url = reqUrl;
            if(j > 1){
                url = reqUrl + '/' + j;
            }
            console.log('第' + j + '页开始');
            await getPage(url,j);
            console.log('第' + j + '页结束');
        }
        console.log('重新爬取结束');
    }
};

/**
 * 当某个页面的图片没有下载完成时调用
 * @param arr
 *   [
 *      {pageNum:16,lostImgIndex:[1,2,4,6,8]},
 *      {pageNum:17,lostImgIndex:[],isLostAll:true},
 *   ]
 * @param reqUrl
 */
let queryLostImg = async (arr,reqUrl) => {
    for(let i=0,len=arr.length; i<len; i++){
        let lostPage = arr[i];
        let pageNum = lostPage.pageNum;
        //是否需要请求页面中所有图片
        let isLostAll = lostPage.isLostAll;
        let lostImgIndexArr = (!isLostAll)?lostPage.lostImgIndex:false;
        let url = reqUrl;
        if(pageNum > 1){
            url = reqUrl + '/' + pageNum;
        }
        console.log('第' + pageNum + '页开始');
        await getPage(url,pageNum,lostImgIndexArr);
        console.log('第' + pageNum + '页结束');
    }
    console.log('爬取结束');
};

/**
 * 全局调用
 */
//queryPage(startPageNum,lastPageNum,reqUrl);

let lostImgArr = [
    {pageNum:22,lostImgIndex:[1]},
];

/**
 * 当有图片下载不全时调用
 */
//queryLostImg(lostImgArr,reqUrl);