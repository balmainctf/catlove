/**
 * lodash collection   集合方法
 * Created by soraping on 15/11/9.
 */
var _ = require('lodash');


/******* _.at(collection, [props])  挑选数组中的元素，组成新的数组,
 * 可以是闭区间，也可以是两个数字，如果越界，则显示undefined  *******/
//console.log(_.at([1,2,3,4,5],[0,3]));   //[ 1, 4 ]
//console.log(_.at(['barney', 'fred', 'pebbles'], 0, 2));   //[ 'barney', 'pebbles' ]



/****** _.indexBy(collection, [iteratee=_.identity], [thisArg]) 对象按照某个属性值进行重新组合
 * 给定一个list，和 一个用来返回一个在列表中的每个元素键 的iterator 函数（或属性名），
 * 返回一个每一项索引的对象。和groupBy非常像，但是当你知道你的键是唯一的时候可以使用indexBy 。*******/
//var keyData = [
//    { 'dir': 'left', 'code': 97 },
//    { 'dir': 'right', 'code': 100 }
//];
//console.log(_.indexBy(keyData,'dir')); //{ left: { dir: 'left', code: 97 },right: { dir: 'right', code: 100 } }
//
//var newDate1 = _.indexBy(keyData,function(object){
//    //遍历了数组对象
//    console.log(object);
//    return String.fromCharCode(object.code);
//});
//console.log(newDate1); //{ a: { dir: 'left', code: 97 }, d: { dir: 'right', code: 100 } }




/****** _.groupBy(collection, [iteratee=_.identity], [thisArg])
 * 把一个集合分组为多个集合，通过 iterator 返回的结果进行分组.
 * 如果 iterator 是一个字符串而不是函数, 那么将使用 iterator 作为各元素的属性名来对比进行分组. *******/
//var newData = _.groupBy([4.6,6.3,6.7,4.1],function(n){
//    return Math.floor(n);
//});
//console.log(newData);    //{ '4': [ 4.6, 4.1 ], '6': [ 6.3, 6.7 ] }



/****** _.countBy(collection, [iteratee=_.identity], [thisArg])
 * 排序一个列表组成一个组，并且返回各组中的对象的数量的计数。类似groupBy，但是不是返回列表的值，而是返回在该组中值的数目。*******/
//var newData = _.countBy([1, 2, 3, 4, 5], function(num) {
//    //区分奇偶数
//    return num % 2 == 0 ? 'even': 'odd';
//});
//console.log(newData);    //{ odd: 3, even: 2 }





/****** _.pluck(collection, path)  萃取对象数组中某属性值，返回一个数组
 * pluck也许是map最常使用的用例模型的简化版本，即萃取数组对象中某属性值，返回一个数组。*******/
//var users = [
//    { 'user': 'barney', 'age': 36 },
//    { 'user': 'fred',   'age': 40 }
//];
//console.log(_.pluck(users,'user'));    //[ 'barney', 'fred' ]
//
//var userIndex = _.indexBy(users, 'user');
//
//console.log(userIndex);   //{ barney: { user: 'barney', age: 36 },fred: { user: 'fred', age: 40 } }
////能够递归查询
//console.log(_.pluck(userIndex, 'age'));   //[ 36, 40 ]




/****** _.every(collection, [predicate=_.identity], [thisArg]) 匹配所有，所有通过返回真，返回布尔 *******/





/****** _.filter(collection, [predicate=_.identity], [thisArg]) 过滤 *******/
//var arr = _.filter([4,5,6,7],function(n){
//    return n % 2 == 0;
//});
//console.log(arr);       // [ 4, 6 ]

//var users = [
//    { 'user': 'barney', 'age': 36, 'active': true },
//    { 'user': 'fred',   'age': 40, 'active': false }
//];
//
////匹配出一个对象,返回一个数组
//var user1 = _.filter(users,{'age': 36, 'active': true });
//
//console.log(user1);      //[ { user: 'barney', age: 36, active: true } ]
//
//console.log(_.pluck(user1,'user'));    //[ 'barney' ]


//var user2 = _.filter(users,'active');
//
//console.log(user2);    //[ { user: 'barney', age: 36, active: true } ]
//
//console.log(_.pluck(user2,'user'));  //[ 'barney' ]




/****** _.reject(collection, [predicate=_.identity], [thisArg]) 返回list中没有通过predicate真值检测的元素集合，与filter相反。 *******/





