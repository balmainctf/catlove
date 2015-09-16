var EventEmitter = require('events').EventEmitter;
//实例化事件对象
var events = new EventEmitter();
/*//注册事件 ,事件名 回调函数
events.on('myEvent',function(){
	console.log('hahahahaha');
});

setTimeout(function(){
	//触发事件
	events.emit('myEvent');
},1000);*/

/*//只注册一次，触发一次后就自动注销的事件
events.once('myEvent1',function(){
	console.log('hahahahaha');
});

setTimeout(function(){
	//触发事件
	events.emit('myEvent1');
	//no event
	events.emit('myEvent1');
},1000);*/

