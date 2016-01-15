/**
 * lodash math
 * Created by soraping on 15/11/9.
 */
var _ = require('lodash');

/**********  _.add(augend, addend)   **********/
//浮点数
//console.log(_.add(6.12,5.4));    // 11.52
//console.log(_.add(6,3));        // 9




/**********  _.ceil(n, [precision=0])  返回大于或者等于指定表达式的最小整数  **********/
//console.log(_.ceil(4.006));    // 5
//
////第二个参数表示从右往左的位数
//console.log(_.ceil(6.004, 2));    // 6.01
//
//console.log(_.ceil(6040, -2));    // 6100


/**********  _.floor(n, [precision=0])  **********/
//console.log(_.floor(4.006));    // 4



/**********  _.max(collection, [iteratee], [thisArg])  **********/
//参数是一个数组时
//console.log(_.max([4, 2, 8, 6]));      // 8
//
//console.log(_.max([]));        // -Infinity   负无穷

//var users = [
//    { 'user': 'barney', 'age': 36 },
//    { 'user': 'fred',   'age': 40 }
//];
//
//var newData = _.max(users, function(chr) {
//    return chr.age;
//});
//console.log(newData);     // { user: 'fred', age: 40 }
//
//console.log(_.max(users,'age'));   // { user: 'fred', age: 40 }


/**********  _.min(collection, [iteratee], [thisArg])  **********/





/**********  _.round(n, [precision=0]) 四舍五入  **********/

//console.log(_.round(4.006));     // 4
//
//console.log(_.round(4.6));     // 5



/**********  _.sum(collection, [iteratee], [thisArg])  **********/

//console.log(_.sum([4, 6]));     // 10
//
//console.log(_.sum({ 'a': 4, 'b': 6 }));    //10
//
//var objects = [
//    { 'n': 4 },
//    { 'n': 6 }
//];
//var sum = _.sum(objects,function(obj){
//    return obj.n;
//});
//console.log(sum);   // 10
//
////第二个参数是需要累加的属性名
//console.log(_.sum(objects,'n'));   // 10




