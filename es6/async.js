/**
 * es6 异步操作和Async函数
 * Created by soraping on 16/4/11.
 */
//var fetch = require('node-fetch');
//
//function* gen(){
//    var url = 'https://api.github.com/users/github';
//    var result = yield fetch(url);
//    console.log(result.bio);
//}
//
//var g = gen();
//var result = g.next();
//
//console.log(result);
//
//result.value.then(function(data){
//    return data.json();
//}).then(function(data){
//    g.next(data);
//});

var co = require('co');
var fs = require('fs');

var readFile = function (fileName){
    return new Promise(function (resolve, reject){
        fs.readFile(fileName, function(error, data){
            if (error) reject(error);
            resolve(data);
        });
    });
};

//var gen = function* (){
//    var f1 = yield readFile('./app.js');
//    var f2 = yield readFile('./array.js');
//    console.log(f1.toString());
//    console.log(f2.toString());
//};
//
//co(gen).then(function (){
//    console.log('Generator 函数执行完成');
//});

var asyncReadFile = async function(){
    var f1 = await readFile('./app.js');
    var f2 = await readFile('./array.js');
    console.log(f1.toString());
    console.log(f2.toString());
};

asyncReadFile();