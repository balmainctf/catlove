/**
 * Created by Administrator on 2015/9/18.
 */
var $ = require('jquery');

var getData = module.exports = {};

getData.getName = function(data){
    console.log(data);
    //设置延时对象
    var deferred = $.Deferred();
    $.ajax({
        type: 'GET',
        url: '/data.json',
        data: data
    }).done(function(jsonData){
        deferred.resolve(jsonData);
    }).fail(function (e){
        deferred.reject(e);
    });
    return deferred.promise();
}