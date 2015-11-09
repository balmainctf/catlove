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
var users = {
    'barney':  { 'age': 36, 'active': true },
    'fred':    { 'age': 40, 'active': false },
    'pebbles': { 'age': 1,  'active': true }
};

var newData = _.findKey(users, function(chr) {
    return chr.age < 40;
});
//返回第一个符合条件的barney
console.log(newData);










