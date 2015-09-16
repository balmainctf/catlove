/**
 * Created by Administrator on 2015/9/14.
 */
var Robot = require("./robot.js");
var oOptions = {
    domain:'ttmai.com', //抓取网站的域名
    firstUrl:'http://www.ttmai.com/', //抓取的初始URL地址
    saveDir:"D:\\wwwroot/ttmai/", //抓取内容保存目录
    debug:true //是否开启调试模式
};
var o = new Robot(oOptions);
o.crawl(); //开始抓取