/**
 * generator函数
 * Created by of1723 on 15/10/19.
 */
function* helloWorldGenerator() {
    yield 'hello';
    yield 'world';
    return 'ending';
}

var hw = helloWorldGenerator();

/**
 * 上面代码定义了一个Generator函数helloWorldGenerator，
 * 它内部有两个yield语句“hello”和“world”，即该函数有三个状态：hello，world和return语句（结束执行）。
     然后，Generator函数的调用方法与普通函数一样，也是在函数名后面加上一对圆括号。
     不同的是，调用Generator函数后，该函数并不执行，返回的也不是函数运行结果，而是一个指向内部状态的指针对象，
     也就是上一章介绍的遍历器对象（Iterator Object）。

     下一步，必须调用遍历器对象的next方法，使得指针移向下一个状态。
     也就是说，每次调用next方法，内部指针就从函数头部或上一次停下来的地方开始执行，直到遇到下一个yield语句（或return语句）为止。
     换言之，Generator函数是分段执行的，yield语句是暂停执行的标记，而next方法可以恢复执行。
 */


/**
 * 第一次调用，Generator函数开始执行，直到遇到第一个yield语句为止。
 * next方法返回一个对象，它的value属性就是当前yield语句的值hello，done属性的值false，表示遍历还没有结束。
 */
console.log(hw.next());   //{ value: 'hello', done: false }

console.log(hw.next());   //{ value: 'world', done: false }

/**
 * 第三次调用，Generator函数从上次yield语句停下的地方，一直执行到return语句（如果没有return语句，就执行到函数结束）。
 * next方法返回的对象的value属性，就是紧跟在return语句后面的表达式的值（如果没有return语句，则value属性的值为undefined），
 * done属性的值true，表示遍历已经结束。
 */
console.log(hw.next());   //{ value: 'ending', done: true }

/**
 * 第四次调用，此时Generator函数已经运行完毕，next方法返回对象的value属性为undefined，done属性为true。
 * 以后再调用next方法，返回的都是这个值。
 */
console.log(hw.next());   //{ value: undefined, done: true }


/**
 * for...of循环可以自动遍历Generator函数，且此时不再需要调用next方法。
 * @return {number}
 */
function *foo() {
    yield 1;
    yield 2;
    yield 3;
    yield 4;
    yield 5;
    return 6;
}


/**
 * 上面代码使用for...of循环，依次显示5个yield语句的值。这里需要注意，一旦next方法的返回对象的done属性为true，
 * for...of循环就会中止，且不包含该返回对象，所以上面代码的return语句返回的6，不包括在for...of循环之中。
 */
for (var v of foo()) {
    console.log(v);     //1,2,3,4,5
}


/**
 * 前面章节曾经介绍过，for...of循环、扩展运算符（...）、解构赋值和Array.from方法内部调用的，都是遍历器接口。
 * 这意味着，它们可以将Generator函数返回的Iterator对象，作为参数。
 * @return {number}
 */

function* numbers () {
    yield 1;
    yield 2;
    return 3;
    yield 4;
}

//console.log([...numbers()]); // [1, 2]

console.log(Array.from(numbers())); // [1, 2]

//let [x, y] = numbers();
//console.log(x,y);

for (var n of numbers()) {
    console.log(n)
}