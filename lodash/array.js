/**
 * lodash array
 * Created by Administrator on 2015/11/7.
 */
var _ = require('lodash');

/*****  _.chunk(arr,num) 分离数组    ******/
//var arr = [1,2,3,4,5,6];
//console.log(_.chunk(arr,2));//[ [ 1, 2 ], [ 3, 4 ], [ 5, 6 ] ]
//console.log(_.chunk(arr,4));//[ [ 1, 2, 3, 4 ], [ 5, 6 ] ]
//console.log(_.chunk(arr,3));//[ [ 1, 2, 3 ], [ 4, 5, 6 ] ]


/*****    _.compact 去除数组中的false、‘’、null、undefined元素 去除假值    ******/
//var arr1 = [1,2,'',3,null,undefined,4,false,5];
//console.log(_.compact(arr1));//[ 1, 2, 3, 4, 5 ]


/****** _.difference 比较一个数组与其他数组不同的地方  从数组中过滤元素 *******/
//var arr2 = [1, 2, 3];
//var arr3 = [4, 2];
//console.log(_.difference(arr2,arr3)); //[ 1, 3 ]
//console.log(_.difference(arr3,arr2)); //[4]



/****** _.drop(arr,size) 从0开始去掉arr中size个元素 数组元素删除 *******/
//console.log(_.drop([1, 2, 3]));     //返回[ 2, 3 ]，默认size=1;
//console.log(_.drop([1, 2, 3],2));   //[ 3 ]
//console.log(_.drop([1, 2, 3],5));   //[]
//console.log(_.drop([1, 2, 3],0));   //[ 1, 2, 3 ]



/****** _.dropRight(array, [n=1]) 从后往前，与_.drop相反  *******/
//console.log(_.dropRight([1, 2, 3]));     //返回[ 1, 2 ]，默认size=1;
//console.log(_.dropRight([1, 2, 3],2));   //[ 1 ]
//console.log(_.dropRight([1, 2, 3],5));   //[]
//console.log(_.dropRight([1, 2, 3],0));   //[ 1, 2, 3 ]



/****** _.dropRightWhile(array, [predicate=_.identity], [thisArg])  *******/
//var arr4 = _.dropRightWhile([1, 2, 3], function(n) {
//    return n > 1;
//});
//console.log(arr4);   //[1]


/****** _.fill(array, value, [start=0], [end=array.length]) 填充数组  *******/
//var array = [1, 2, 3];
//_.fill(array, 'a');
//console.log(array);     //[ 'a', 'a', 'a' ]
//
//console.log(_.fill(Array(3), 2));    //[ 2, 2, 2 ]
//
//console.log(_.fill([4, 6, 8], '*', 1, 2));   //[ 4, '*', 8 ]   第2个参数是要替换的元素，第3个参数是起始位置，第4个参数是end位置(不包含)


/****** _.findIndex(array, [predicate=_.identity], [thisArg])
 *  查询元素序号，遍历数组，如果查询到了符合要求的第一个元素则返回序号，如果没查询到符合要求的元素则返回-1. *******/
//var users = [
//    { 'user': 'barney',  'active': true },
//    { 'user': 'fred',    'active': false },
//    { 'user': 'pebbles', 'active': false }
//];
//var index = _.findIndex(users,function(chr){
//    return chr.user = 'barney';
//});
//console.log(index);     // user的值为barney的位置是0
//console.log(_.findIndex(users,{ 'user': 'fred',    'active': false }));      // 返回了对象的位置为1
//console.log(_.findIndex(users,'active',true));                              // 0 返回active=true第一次出现的位置
//console.log(_.findIndex(users,'active',false));                              //1 返回active=false第一次出现的位置
//console.log(_.findLastIndex(users, 'active'));                               //0 第一次出现active的位置



/****** _.findLastIndex  返回数组中符合条件的最后一个元素的位置  与_.findIndex相反  *******/



/****** _.first(array) 返回数组的第一个元素  *******/
//console.log(_.first([1, 2, 3]));     //1
//console.log(_.first([]));            //undefined


