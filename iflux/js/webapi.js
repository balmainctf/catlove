/**
 * Created by Administrator on 2015/9/18.
 */
var $ = require('jquery');

var getData = module.exports = {};

var myAjax = require('./ajax.js');


//请求当前的名字
getData.getName = function(){
    var data = {
        type: 'get',
        url: './js/data.json'
    };
    return myAjax.ajax(data).then(function(res){
        console.log(res);
        return res;
    },function(e){
        throw e;
    });
    //设置延时对象
    //var deferred = $.Deferred();
    //$.ajax({
    //    type: 'GET',
    //    url: './js/data.json'
    //}).done(function(jsonData){
    //    deferred.resolve(jsonData);
    //}).fail(function (e){
    //    deferred.reject(e);
    //});
    //return deferred.promise();
}

//按钮点击后，更新当前名字
getData.setName = function(data){
    var deferred = $.Deferred();
    $.ajax({
        type: 'GET',
        url: './js/data1.json',
        data: data
    }).done(function(jsonData){
        deferred.resolve(jsonData);
    }).fail(function (e){
        deferred.reject(e);
    });
    return deferred.promise();
}