/****** _.find(collection, [predicate=_.identity], [thisArg])  根据查询条件查询，返回相应对象
 * 在list中逐项查找，返回第一个通过predicate迭代函数真值检测的元素值，如果没有值传递给测试迭代器将返回undefined。
 * 如果找到匹配的元素，函数将立即返回，不会遍历整个list。*******/
//var users = [
//    { 'user': 'barney',  'age': 36, 'active': true },
//    { 'user': 'fred',    'age': 40, 'active': false },
//    { 'user': 'pebbles', 'age': 1,  'active': true }
//];

//var user1 = _.find(users,function(chr){
//    return chr.age < 40;
//});
//console.log(user1);     //{ user: 'barney', age: 36, active: true }
//console.log(_.result(user1,'user'));    //barney

//var user2 = _.find(users,{'age': 1,  'active': true });
//console.log(user2);  //{ user: 'pebbles', age: 1, active: true }
//console.log(_.result(user2,'user'));  //pebbles


//var user3 = _.find(users,'active',false);
//console.log(user3);   //{ user: 'fred', age: 40, active: false }
//console.log(_.result(user3,'user'));   //fred


//var user4 = _.find(users,'active');
//console.log(user4);  //{ user: 'barney', age: 36, active: true }
//console.log(_.result(user4,'user'));   //barney


/****** _.findLast(collection, [predicate=_.identity], [thisArg])  返回筛选条件的数组元素  *******/
//var str = _.findLast([1,2,3,4],function(n){
//    //取模为1的数组元素
//    return n % 2 == 1;
//});
//console.log(str);    // 3





/****** _.findWhere(collection, source)
 * 遍历整个list，返回匹配 properties参数所列出的所有 键 - 值 对的第一个值。
 * 如果没有找到匹配的属性，或者list是空的，那么将返回undefined。 *******/
//var users = [
//    { 'user': 'barney', 'age': 36, 'active': true },
//    { 'user': 'fred',   'age': 40, 'active': false }
//];
//var user1 = _.findWhere(users,{'age': 36, 'active': true});
//console.log(user1);     //{ user: 'barney', age: 36, active: true }
//console.log(_.result(user1,'user'));    //barney



/****** _.forEach(collection, [iteratee=_.identity], [thisArg])  *******/
//var users = [
//    { 'user': 'barney', 'age': 36, 'active': true },
//    { 'user': 'fred',   'age': 40, 'active': false }
//];
//
//_.forEach(users[0],function(value,key){
//    console.log(key + '=>' + value)
//});


/****** _.forEachRight(collection, [iteratee=_.identity], [thisArg])  对象从右往左遍历  *******/






/****** _.includes(collection, target, [fromIndex=0]) 对象中是否包含某个元素或者值  *******/
//console.log(_.includes([1,2,3],1));    //true
//
////第三个参数表示从下标是2的元素开始
//console.log(_.includes([1,2,3],1,2));   //false
//
////json也可以判断值
//console.log(_.includes({ 'user': 'fred', 'age': 40 }, 'fred'));   //true
//
//console.log(_.includes('pebbles', 'eb'));   //true




/****** _.invoke(collection, path, [args])
 * 在list的每个元素上执行path方法。 任何传递给invoke的额外参数，invoke都会在调用path方法的时候传递给它。
 * 第三个参数是path方法的参数*******/

//console.log(_.invoke([[5, 1, 7], [3, 2, 1]], 'sort'));    //[ [ 1, 5, 7 ], [ 1, 2, 3 ] ]
//
//console.log(_.invoke([123, 456], String.prototype.split, ''));   //[ [ '1', '2', '3' ], [ '4', '5', '6' ] ]



/****** _.map(collection, [iteratee=_.identity], [thisArg])
 * 通过转换函数(iteratee迭代器)映射列表中的每个值产生价值的新数组。
 * iteratee传递三个参数：value，然后是迭代 index(或 key 愚人码头注：如果list是个JavaScript对象是，这个参数就是key)，
 * 最后一个是引用指向整个list。*******/
//var arr1 = _.map([1,2],function(n){
//    return n * 4;
//});
//console.log(arr1);   //[ 4, 8 ]
//
//
//var arr2 = _.map({ 'a': 1, 'b': 2 },function(n){
//    return n * 4;
//});
//console.log(arr2);   //[ 4, 8 ]
//
//
//var users = [
//    { 'user': 'barney' },
//    { 'user': 'fred' }
//];
//
//console.log(_.map(users, 'user'));     //[ 'barney', 'fred' ]




