/**
 * Created by Administrator on 2015/9/18.
 * immutable test 不可变数据集合
 */
var immutable = require('immutable');
var Cursor = require('immutable/contrib/cursor');

//fromJs() 生成不可变对象
//var data = {a: {b: [10, 20, 30]}, c: 40};
//var map1 = immutable.fromJS(data);
//console.log(map1);//Map { "a": Map { "b": List [ 10, 20, 30 ] }, "c": 40 }
//console.log(map1.get('a'));//Map { "b": List [ 10, 20, 30 ] }
////改变c属性的值
//var map2 = map1.set('c',55);
//console.log(map1.get('c'));//44 原先map1属性没有变化
//console.log(map2.get('c'));//55
//console.log(map2.get('a'));//Map { "b": List [ 10, 20, 30 ] }


//is() 对象引用类型的比较
/*var a = {name:'zhangsan'};
var b = {name:'zhangsan'};
//判断a和b是否三等
console.log(a===b);//false,因为两个对象指向的不是同一个地址

var c = {};
c.name = 'lisi';
var d = c;//将c指向的地址赋值给d
d.name = 'lisi';
console.log(c===d);//true,c和d指向了同一个地址


var e = immutable.fromJS(a);
var f = immutable.fromJS(b);
console.log(immutable.is(e,f));//true,判断两个对象是否相同，即使两个对象不指向同一个地址*/


//map()
/*
var a = {name:'zhangsan'};
var map1 = immutable.Map(a);
console.log(map1);//Map { "name": "zhangsan" }

//set() 设置属性，但不会改变本身
console.log(map1.set('name','wanger'));//Map { "name": "wanger" }
//clear()
console.log(map1.clear()); //{},如果是多元素，则将(key,value)写在clear内
//delete()
console.log(map1.delete('name'));//{},将需要删除的key放在delete中即可
//update()
//console.log(map1.update());

//合并merge()
var b = {name:'lisi',age:'30'};
var map2 = immutable.Map(b);
var map3 = map1.merge(map2);
console.log(map3);//Map { "name": "lisi", "age": "30" }
var map4 = map2.merge(map1);
console.log(map4);//Map { "name": "zhangsan", "age": "30" }

//size
console.log(map4.size);//2 计算属性个数

//特殊合并mergeWith()
var x = immutable.Map({a: 10, b: 20, c: 30});
var y = immutable.Map({b: 40, a: 50, d: 60});
console.log(x.mergeWith((prev, next) => prev / next, y)); // Map { "a": 0.2, "b": 0.5, "c": 30, "d": 60 }
console.log(y.mergeWith((prev, next) => prev / next, x)); // Map { "b": 2, "a": 5, "d": 60, "c": 30 }

//mergeDeep()
//这里用fromJS是因为底层遍历，而map只能是一个简单的一层对象
var x = immutable.fromJS({a: { x: 10, y: 10 }, b: { x: 20, y: 50 } });
var y = immutable.fromJS({a: { x: 2 }, b: { y: 5 }, c: { z: 3 } });
console.log(x.mergeDeep(y)); // Map { "a": Map { "x": 2, "y": 10 }, "b": Map { "x": 20, "y": 5 }, "c": Map { "z": 3 } }
console.log(y.mergeDeep(x)); //Map { "a": Map { "x": 10, "y": 10 }, "b": Map { "y": 50, "x": 20 }, "c": Map { "z": 3 } }

//mergeDeepWith()
var x = immutable.fromJS({a: { x: 10, y: 10 }, b: { x: 20, y: 50 } });
var y = immutable.fromJS({a: { x: 2 }, b: { y: 5 }, c: { z: 3 } });
console.log(x.mergeDeepWith((prev, next) => prev / next, y)); //Map { "a": Map { "x": 5, "y": 10 }, "b": Map { "x": 20, "y": 10 }, "c": Map { "z": 3 } }
*/


var list1 = [{name:'zhangsan',age:'25'},{name:'lisi',age:'30'}];
//var list2 = [{name:'zhaoliu',age:'24'},{name:'wangqi',age:'35'}];
//
var arr1 = immutable.fromJS(list1);
//var arr2 = immutable.fromJS(list2);
//var arr3 = arr1.concat(arr2);
//console.log(arr3);
//排序
//console.log(arr1.sortBy((n)=>n.get('age')));

//console.log(arr1.findLast((n)=>{
//    return n.get('age') > 20;
//}));

var map1 = arr1.get(0);

//var keyName = map1.findKey((n)=>{
//    return n;
//});
//
//console.log(keyName);

map1.mapKeys((n)=>{
    console.log(n);
});