/****** _.flatten(array, [isDeep])  抹平嵌套数组 *******/
//console.log(_.flatten([1, [2, 3, [4]]]));           //[ 1, 2, 3, [ 4 ] ]
//console.log(_.flatten([1, [2, 3, [4]]],true));      //[ 1, 2, 3, 4 ]



/****** _.flattenDeep(array)  _.flatten的增强版 递归的抹平嵌套数组 *******/
//console.log(_.flattenDeep([1, [2, 3, [4]]]));         //[ 1, 2, 3, 4 ]


/****** _.indexOf(array, value, [fromIndex=0]默认从0开始)  返回元素出现的位置 *******/
//console.log(_.indexOf([1, 2, 1, 2], 2));           // 1
//console.log(_.indexOf([1, 2, 1, 2], 2, 2));        // 3 从第二个位置开始，出现2的值的位置是3
//console.log(_.indexOf([1, 1, 2, 2,2,2], 2, true)); // ?


/****** _.initial(array)  返回除了末尾元素的数组  *******/
//console.log(_.initial([1, 2, 3]));    //[ 1, 2 ]   去掉了最后的一个元素


/****** _.intersection([arrays])  返回新数组，其值就是数组参数的交集  *******/
//console.log(_.intersection([1, 2], [4, 2], [2, 1]));    //[2]   数组元素的交集[2]


/****** _.last(array)   返回参数数组的末尾元素  *******/
//console.log(_.last([1, 2, 3]));       // 3 返回数组的末尾元素的值


/****** _.lastIndexOf(array, value, [fromIndex=array.length-1])  类似于indexOf,搜索方向为从末尾到开头  *******/
//console.log(_.lastIndexOf([1, 2, 1, 2], 2));        // 3  从后往前，第一次出现2这个元素的位置是3
//console.log(_.lastIndexOf([1, 2, 1, 2], 2, 2));     // 1
//console.log(_.lastIndexOf([1, 1, 2, 2], 2, true));  // 3



/****** _.pull(array, [values])  移除值，直接在原数组上进行操作  *******/
//var array = [1, 2, 3, 1, 2, 3];
//_.pull(array, 2, 3);      // 在原数组上移除了2、3
//console.log(array);       // [ 1, 1 ]



/****** _.pullAt(array, [indexes]) 按序号移除值,直接操作原数组并且返回移除的值组成的数组  *******/
//var array = [5, 10, 15, 20];
//var evens = _.pullAt(array, 1, 3);    //在原数组上操作，移除了标号为1、3的元素
//console.log(array);        // 原数组为就变成了 [ 5, 15 ]
//console.log(evens);        // 移除的数组 [ 10, 20 ] 可以看出来，移除1,3位置的元素从逻辑上来说是同时移除的。避免了数组越界的问题。



/****** _.remove(array, [predicate=_.identity], [thisArg])  移除元素,对原数组进行操作，并且返回移除元素的集合  *******/
//var array = [1, 2, 3, 4];
//var evens = _.remove(array, function(n) {
//    return n % 2 == 0;         //移除了能被2整除的元素
//});
//console.log(array);     //[ 1, 3 ]
//console.log(evens);     //[ 2, 4 ]



/****** _.rest(array)  移除数组首元素 和initial相反   *******/
//console.log(_.rest([1, 2, 3]));      // [ 2, 3 ]



/****** _.slice(array, [start=0], [end=array.length])  数组截取   *******/
//var array = [1, 2, 3, 4];
//console.log(_.slice(array));         //[ 1, 2, 3, 4 ]
//console.log(_.slice(array,1,3));     //[ 2, 3 ]



/****** _.sortedIndex(array, value, [iteratee=_.identity], [thisArg]) 在对一个有序数组array进行插入的时候，返回value应该插入的位置。从左向右计算  *******/
//console.log(_.sortedIndex([30, 50], 20));      //0
//console.log(_.sortedIndex([30, 50], 40));      //1
//console.log(_.sortedIndex([30, 50], 60));      //2
//console.log(_.sortedIndex([30, 50], 50));      //1
//console.log(_.sortedIndex([4, 4, 5, 5], 5));   //2


