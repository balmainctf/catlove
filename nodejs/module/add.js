/**
 * Created by Administrator on 2015/8/31.
 */
var test1 = require('./test1');
var test2 = require('./test2');

var add = function(klass){
    klass.forEach(function(item,index){
        console.log(item);
        test1.add(item.name1);
        test2.add(item.name2);
    });
};

exports.add = add;