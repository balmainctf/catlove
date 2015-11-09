/**
 * lodash object
 * Created by soraping on 15/11/9.
 */

var _ = require('lodash');

/****** _.keys(object) 检索object拥有的所有可枚举属性的名称。  *******/
//console.log(_.keys({one: 1, two: 2, three: 3}));     // [ 'one', 'two', 'three' ]


/****** _.keysIn(object)  *******/
//console.log(_.keys({one: 1, two: 2, three: 3}));    //[ 'one', 'two', 'three' ]


/****** _.mapKeys(object, [iteratee=_.identity], [thisArg])
 * 遍历了对象的Key *******/
//var newData = _.mapKeys({ 'a': 1, 'b': 2 }, function(value, key) {
//    return key + value;
//});
//console.log(newData);   // { a1: 1, b2: 2 }



/****** _.values(object) 返回object对象所有的属性值 *******/
//console.log(_.values({one: 1, two: 2, three: 3}));    // [ 1, 2, 3 ]




/****** _.valuesIn(object) *******/
//console.log(_.valuesIn({one: 1, two: 2, three: 3}));    // [ 1, 2, 3 ]




/****** _.mapValues(object, [iteratee=_.identity], [thisArg]) *******/
//var newData = _.mapValues({ 'a': 1, 'b': 2 }, function(n) {
//    return n * 3;
//});
//console.log(newData);     // { a: 3, b: 6 }




/****** _.merge(object, [sources], [customizer], [thisArg]) *******/
//var users = {
//    'data': [{ 'user': 'barney' }, { 'user': 'fred' }],
//    'other': [{'sex':0},{'sex':1}]
//};
//
//var ages = {
//    'data': [{ 'age': 36 }, { 'age': 40 }]
//};
//console.log(_.merge(users,ages));     //{ data: [ { user: 'barney', age: 36 }, { user: 'fred', age: 40 } ],other: [ { sex: 0 }, { sex: 1 } ] }


//var object = {
//    'fruits': ['apple'],
//    'vegetables': ['beet']
//};
//
//var other = {
//    'fruits': ['banana'],
//    'vegetables': ['carrot']
//};
//
//var newData = _.merge(object, other, function(a, b) {
//    console.log(a);
//    console.log(b);
//    if (_.isArray(a)) {
//        return a.concat(b);
//    }
//});
//
////{ fruits: [ 'apple', 'banana' ],vegetables: [ 'beet', 'carrot' ] }
//console.log(newData);



/****** _.findKey(object, [predicate=_.identity], [thisArg]) 当遇到符合条件的就立即返回跳出循环，返回key *******/
//var users = {
//    'barney':  { 'age': 36, 'active': true },
//    'fred':    { 'age': 40, 'active': false },
//    'pebbles': { 'age': 1,  'active': true }
//};
//
//var newData = _.findKey(users, function(chr) {
//    return chr.age < 40;
//});
////返回第一个符合条件的barney
//console.log(newData);



/****** _.findLastKey(object, [predicate=_.identity], [thisArg]) 与findKey相反 当遇到符合条件的就立即返回跳出循环，返回key *******/
//var users = {
//    'barney':  { 'age': 36, 'active': true },
//    'fred':    { 'age': 40, 'active': false },
//    'pebbles': { 'age': 1,  'active': true }
//};
//
//var newData = _.findLastKey(users,function(chr){
//    return chr.age <40;
//});
//
//console.log(newData);  //pebbles



/****** _.forIn(object, [iteratee=_.identity], [thisArg]) 遍历对象，包括原型链 *******/
//function Foo() {
//    this.a = 1;
//    this.b = 2;
//}
////挂在原型链上
//Foo.prototype.c = 3;
//
//var newData = _.forIn(new Foo, function(value, key) {
//    console.log(key);   //a,b,c   遍历原型链
//});
//
//console.log(newData);    // { a: 1, b: 2 }



/****** _.forInRight(object, [iteratee=_.identity], [thisArg]) forIn从右往左 *******/



/****** _.forOwn(object, [iteratee=_.identity], [thisArg]) 遍历对象，不包括原型链 *******/
//function Foo() {
//    this.a = 1;
//    this.b = 2;
//}
////挂在原型链上
//Foo.prototype.c = 3;
//
//var newData = _.forOwn(new Foo, function(value, key) {
//    console.log(key);    //a,b    不遍历原型链
//});
//
//console.log(newData);    // { a: 1, b: 2 }



/****** _.forOwnRight(object, [iteratee=_.identity], [thisArg]) forOwn从右往左 *******/




