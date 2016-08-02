/**
 * Created by soraping on 16/7/12.
 */
let fs = require('fs');
let path = require('path');
let _ = require('lodash');

var readFile = function (fileName){
    return new Promise(function (resolve, reject){
        fs.readFile(fileName, function(error, data){
            if (error) reject(error);
            resolve(data);
        });
    });
};

var asyncReadFile = async function(){

    var f1 = await readFile('./mobile.txt');
    var str = f1.toString().substr(1);
    str = str.substring(0,str.length-1);
    var mobileArr = str.split('] [');

    //console.log(mobileArr);

    console.log('使用手机总数是:' + mobileArr.length);

    var iphone = _.filter(mobileArr,(item)=>{
        return item.indexOf('iPhone') != -1;
    });
    console.log('使用苹果手机总数是'+ iphone.length);

    var Android = _.filter(mobileArr,(item)=>{
        return item.indexOf('Android') != -1;
    });
    console.log('使用安卓手机总数是'+ Android.length);

    var otherPhone = _.filter(mobileArr,(item)=>{
        return !(item.indexOf('iPhone') != -1 || item.indexOf('Android') != -1);
    });
    console.log('使用其他手机总数是'+ otherPhone.length);

    var inWeixin = _.filter(mobileArr,(item)=>{
        return item.indexOf('MicroMessenger') != -1;
    });
    console.log('使用微信访问的用户数是:' + inWeixin.length);

    var WIFI = _.filter(mobileArr,(item)=>{
        return item.indexOf('NetType/WIFI') != -1;
    });
    console.log('使用wifi访问的用户数是:' + WIFI.length);

    var G4G = _.filter(mobileArr,(item)=>{
        return item.indexOf('NetType/4G') != -1;
    });
    console.log('使用4g访问的用户数是:' + G4G.length);

};

asyncReadFile();