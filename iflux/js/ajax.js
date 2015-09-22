/**
 * Created by Administrator on 2015/9/22.
 */
var $ = require('jquery');
var myAjax = {
    ajax:function(opt){
        //定义promise对象
        var promise = new Promise(function(resolve, reject){
            $.ajax({
                type: opt.type || 'get',
                url: opt.url,
                data: opt.data || {},
                dataType: 'json'
            }).done(function(jsonData){
                resolve(jsonData);
            }).fail(function (e){
                reject(e);
            });
        });
        return promise;
    }
};

module.exports = myAjax;