/****** _.functions(object)
 * 返回一个对象里所有的方法名, 而且是已经排序的 — 也就是说, 对象里每个方法(属性值是一个函数)的名称. *******/






/****** _.get(object, path, [defaultValue])  获取路径显示的值  *******/
//var object = { 'a': [{ 'b': { 'c': 3 } }] };
//
////第二个参数是路径
//console.log(_.get(object, 'a[0].b.c'));    // 3
//
//console.log(_.get(object, ['a', '0', 'b', 'c']));   // 3
//
//console.log(_.get(object, ['a', '0', 'b', 'c'], 'default'));  // 3  如果路径有值则显示路径值
//
//console.log(_.get(object, 'a.b.c', 'default'));  // default  如果没有值则显示设置的值


/****** _.set(object, path, value)  设置路径的值  *******/
//var object = { 'a': [{ 'b': { 'c': 3 } }] };
////将C的值设为4
//_.set(object,'a[0].b.c',4);
//console.log(_.get(object,'a[0].b.c'));      // 4
//
////也可以设置新的属性的值
//_.set(object, 'x[0].y.z', 5);
//console.log(_.get(object,'x[0].y.z'));    // 5




/****** _.has(object, path) 路径是否有值 返回布尔 *******/
//var object = { 'a': { 'b': { 'c': 3 } } };
//
//console.log(_.has(object, 'a'));
//
//console.log(_.has(object, 'a.b.c'));
//
//console.log(_.has(object, ['a', 'b', 'c']));
//
//console.log(_.has(object, ['a', 'b', 'c','d']));



/****** _.invert(object, [multiValue])
 * 返回一个object副本，使其键（keys）和值（values）对换。
 * 对于这个操作，必须确保object里所有的值都是唯一的且可以序列号成字符串. *******/
//var object = {Moe: "Moses", Larry: "Louis", Curly: "Jerome"};
//
////健值调换  { Moses: 'Moe', Louis: 'Larry', Jerome: 'Curly' }
//console.log(_.invert(object));

//var object2 = { 'a': 1, 'b': 2, 'c': 1 };
//
////{ '1': 'c', '2': 'b' }
//console.log(_.invert(object2));
//
////{ '1': [ 'a', 'c' ], '2': [ 'b' ] }
//console.log(_.invert(object2,true));


/****** _.omit(object, [predicate], [thisArg])
 * 返回一个object副本，只过滤出除去keys(有效的键组成的数组)参数指定的属性值。 或者接受一个判断函数，指定忽略哪个key。*******/
//var object = { 'user': 'fred', 'age': 40 };
//
////忽略指定age属性的键值     { user: 'fred' }
//console.log(_.omit(object,'age'));
//
////忽略值为数字的键值    { user: 'fred' }
//console.log(_.omit(object, _.isNumber));




/****** _.pick(object, [predicate], [thisArg])
 * 返回一个object副本，只过滤出keys(有效的键组成的数组)参数指定的属性值。或者接受一个判断函数，指定挑选哪个key。
 * 与_.omit相反*******/
//var object = { 'user': 'fred', 'age': 40 };
//
////忽略指定age属性的键值     { 'user': 'fred', 'age': 40 }
//console.log(_.pick(object,'user','age'));
//
////忽略值为数字的键值    { age: 40 }
//console.log(_.pick(object, _.isNumber));



/****** _.pairs(object)  把一个对象转变为一个[key, value]形式的数组。 *******/
//var object = { 'barney': 36, 'fred': 40 };
//
////将键值转成了数组   [ [ 'barney', 36 ], [ 'fred', 40 ] ]
//console.log(_.pairs(object));



/****** _.result(object, path, [defaultValue])
 * 如果指定的property 的值是一个函数，那么将在object上下文内调用它;否则，返回它。
 * 如果提供默认值，并且属性不存在，那么默认值将被返回。
 * 如果设置defaultValue是一个函数，它的结果将被返回。*******/

//var object = {cheese: 'crumpets', stuff: function(){ return 'nonsense'; }};
//
//console.log(_.result(object,'cheese'));  //crumpets
////运行了方法
//console.log(_.result(object, 'stuff'));  //nonsense
////返回了默认值
//console.log(_.result(object, 'meat', 'ham'));  //ham




/****** _.transform(object, [iteratee=_.identity], [accumulator], [thisArg]) *******/
//var newArr = _.transform([2, 3, 4], function(result, n) {
//    result.push(n *= n);
//    return n % 2 == 0;
//});
//console.log(newArr);   // [ 4, 9 ]
//
//var newData = _.transform({ 'a': 1, 'b': 2 }, function(result, n, key) {
//    result[key] = n * 3;
//});
//console.log(newData);  // { a: 3, b: 6 }