/****** _.sortedLastIndex(array, value, [iteratee=_.identity], [thisArg]) sortedLastIndex 用法类似于sortedindex,不同的是从右至左计算插入的位置  *******/



/****** _.take(array, [n=1]) 数组切片  *******/
//console.log(_.take([1, 2, 3]));          // [ 1 ]
//console.log(_.take([1, 2, 3], 2));       // [ 1, 2 ]
//console.log(_.take([1, 2, 3], 5));       // [ 1, 2, 3 ]
//console.log(_.take([1, 2, 3], 0));       // []



/****** _.takeRight(array, [n=1])  同_.take方向相反   *******/
//console.log(_.takeRight([1, 2, 3]));          // [ 3 ]
//console.log(_.takeRight([1, 2, 3], 2));       // [ 2, 3 ]
//console.log(_.takeRight([1, 2, 3], 5));       // [ 1, 2, 3 ]
//console.log(_.takeRight([1, 2, 3], 0));       // []



/****** _.takeRightWhile(array, [predicate=_.identity], [thisArg])   *******/
//var arr = _.takeRightWhile([1, 2, 3], function(n) {
//    return n > 1;
//});
//console.log(arr);   // [ 2, 3 ]
//
//var users = [
//    { 'user': 'barney',  'active': true },
//    { 'user': 'fred',    'active': false },
//    { 'user': 'pebbles', 'active': false }
//];
//
//console.log(_.pluck(_.takeRightWhile(users, { 'user': 'pebbles', 'active': false }), 'user'));    //[ 'pebbles' ]
//
//console.log(_.pluck(_.takeRightWhile(users, 'active', false), 'user'));     //[ 'fred', 'pebbles' ]
//
//console.log(_.pluck(_.takeRightWhile(users, 'active'), 'user'));    //[]


/****** _.takeWhile(array, [predicate=_.identity], [thisArg])   *******/




/****** _.union([arrays])  数组合并，去除重复值  *******/
//console.log(_.union([1, 2], [4, 2], [2, 1]));      // [ 1, 2, 4 ]


/****** _.uniq(array, [isSorted], [iteratee], [thisArg]) 数组去重  *******/
//console.log(_.uniq([2, 1, 2]));            // [ 2, 1 ]
//console.log(_.uniq([1, 1, 2], true));      // [ 1, 2 ]
//// [ 1, 2.5 ]
//var arr = _.uniq([1, 2.5, 1.5, 2], function(n) {
//            return this.floor(n);
//        }, Math);
//console.log(arr);
////[ { x: 1 }, { x: 2 } ]
//console.log(_.uniq([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x'));



/****** _.zip(array)    zip数组   *******/





/****** _.unzip(array)    zip的逆运算，还原zip后的数组   *******/




/****** _.zipObject(props, [values=[]])   *******/




/****** _.zipWith([arrays], [iteratee], [thisArg])   *******/




/****** _.unzipWith(array, [iteratee], [thisArg])   在数组重组的时候同时进行某些操作   *******/




/****** _.without(array, [values])   从数组中去除某些值  不同于difference方法。其values参数可以不是一个数组，而是接在array参数之后的零散参数 *******/
//console.log(_.without([1, 2, 1, 3], 1, 2));         // 将数组中的元素1、2移除 原数组变为[ 3 ]




/****** _.xor([arrays]) 对称消除重复值  如果n和n+1还有未消除的非重复值，那么会和n+2和n+3消除后保留下来的数组进行合并 *******/
//console.log(_.xor([1, 2], [4, 2]));              // [ 1, 4 ]
//console.log(_.xor([1,2],[1,2],[1,4],[1,4]));     //[]
//console.log(_.xor([1,2],[1,2],[1,4]));           //[1,4]
//console.log(_.xor([1,2],[1,2,3],[1,2]));           //[ 3, 1, 2 ]



