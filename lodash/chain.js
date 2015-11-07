/**
 * lodash chain 链式
 * Created by Administrator on 2015/11/7.
 */
var _ = require('lodash');

/****** _(value) *******/
//var wrapped = _([1, 2, 3]);     //lodash对象
//var sub = wrapped.reduce(function(total, n) {
//            return total + n;
//        });
//console.log(sub);
//
//var squares = wrapped.map(function(n) {
//    return n * n;
//});
//
//console.log(squares);
//console.log(squares.value());
//
//console.log(_.isArray(squares));
//
//console.log(_.isArray(squares.value()));


/****** _.chain(value) *******/
//var users = [
//    { 'user': 'barney',  'age': 36 },
//    { 'user': 'fred',    'age': 40 },
//    { 'user': 'pebbles', 'age': 1 }
//];
//var youngest = _.chain(users)
//    //按照年龄排序
//    .sortBy('age')
//    //遍历
//    .map(function(chr) {
//        return chr.user + ' is ' + chr.age;
//    })
//    //选择第一个
//    .first()
//    //输出值
//    .value();
//console.log(youngest);    // pebbles is 1


/****** _.tap(value, interceptor, [thisArg]) *******/
//var wrapped = _([1, 2, 3]);
//var arr = wrapped
//            .tap(function(array) {
//                //pop()数组中最后压栈的的一个元素
//                array.pop();
//            })
//            //数组反转
//            .reverse()
//            //值输出
//            .value();
//console.log(arr);     // [2,1]


/****** _.thru(value, interceptor, [thisArg])  将值转换为  *******/
//var wrapped = _(' abc ');
//var arr = wrapped
//            .chain()
//            .trim()
//            .thru(function(value){
//                return [value];
//                //return {value};
//            })
//            .value();
//console.log(arr);



/****** _.prototype.chain()  *******/
var users = [
    { 'user': 'barney', 'age': 36 },
    { 'user': 'fred',   'age': 40 }
];