/****** _.partition(collection, [predicate=_.identity], [thisArg])
 * 拆分一个数组（array）为两个数组：  第一个数组其元素都满足predicate迭代函数， 而第二个的所有元素均不能满足predicate迭代函数。*******/
//var arr1 = _.partition([1,2,3],function(n){
//    return n % 2;
//});
//console.log(arr1);    //[ [ 1, 3 ], [ 2 ] ]
//
//var arr2 = _.partition([1.2, 2.3, 3.4], function(n) {
//    return this.floor(n) % 2;
//}, Math);
//console.log(arr2);   //[ [ 1.2, 3.4 ], [ 2.3 ] ]





/****** _.reduce(collection, [iteratee=_.identity], [accumulator], [thisArg])
 * 别名为 inject 和 foldl, reduce方法把list中元素归结为一个单独的数值。
 * accumulator是reduce函数的初始值，reduce的每一步都需要由iteratee返回。
 * 这个迭代传递4个参数：memo,value 和 迭代的index（或者 key）和最后一个引用的整个 list。
 *
 * 如果没有accumulator传递给reduce的初始调用，iteratee不会被列表中的第一个元素调用。
 * 第一个元素将取代 传递给列表中下一个元素调用iteratee的memo参数。*******/
//var sum1 = _.reduce([1, 2], function(total, n) {
//    return total + n;
//});
//console.log(sum1);    //3


//var sum = _.reduce([1, 2, 3], function(memo, num){
//    console.log(memo +'=>'+ num);
//    return memo + num;
//},0);
//console.log(sum);  //6




/****** _.reduceRight(collection, [iteratee=_.identity], [accumulator], [thisArg])  _.reduce从右往左  *******/





/****** _.sample(collection, [n]) 从 list中产生一个随机样本。传递一个数字表示从list中返回n个随机元素。否则将返回一个单一的随机项。 *******/
//console.log(_.sample([1, 2, 3, 4]));
//
////随机返回两个元素的数组
//console.log(_.sample([1, 2, 3, 4], 2));






/****** _.shuffle(collection) 返回一个随机乱序的 list 副本  *******/
//console.log(_.shuffle([1, 2, 3, 4]));





/****** _.size(collection)  返回对象长度  *******/
//console.log(_.size([1, 2, 3]));  //3
//console.log(_.size({ 'a': 1, 'b': 2 }));  //2
//
////字符串的情况返回字符串的长度
//console.log(_.size('pebbles'));    //7



/****** _.some(collection, [predicate=_.identity], [thisArg])
 * 如果list中有任何一个元素通过 predicate 的真值检测就返回true。一旦找到了符合条件的元素, 就直接中断对list的遍历.  *******/
//var users = [
//    { 'user': 'barney', 'active': true },
//    { 'user': 'fred',   'active': false }
//];
//console.log(_.some(users, { 'user': 'barney', 'active': false }));   //false
//console.log(_.some(users, { 'user': 'barney', 'active': true }));   //true



/****** _.sortBy(collection, [iteratee=_.identity], [thisArg]) 返回一个排序后的list拷贝副本。
 * 如果传递iteratee参数，iteratee将作为list中每个值的排序依据。迭代器也可以是字符串的属性的名称进行排序的(比如 length) *******/
//第三个参数是fun内部的this指向
//var newArr = _.sortBy([1, 2, 3], function(n) {
//    return this.sin(n);
//}, Math);
//console.log(newArr);    //[ 3, 1, 2 ]

//var users = [
//    { 'user': 'fred' },
//    { 'user': 'pebbles' },
//    { 'user': 'barney' }
//];
////按照用户名排序
//var newArr2 = _.sortBy(users,'user');
//console.log(newArr2); //[ { user: 'barney' }, { user: 'fred' }, { user: 'pebbles' } ]
//console.log(_.pluck(newArr2,'user'));  //[ 'barney', 'fred', 'pebbles' ]



/****** _.sortByAll(collection, iteratees)  *******/









/****** _.sortByOrder(collection, iteratees, [orders])  *******/




/****** _.where(collection, source)  *******/
//var users = [
//    { 'user': 'barney', 'age': 36, 'active': false, 'pets': ['hoppy'] },
//    { 'user': 'fred',   'age': 40, 'active': true, 'pets': ['baby puss', 'dino'] }
//];
//var newArr1 = _.where(users,{'age': 36, 'active': false },'user');
//console.log(newArr1);     // [ { user: 'barney', age: 36, active: false, pets: [ 'hoppy' ] } ]
//console.log(_.pluck(newArr1,'user'));    //[ 'barney' ]



