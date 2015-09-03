let [x,y,z] = [1,2];
console.log(z);
console.log(x);

let [foo] = 'hello';
console.log(foo);

let obj = {name:'zhangsan',age:'30'};
let {name:haha,age:xixi} = obj;

console.log(haha);
console.log(xixi);

let { log, sin, cos } = Math;
console.log(log);

let [a,b,c,d,e] = 'hello';
console.log(a);

let {length:len} = 'hello';
console.log(len);