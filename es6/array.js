/**
 * array扩展
 * Created by soraping on 15/10/19.
 */

//Array.from()方法
//var str = 'hello';
//console.log(Array.from(str)); //[ 'h', 'e', 'l', 'l', 'o' ]


//Array.of()
//Array.of基本上可以用来替代Array()或new Array()，并且不存在由于参数不同而导致的重载。它的行为非常统一
//console.log(Array.of(3, 11, 8));    //[ 3, 11, 8 ]
//console.log(Array.of(3));     // [3]



//Array.of方法可以用下面的代码模拟实现
//function ArrayOf(){
//    return [].slice.call(arguments);
//}


//copyWithin()   Array.prototype.copyWithin(target, start = 0, end = this.length)
//var arr = [1, 2, 3, 4, 5];
//// [ 4, 5, 3, 4, 5 ]
//// 第一个参数表示从这个位置开始
//// 第二个参数表示从这个位置开始复制，然后覆盖到第一个参数显示的位置上
//console.log(arr.copyWithin(0,3));



//数组实例的find()和findIndex()
//数组实例的find方法，用于找出第一个符合条件的数组成员。
// 它的参数是一个回调函数，所有数组成员依次执行该回调函数，直到找出第一个返回值为true的成员，然后返回该成员。
// 如果没有符合条件的成员，则返回undefined。
var arr = [1, 4, -5, 10];
//
////返回数组中第一个小于0的数
//console.log(arr.find((n)=>{
//    return n<0;
//}));

//find的三个参数：
//第一个参数value表示当前的值
//第二个参数index表示当前的位置
//第三个表示原数组
//var num = arr.find((value,index,arr)=>{
//    return value > 3;
//});
//console.log(num);

//findIndex方法与ind方法非常类似，返回第一个符合条件的数组成员的位置，如果所有成员都不符合条件，则返回-1
//var num2 = [1, 5, 10, 15].findIndex(function(value, index, arr) {
//    return value > 9;
//});
//console.log(num2);    // 2

//这两个方法都可以接受第二个参数，用来绑定回调函数的this对象。

//... 三个点扩展运算符，将对象转成数据
//console.log([...['a',,'b']]);