/*  Prototype JavaScript framework, version 1.4.0
 *  (c) 2005 Sam Stephenson <sam@conio.net>
 *
 *  Prototype is freely distributable under the terms of an MIT-style license.
 *  For details, see the Prototype web site: http://prototype.conio.net/
 *
/*--------------------------------------------------------------------------*/
/* 
prototype-1.4.0注释版本 by http://www.x2blog.cn/supNate/
 
prototype框架最早是出于方便Ruby开发人员进行JavaScript开发所构建的，从这个版本上更加体现的淋漓尽致。
比起1.3.1版本，1.4.0中的编程思想和技巧更加令人拍案叫绝，对于开拓编程思路很有帮助。
 
该版本主要加入了迭代器思想，也是Ruby中的一个核心概念，从而使用此框架进行JavaScript开发几乎可以避免for循环的使用。
/*----------------------------------------------------------------------------------------------------*/
 
 
/*
定义prototype对象，告知版本信息，有利于程序的自动检测
ScriptFragment是正则表达式，用于捕获字符串中的<script>标记及其中的内容
emptyFunction:空函数
K：返回参数自身的函数，后面会有应用
 
在这里使用了直接定义对象的语法：
var obj={
	property1:value1,
	property2:value2,
	....
}
后面会经常用到
*/
var Prototype = {
  Version: '1.4.0',
  ScriptFragment: '(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)',
 
  emptyFunction: function() {},
  K: function(x) {return x}
}
 
/*
定义创建类的模式，使用此模式创建的类能够实现构造函数
其中initialize是一个抽象方法，apply使得能对其保持参数。
如果直接调用this.initialize(arguments)，则整个参数数组作为了一个参数。
*/
var Class = {
  create: function() {
    return function() {
      this.initialize.apply(this, arguments);
    }
  }
}
 
//表示命名空间或者抽象类的东西，使代码逻辑更加清楚
var Abstract = new Object();
 
/*
将source的所有属性复制到destination
例如：
var a={};
var b={p:1};
Object.extent(a,b);
alert(a.p);
可以看到a具有了属性p且值等于1。
如果属性相同则覆盖。
*/
Object.extend = function(destination, source) {
  for (property in source) {
    destination[property] = source[property];
  }
  return destination;
}
/*
相比prototype-1.3.1这里少了下面的函数：
Object.prototype.extend = function(object) {
  return Object.extend.apply(this, [this, object]);
}
所以原先基于1.3.1框架的js脚本升级到1.4.0时会产生兼容性问题。只要在1.4.0里加上上述函数即可。
去掉的原因大概因为为每个object都增加extend方法显的很浪费，毕竟95％的对象是不会用到的。
而且增加了extend方法也为反射枚举带来一定的麻烦，这从后面Hash对象的用法可以看到。
*/
 
/*
将对象转换为字符串，这里能够更详细一些，只要对象自定义了inspect函数。而不是原来对象的toString总是[object]。
例如后面对数组定义了inspect函数，使得
var arr=[1,2,3];
－》arr.inspect()=="[1,2,3]";
*/
Object.inspect = function(object) {
  try {
    if (object == undefined) return 'undefined';
    if (object == null) return 'null';
    return object.inspect ? object.inspect() : object.toString();
  } catch (e) {
    if (e instanceof RangeError) return '...';
    throw e;
  }
}
 
/*
一个很重要的方法，能够将函数绑定到某个对象运行
和1.3.1版本相比，原来不能在绑定的时候就添加参数，而现在可以。
例如：
var obj1={p:"obj1"};
var obj2={
	p:"obj2",
	method:function(arg){
		alert(arg+this.p);
	}
}
obj2.method("this is ");//显示“this is obj2”；
obj2.method.bind(obj1,"now this is ");//显示“now this is obj1”；
最后一句在1.3.1中必须写为：
obj2.method.bind(obj1)("now this is ");//显示“now this is obj1”；
*/
Function.prototype.bind = function() {
  var __method = this, args = $A(arguments), object = args.shift();
  return function() {
    return __method.apply(object, args.concat($A(arguments)));
  }
}
/*
将函数作为对象的事件监听器，这样可以产生独立而且通用的事件处理程序，例如要对单击事件进行处理：
function clickHandler(element){
	//处理element的单击事件
}
 
假设有节点node1，则：
node1.onclick=function(){
	clickHandler.bindAsEventListener(this)(event||window.event);
}
*/
Function.prototype.bindAsEventListener = function(object) {
  var __method = this;
  return function(event) {
    return __method.call(object, event || window.event);
  }
}
 
/*
所有的数字类型都是Number类的实例，下面就是给Number类定义一些方法
*/
Object.extend(Number.prototype, {
	/*
	将数字转换为颜色的形式
	*/
  toColorPart: function() {
    var digits = this.toString(16);
    if (this < 16) return '0' + digits;
    return digits;
  },
	//加1
  succ: function() {
    return this + 1;
  },
	/*
	执行指定次数的循环，例如获取10个随机数
	var ran=[]
	var c=10;
	c.times(function(){
		ran.push(Math.random());
	});
	$R是ObjectRange对象的快捷创建形式，后面会有介绍。
	*/
  times: function(iterator) {
    $R(0, this, true).each(iterator);
    return this;
  }
});
 
/*
Try对象，仅有一个方法these
*/
var Try = {
	/*
	根据参数指定的函数进行调用，返回第一个调用成功的值
	在后面跨浏览器建立XMLHttpRequest对象时就用到了。
	如果所有都不成功则返回undefined
	*/
  these: function() {
    var returnValue;
 
    for (var i = 0; i < arguments.length; i++) {
      var lambda = arguments[i];
      try {
        returnValue = lambda();
        break;
      } catch (e) {}
    }
 
    return returnValue;
  }
}
 
/*--------------------------------------------------------------------------*/
 
 
/*
定时器类，比起window.setInterval函数，该类能够使得回调函数不会被并发调用，见onTimerEvent的注释。
*/
var PeriodicalExecuter = Class.create();
PeriodicalExecuter.prototype = {
	/*
	构造函数，指定回调函数和执行频率，单位为秒
	*/
  initialize: function(callback, frequency) {
    this.callback = callback;
    this.frequency = frequency;
    this.currentlyExecuting = false;
    this.registerCallback();
  },
	/*
	开始执行定时器，一般不要显示调用，在构造函数中被调用
	注意这里写为：
	this.onTimerEvent.bind(this)
	如果写为：
	this.onTimerEvent
	则onTimerEvent中的函数的this指针将指向window对象，即setInterval的默认对象。
	*/
  registerCallback: function() {
    setInterval(this.onTimerEvent.bind(this), this.frequency * 1000);
  },
	/*
	相当于回调函数的一个代理。
	在传统的setInterval函数中，时间一到，便强制执行回调函数，而这里加入了currentlyExecuting属性判断，
	则如果callback函数的执行时间超过了一个时间片，则阻止其被重复执行。
	*/
  onTimerEvent: function() {
    if (!this.currentlyExecuting) {
      try {
        this.currentlyExecuting = true;
        this.callback();
      } finally {
        this.currentlyExecuting = false;
      }
    }
  }
}
 
/*--------------------------------------------------------------------------*/
/*
很方便的一个快速链接函数，能够获得参数所指定的页面节点，如果有多个参数则返回数组。
参数的形式既可以是节点的id值，也可以是节点的引用，即$($("someId"))和$("someId")是等价的;
*/
function $() {
  var elements = new Array();
 
  for (var i = 0; i < arguments.length; i++) {
    var element = arguments[i];
    if (typeof element == 'string')
      element = document.getElementById(element);
 
    if (arguments.length == 1)
      return element;
 
    elements.push(element);
  }
 
  return elements;
}
 
/*
为字符串对象添加方法，和前面为Number添加方法的原理相同
*/
Object.extend(String.prototype, {
	/*
	将Html转换为纯文本，例如：
	var s="<font color='red'>hello</font>";
	s.stripTags()将得到“hello”。
	*/
  stripTags: function() {
    return this.replace(/<\/?[^>]+>/gi, '');
  },
	/*
	删除文本中的脚本代码（<script xxx>...</script>）
	*/
  stripScripts: function() {
    return this.replace(new RegExp(Prototype.ScriptFragment, 'img'), '');
  },
	//提取字符串中的脚本，返回所有脚本内容组成的数组
  extractScripts: function() {
    var matchAll = new RegExp(Prototype.ScriptFragment, 'img');//先找到所有包括<script>的代码标记
    var matchOne = new RegExp(Prototype.ScriptFragment, 'im');	//再对每个脚本删除<script>标记
    return (this.match(matchAll) || []).map(function(scriptTag) {
      return (scriptTag.match(matchOne) || ['', ''])[1];
    });
  },
	//先提取字符串中的脚本块，再执行这些脚本
  evalScripts: function() {
    return this.extractScripts().map(eval);
  },
	/*
	利用浏览器本身的机制对Html字符串进行编码，例如将<转换为&lt;
	*/
  escapeHTML: function() {
    var div = document.createElement('div');
    var text = document.createTextNode(this);
    div.appendChild(text);
    return div.innerHTML;
  },
	/*
	对Html进行解码
	*/
  unescapeHTML: function() {
    var div = document.createElement('div');
    div.innerHTML = this.stripTags();
    return div.childNodes[0] ? div.childNodes[0].nodeValue : '';
  },
	//获取查询字符串数组，例如通过document.location.toQueryParams()就可以得到由键和值组成的哈希表（用对象表示）。
  toQueryParams: function() {
    var pairs = this.match(/^\??(.*)$/)[1].split('&');
    return pairs.inject({}, function(params, pairString) {
      var pair = pairString.split('=');
      params[pair[0]] = pair[1];
      return params;
    });
  },
	//将字符串转换为字符数组
  toArray: function() {
    return this.split('');
  },
	/*
	将用"-"连接的字符串骆驼化。例如：
	var s="background-color";
	alert(s.camelize());
	将得到“backgroundColor”。
	*/
  camelize: function() {
    var oStringList = this.split('-');
    if (oStringList.length == 1) return oStringList[0];
 
    var camelizedString = this.indexOf('-') == 0
      ? oStringList[0].charAt(0).toUpperCase() + oStringList[0].substring(1)
      : oStringList[0];
 
    for (var i = 1, len = oStringList.length; i < len; i++) {
      var s = oStringList[i];
      camelizedString += s.charAt(0).toUpperCase() + s.substring(1);
    }
 
    return camelizedString;
  },
	/*
	inspect是观察的意思。这里大概就是将字符串转换为可观察的形式。这里将转义字符写成转义前的字符串形式，
	例如：
	var s="abc\ndef";
 
	alert(s);
	将得到两行字符串，上一行是abc,下一行是def
	而
	alert(s.inspect());
	将得到abc\ndef
	即给字符串赋值时的形式，这和数组的inspect作用类似。
	*/
  inspect: function() {
    return "'" + this.replace('\\', '\\\\').replace("'", '\\\'') + "'";
  }
});
 
//做一个名称链接
String.prototype.parseQuery = String.prototype.toQueryParams;
 
//定义了两个异常对象，主要用于迭代控制
var $break    = new Object();
var $continue = new Object();
 
/*
这是一个非常Ruby的机制，事实上可以将Enumerable看作一个枚举接口，
而_each是必须实现的方法，只要实现了此方法的类，都可以调用接口类中的其他成员。
例如后面Array就实现了此接口，也是最典型的应用
*/
var Enumerable = {
	/*
	对可枚举对象的每个成员调用iterator（迭代器）方法，
	如果迭代器方法抛出$continue异常，则继续执行，如果抛出$break异常，则不再继续迭代
	
	其中调用了_each这个抽象方法，
	_each是由具体的继承于Enumerable的类实现的
 
	index计数器的作用是用于告诉迭代器当前执行到第几个元素，是迭代器可选实现的。
	*/
  each: function(iterator) {
    var index = 0;
    try {
      this._each(function(value) {
        try {
          iterator(value, index++);
        } catch (e) {
          if (e != $continue) throw e;
        }
      });
    } catch (e) {
      if (e != $break) throw e;
    }
  },
	/*
	判断枚举对象中的所有元素是否都能使得迭代器返回true。如果没有指定迭代器，则判断所有元素是否都对应于布尔类型的true
	如果所有都满足，则返回true；否则返回false；
	注意这里就使用了$break异常，用于实现“逻辑与”操作的短路效果
	另外值得注意的一个技巧是使用了!!将一个变量强制转换为布尔类型，可以参考：http://www.x2blog.cn/supNate/?tid=4669
	*/
all: function(iterator) {
var result = true;
this.each(function(value, index) {
result = result && !!(iterator || Prototype.K)(value, index);
if (!result) throw $break;
});
return result;
},
	/*
	判断枚举对象中的所有元素是否有满足指定迭代器的值（返回true），如果有则返回true，否则返回false
	其原理和all方法类似
 
	如果数组为空，仍然返回true，这一点有点匪夷所思。
	*/
  any: function(iterator) {
    var result = true;
    this.each(function(value, index) {
      if (result = !!(iterator || Prototype.K)(value, index))
        throw $break;
    });
    return result;
  },
	/*
	返回所有枚举元素通过迭代器执行的结果，作为数组返回
	*/
  collect: function(iterator) {
    var results = [];
    this.each(function(value, index) {
      results.push(iterator(value, index));
    });
    return results;
  },
	/*
	返回第一个能够使得迭代器返回true的枚举元素的值，如果没有true，则返回"undefined",即result未被赋值
	这有可能是作者考虑的一个小失误，毕竟返回"undefined"并不是一个好的风格（仅是猜测）
	*/
  detect: function (iterator) {
    var result;
    this.each(function(value, index) {
      if (iterator(value, index)) {
        result = value;
        throw $break;
      }
    });
    return result;
  },
	/*
	返回所有能够使得迭代器返回true的枚举元素，作为数组返回。
	*/
  findAll: function(iterator) {
    var results = [];
    this.each(function(value, index) {
      if (iterator(value, index))
        results.push(value);
    });
    return results;
  },
	/*
	grep是unix类操作系统下的一个经典命令，而这里则是JavaScript的一个类似实现
	pattern是正则模式，对所有符合此模式的枚举元素进行迭代器运算，并将运算结果保存到数组中并返回。
	需要注意，这里的iterator参数是可选的，此时仅仅对枚举元素进行模式匹配，返回所有的匹配结果
	*/
  grep: function(pattern, iterator) {
    var results = [];
    this.each(function(value, index) {
      var stringValue = value.toString();
      if (stringValue.match(pattern))
        results.push((iterator || Prototype.K)(value, index));
    })
    return results;
  },
	/*
	判断枚举对象中是否包含指定值的枚举元素，这里仍然使用了each方法，而不是循环，可见prototype致力于提供一种ruby化的编程方式，
	如果用循环实现，则是类似于以下的代码：
	for(var i=0;i<this.length;i++){
		if(this[i]==object)return true;
	}
	而该函数中，定义了迭代器：
	function(value) {
      if (value == object) {
        found = true;
        throw $break;
      }
    }
	这个迭代器作为each方法的参数。
	
	*/
  include: function(object) {
    var found = false;
    this.each(function(value) {
      if (value == object) {
        found = true;
        throw $break;
      }
    });
    return found;
  },
 
	/*
	字面意思是“注入”，其作用相当于将memo作为联系各个迭代器的全局变量，每次迭代都对其进行操作，返回操作的最后结果。例如对于数组：
	var arr=[1,2,3];
	现在想将其字符串化为：123
	如果不调用join方法，传统做法是：
	var s="";
	for(var i=0;i<arr.length;i++){
		s+=arr[i];
	}
	现在通过调用inject函数，则：
	var s=arr.inject("",function(memo,value){return memo+value});
	两者运行的结果是完全相同的。
	*/
  inject: function(memo, iterator) {
    this.each(function(value, index) {
      memo = iterator(memo, value, index);
    });
    return memo;
  },
 
	/*
	在所有枚举元素上调用method方法，并可以给这个方法传递参数
	返回所有method的执行结果，作为数组返回
	*/
  invoke: function(method) {
    var args = $A(arguments).slice(1);
    return this.collect(function(value) {
      return value[method].apply(value, args);
    });
  },
	/*
	返回最大的迭代器返回值
	*/
  max: function(iterator) {
    var result;
    this.each(function(value, index) {
      value = (iterator || Prototype.K)(value, index);
      if (value >= (result || value))
        result = value;
    });
    return result;
  },
	/*
	返回最小的迭代器返回值
	*/
  min: function(iterator) {
    var result;
    this.each(function(value, index) {
      value = (iterator || Prototype.K)(value, index);
      if (value <= (result || value))
        result = value;
    });
    return result;
  },
	/*
	按照迭代器的返回结果，将枚举元素分为两个数组trues和falses，其中trues包括迭代器返回true的枚举元素，falses则相反。
	*/
  partition: function(iterator) {
    var trues = [], falses = [];
    this.each(function(value, index) {
      ((iterator || Prototype.K)(value, index) ?
        trues : falses).push(value);
    });
    return [trues, falses];
  },
	/*
	返回所有枚举元素的property属性
	*/
  pluck: function(property) {
    var results = [];
    this.each(function(value, index) {
      results.push(value[property]);
    });
    return results;
  },
 
	/*
	返回所有迭代器执行结果为false的枚举元素
	*/
  reject: function(iterator) {
    var results = [];
    this.each(function(value, index) {
      if (!iterator(value, index))
        results.push(value);
    });
    return results;
  },
	/*
	结构复杂的一个函数，作用是根据迭代器iterator的结果对枚举元素进行排序。使iterator执行结果小的元素排在前面。
	主要包括三个函数的调用：
	1。collect方法，返回的每个数组元素包括：值和迭代器运行该值的结果，用{value:value,criteria:iterator(value,index)}得到
	2。对collect返回的数组执行sort方法，这时数组对象内置的对象，参数是一个委托函数，用于指定排序规则。其标准是对迭代器返回的值排序，小的在前面
	3。对sort的结果执行pluck方法，即返回value属性的值，于是最后还是返回的枚举对象中的原有值，只是根据迭代器iterator的结果对这些元素进行排序
	*/
  sortBy: function(iterator) {
    return this.collect(function(value, index) {
      return {value: value, criteria: iterator(value, index)};
    }).sort(function(left, right) {
      var a = left.criteria, b = right.criteria;
      return a < b ? -1 : a > b ? 1 : 0;
    }).pluck('value');
  },
 
	/*
	将枚举对象转换为数组，使用了collect方法和Prototype.K函数，减少了重复代码
	*/
  toArray: function() {
    return this.collect(Prototype.K);
  },
	/*
	压缩函数，实现复杂，作用尚不能体会-_-。
	接收的参数需要是可枚举对象，可以有多个参数。最后一个参数是迭代器，可选。
	作用是将自身和参数组成的二维阵列进行行列对换，并切除多余的数据，或补充缺少的数据(用undefined)。切换后的行数由调用者中元素的个数决定，而列数是数组参数的个数加1。
	每个数组参数的第一个元素顺序组成第一行，第二个元素顺序组成第二行，依次类推。直到调用者中的元素用完为止。
	迭代器的作用就是对转换后的每一行进行一次运算。
	例如：
	var arr1=[1,2,3];
	var arr2=[4,5,6];
	var arr3=[7,8,9];
	var arr=arr1.zip(arr2,arr3);
 
	//使用迭代器输出结果，inspect用于输出数组语法表示的数组字符串，后面有介绍
	arr.each(function(s){
			document.write(s.inspect());
			document.write("<br/>");
		}
	);
	得到的结果为：
	[1, 4, 7]
	[2, 5, 8]
	[3, 6, 9]
 
	如果让arr1=[1,2]，其他不变，则执行结果为：
	[1, 4, 7]
	[2, 5, 8]
 
	*/
  zip: function() {
    var iterator = Prototype.K, args = $A(arguments);
    if (typeof args.last() == 'function')
      iterator = args.pop();
	//将自身枚举对象作为一个元素，与参数（也是可枚举的）组成一个数组，并将枚举对象转换为数组（通过$A迭代器）
    var collections = [this].concat(args).map($A);
 
    return this.map(function(value, index) {
      iterator(value = collections.pluck(index));
      return value;
    });
  },
	/*
	这实际上这是一个待实现的抽象方法，在Array对象中有对其进行的重定义
	所以将this转换为数组（toArray()），再调用inspect。
	对于非数组形式的枚举对象，则会加上'#<Enumerable:....>'这样的形式
	*/
  inspect: function() {
    return '#<Enumerable:' + this.toArray().inspect() + '>';
  }
}
//对Enumerable基类的一些方法做了快速链接
Object.extend(Enumerable, {
  map:     Enumerable.collect,
  find:    Enumerable.detect,
  select:  Enumerable.findAll,
  member:  Enumerable.include,
  entries: Enumerable.toArray
});
 
/*
将一个对象转换为数组。
对于字符串则直接变为字符数组，例如$A("abc")将得到，["a","b","c"]
否则集合对象变为数组，这类对象包括函数的参数集合arguments，<select>的options集合，
<form>的elements集合等等，一个节点的所有子结点childNodes等等。
*/
var $A = Array.from = function(iterable) {
if (!iterable) return [];
if (iterable.toArray) {
return iterable.toArray();
} else {
var results = [];
for (var i = 0; i < iterable.length; i++)
results.push(iterable[i]);
return results;
}
}
/*
让数组继承于Enumarable对象（基类）
*/
Object.extend(Array.prototype, Enumerable);
/*
做一个链接，prototype中一般私有的成员或抽象成员都用下划线开头，这里的_reverse大概就是起一个说明性的作用，将其作为抽象方法使用。
*/
Array.prototype._reverse = Array.prototype.reverse;
 
/*
为数组对象添加一些快捷方法
*/
Object.extend(Array.prototype, {
	/*
	迭代器方法，源于Ruby中的迭代器用法
	_each方法的作用就是将数组的每个元素作为iterator函数的参数，并执行iterator方法。例如对于数组：var arr=[1,2,3,4,5,6];
	如果要显示其中的每个元素，通常的做法是
	for(var i=0;i<arr.length;i++){
		alert(arr[i]);
	}
	而使用此方法则：
	arr._each(function(s){alert(s)});
	因此，在Ruby的代码中很少出现循环，这个函数使得JavaScript同样也能够实现。
	*/
  _each: function(iterator) {
    for (var i = 0; i < this.length; i++)
      iterator(this[i]);
  },
 
	//清空数组
  clear: function() {
    this.length = 0;
    return this;
  },
	//获取第一个元素的值
  first: function() {
    return this[0];
  },
	//获取最后一个元素的值
  last: function() {
    return this[this.length - 1];
  },
 
	/*
	用于删除一个数组中的未定义值和null值
	这里的select是从Emurable中继承的方法，而select又是findAll函数的别名
	*/
  compact: function() {
    return this.select(function(value) {
      return value != undefined || value != null;
    });
  },
	/*
	将一个枚举对象中的所有数组元素全部展开，最后返回一个数组，是一个递归的过程
	*/
  flatten: function() {
    return this.inject([], function(array, value) {
      return array.concat(value.constructor == Array ?
        value.flatten() : [value]);
    });
  },
	/*
	从数组中删除参数指定的元素，返回删除后的结果
	*/
  without: function() {
    var values = $A(arguments);
    return this.select(function(value) {
      return !values.include(value);
    });
  },
	/*
	返回一个元素在数组中的索引
	*/
  indexOf: function(object) {
    for (var i = 0; i < this.length; i++)
      if (this[i] == object) return i;
    return -1;
  },
	/*
	将数组元素顺序逆转，inline用于确保是数组
	*/
  reverse: function(inline) {
    return (inline !== false ? this : this.toArray())._reverse();
  },
	/*
	取出数组的第一个元素并返回
	*/
  shift: function() {
    var result = this[0];
    for (var i = 0; i < this.length - 1; i++)
      this[i] = this[i + 1];
    this.length--;
    return result;
  },
	/*
	返回数组的字符串表示
	*/
  inspect: function() {
    return '[' + this.map(Object.inspect).join(', ') + ']';
  }
});
/*
定义哈希对象的通用操作
*/
var Hash = {
	/*
	实现可枚举接口。
	对hash对象中的每个元素进行迭代操作，迭代器被认为接收一个数组参数，数组的第一个元素是key，第二个元素是value
	同时，此数组对象还增加了两个属性key和value。分表表示键和值。
	*/
  _each: function(iterator) {
    for (key in this) {
      var value = this[key];
      if (typeof value == 'function') continue;//不处理方法
      var pair = [key, value];
      pair.key = key;
      pair.value = value;
      iterator(pair);
    }
  },
	/*
	返回所有的键组成的数组
	*/
  keys: function() {
    return this.pluck('key');
  },
	/*
	返回所有的值组成的数组
	*/
  values: function() {
    return this.pluck('value');
  },
	/*
	将两个hash对象合并，如果键相同，则用参数中相应键对应的值覆盖调用者的。
	*/
  merge: function(hash) {
    return $H(hash).inject($H(this), function(mergedHash, pair) {
      mergedHash[pair.key] = pair.value;
      return mergedHash;
    });
  },
	/*
	将hash对象转换为查询字符串表示的形式
	*/
  toQueryString: function() {
    return this.map(function(pair) {
      return pair.map(encodeURIComponent).join('=');
    }).join('&');
  },
	/*
	获取hash对象的字符串表示
	*/
  inspect: function() {
    return '#<Hash:{' + this.map(function(pair) {
      return pair.map(Object.inspect).join(': ');
    }).join(', ') + '}>';
  }
}
 
/*
将一个对象转换为哈希对象，对象的属性名（方法名）作为key，值作为value
同时hash对象也是一个可枚举对象
*/
function $H(object) {
/*
object || {}使得参数为空时也能够创建一个hash对象
*/
var hash = Object.extend({}, object || {});
Object.extend(hash, Enumerable);
Object.extend(hash, Hash);
return hash;
}
 
/*
又一个实现Enumerable接口的对象。
有了这个类，基本上就可以完全避免使用for循环了，一个例子，计算1到100的和：
传统写法：
var s=0;
for(var i=0;i<=100;i++){
	s+=i;
}
document.write(s);
 
使用ObjectRange：
var s=$R(0,100,false).inject(0,function(s,i){
	return s+i;
});
document.write(s);
*/
ObjectRange = Class.create();
Object.extend(ObjectRange.prototype, Enumerable);
Object.extend(ObjectRange.prototype, {
	/*
	构造函数，start表示开始的位置，end表示结束的位置，exclusive表示是否排除最后一个索引位置
	exclusive＝true时对应于：
	for(var i=start;i<end;i++){
		//语句
	}
	exclusive=false时对应于：
	for(var i=start;i<=end;i++){
		//语句
	}
	*/
  initialize: function(start, end, exclusive) {
    this.start = start;
    this.end = end;
    this.exclusive = exclusive;
  },
	/*
	实现枚举接口的_each方法
	相当于：
	for(var i=start;i<end;i++){
		iterator(i);
	}
	*/
  _each: function(iterator) {
    var value = this.start;
    do {
      iterator(value);
      value = value.succ();
    } while (this.include(value));
  },
	/*
	判断是否包含指定的索引
	*/
  include: function(value) {
    if (value < this.start)
      return false;
    if (this.exclusive)
      return value < this.end;
    return value <= this.end;
  }
});
/*
做一个快速链接，用于生成ObjectRange对象
*/
var $R = function(start, end, exclusive) {
  return new ObjectRange(start, end, exclusive);
}
 
/*
封装XMLHttpRequest的相关操作
*/
var Ajax = {
//浏览器兼容的获取XMLHttpRequest对象的函数
getTransport: function() {
return Try.these(
function() {return new ActiveXObject('Msxml2.XMLHTTP')},
function() {return new ActiveXObject('Microsoft.XMLHTTP')},
function() {return new XMLHttpRequest()}
) || false;
},
//当前激活的请求数目
activeRequestCount: 0
}
 
/*
Ajax的返回值
*/
Ajax.Responders = {
  responders: [],
 
	//实现枚举接口的_each方法
  _each: function(iterator) {
    this.responders._each(iterator);
  },
 
  register: function(responderToAdd) {
    if (!this.include(responderToAdd))
      this.responders.push(responderToAdd);
  },
 
  unregister: function(responderToRemove) {
    this.responders = this.responders.without(responderToRemove);
  },
 
  dispatch: function(callback, request, transport, json) {
    this.each(function(responder) {
      if (responder[callback] && typeof responder[callback] == 'function') {
        try {
          responder[callback].apply(responder, [request, transport, json]);
        } catch (e) {}
      }
    });
  }
};
/*
让Ajax.Responders可枚举迭代
*/
Object.extend(Ajax.Responders, Enumerable);
 
Ajax.Responders.register({
onCreate: function() {
Ajax.activeRequestCount++;
},
 
onComplete: function() {
Ajax.activeRequestCount--;
}
});
 
//定义Ajax的基类
Ajax.Base = function() {};
Ajax.Base.prototype = {
	/*
	设置XMLHttp调用的参数，提供了默认值：method:'post',异步，无参数
	*/
  setOptions: function(options) {
    this.options = {
      method:       'post',
      asynchronous: true,
      parameters:   ''
    }
    Object.extend(this.options, options || {});
  },
	/*
	判断请求是否成功
	*/
  responseIsSuccess: function() {
    return this.transport.status == undefined
        || this.transport.status == 0
        || (this.transport.status >= 200 && this.transport.status < 300);
  },
	/*
	判断请求是否失败
	*/
  responseIsFailure: function() {
    return !this.responseIsSuccess();
  }
}
 
//定义一个Ajax请求类
Ajax.Request = Class.create();
Ajax.Request.Events =
  ['Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete'];
 
Ajax.Request.prototype = Object.extend(new Ajax.Base(), {
  initialize: function(url, options) {
    this.transport = Ajax.getTransport();
    this.setOptions(options);
    this.request(url);
  },
 
  request: function(url) {
    var parameters = this.options.parameters || '';
    if (parameters.length > 0) parameters += '&_=';
 
    try {
      this.url = url;
      if (this.options.method == 'get' && parameters.length > 0)
        this.url += (this.url.match(/\?/) ? '&' : '?') + parameters;
 
      Ajax.Responders.dispatch('onCreate', this, this.transport);
 
      this.transport.open(this.options.method, this.url,
        this.options.asynchronous);
 
      if (this.options.asynchronous) {
        this.transport.onreadystatechange = this.onStateChange.bind(this);
        setTimeout((function() {this.respondToReadyState(1)}).bind(this), 10);
      }
 
      this.setRequestHeaders();
 
      var body = this.options.postBody ? this.options.postBody : parameters;
      this.transport.send(this.options.method == 'post' ? body : null);
 
    } catch (e) {
      this.dispatchException(e);
    }
  },
 
  setRequestHeaders: function() {
    var requestHeaders =
      ['X-Requested-With', 'XMLHttpRequest',
       'X-Prototype-Version', Prototype.Version];
 
    if (this.options.method == 'post') {
      requestHeaders.push('Content-type',
        'application/x-www-form-urlencoded');
 
      /* Force "Connection: close" for Mozilla browsers to work around
       * a bug where XMLHttpReqeuest sends an incorrect Content-length
       * header. See Mozilla Bugzilla #246651.
       */
      if (this.transport.overrideMimeType)
        requestHeaders.push('Connection', 'close');
    }
 
    if (this.options.requestHeaders)
      requestHeaders.push.apply(requestHeaders, this.options.requestHeaders);
 
    for (var i = 0; i < requestHeaders.length; i += 2)
      this.transport.setRequestHeader(requestHeaders[i], requestHeaders[i+1]);
  },
 
  onStateChange: function() {
    var readyState = this.transport.readyState;
    if (readyState != 1)
      this.respondToReadyState(this.transport.readyState);
  },
 
  header: function(name) {
    try {
      return this.transport.getResponseHeader(name);
    } catch (e) {}
  },
 
  evalJSON: function() {
    try {
      return eval(this.header('X-JSON'));
    } catch (e) {}
  },
 
  evalResponse: function() {
    try {
      return eval(this.transport.responseText);
    } catch (e) {
      this.dispatchException(e);
    }
  },
 
  respondToReadyState: function(readyState) {
    var event = Ajax.Request.Events[readyState];
    var transport = this.transport, json = this.evalJSON();
 
    if (event == 'Complete') {
      try {
        (this.options['on' + this.transport.status]
         || this.options['on' + (this.responseIsSuccess() ? 'Success' : 'Failure')]
         || Prototype.emptyFunction)(transport, json);
      } catch (e) {
        this.dispatchException(e);
      }
 
      if ((this.header('Content-type') || '').match(/^text\/javascript/i))
        this.evalResponse();
    }
 
    try {
      (this.options['on' + event] || Prototype.emptyFunction)(transport, json);
      Ajax.Responders.dispatch('on' + event, this, transport, json);
    } catch (e) {
      this.dispatchException(e);
    }
 
    /* Avoid memory leak in MSIE: clean up the oncomplete event handler */
    if (event == 'Complete')
      this.transport.onreadystatechange = Prototype.emptyFunction;
  },
 
  dispatchException: function(exception) {
    (this.options.onException || Prototype.emptyFunction)(this, exception);
    Ajax.Responders.dispatch('onException', this, exception);
  }
});
 
Ajax.Updater = Class.create();
 
Object.extend(Object.extend(Ajax.Updater.prototype, Ajax.Request.prototype), {
  initialize: function(container, url, options) {
    this.containers = {
      success: container.success ? $(container.success) : $(container),
      failure: container.failure ? $(container.failure) :
        (container.success ? null : $(container))
    }
 
    this.transport = Ajax.getTransport();
    this.setOptions(options);
 
    var onComplete = this.options.onComplete || Prototype.emptyFunction;
    this.options.onComplete = (function(transport, object) {
      this.updateContent();
      onComplete(transport, object);
    }).bind(this);
 
    this.request(url);
  },
 
  updateContent: function() {
    var receiver = this.responseIsSuccess() ?
      this.containers.success : this.containers.failure;
    var response = this.transport.responseText;
 
    if (!this.options.evalScripts)
      response = response.stripScripts();
 
    if (receiver) {
      if (this.options.insertion) {
        new this.options.insertion(receiver, response);
      } else {
        Element.update(receiver, response);
      }
    }
 
    if (this.responseIsSuccess()) {
      if (this.onComplete)
        setTimeout(this.onComplete.bind(this), 10);
    }
  }
});
 
Ajax.PeriodicalUpdater = Class.create();
Ajax.PeriodicalUpdater.prototype = Object.extend(new Ajax.Base(), {
  initialize: function(container, url, options) {
    this.setOptions(options);
    this.onComplete = this.options.onComplete;
 
    this.frequency = (this.options.frequency || 2);
    this.decay = (this.options.decay || 1);
 
    this.updater = {};
    this.container = container;
    this.url = url;
 
    this.start();
  },
 
  start: function() {
    this.options.onComplete = this.updateComplete.bind(this);
    this.onTimerEvent();
  },
 
  stop: function() {
    this.updater.onComplete = undefined;
    clearTimeout(this.timer);
    (this.onComplete || Prototype.emptyFunction).apply(this, arguments);
  },
 
  updateComplete: function(request) {
    if (this.options.decay) {
      this.decay = (request.responseText == this.lastText ?
        this.decay * this.options.decay : 1);
 
      this.lastText = request.responseText;
    }
    this.timer = setTimeout(this.onTimerEvent.bind(this),
      this.decay * this.frequency * 1000);
  },
 
  onTimerEvent: function() {
    this.updater = new Ajax.Updater(this.container, this.url, this.options);
  }
});
document.getElementsByClassName = function(className, parentElement) {
  var children = ($(parentElement) || document.body).getElementsByTagName('*');
  return $A(children).inject([], function(elements, child) {
    if (child.className.match(new RegExp("(^|\\s)" + className + "(\\s|$)")))
      elements.push(child);
    return elements;
  });
}
 
/*--------------------------------------------------------------------------*/
//定义一些Html节点通用的操作
if (!window.Element) {
  var Element = new Object();
}
 
 
Object.extend(Element, {
	/*
	判断节点是否可见
	*/
  visible: function(element) {
    return $(element).style.display != 'none';
  },
	/*
	切换节点的可见状态
	*/
  toggle: function() {
    for (var i = 0; i < arguments.length; i++) {
      var element = $(arguments[i]);
      Element[Element.visible(element) ? 'hide' : 'show'](element);
    }
  },
	/*
	隐藏参数所指定的节点
	*/
  hide: function() {
    for (var i = 0; i < arguments.length; i++) {
      var element = $(arguments[i]);
      element.style.display = 'none';
    }
  },
	/*
	显示参数所指定的节点
	*/
  show: function() {
    for (var i = 0; i < arguments.length; i++) {
      var element = $(arguments[i]);
      element.style.display = '';
    }
  },
	/*
	删除一个节点
	*/
  remove: function(element) {
    element = $(element);
    element.parentNode.removeChild(element);
  },
	/*
	用指定html填充element表示的节点
	setTimeout是极具技巧的用法，让人惊叹。
	update函数之所以会取代：element.innerHTML=html的用法，主要因为它实现了浏览器的兼容性：
	（1）对于IE，如果给innerHTML赋值的字符串中含有脚本标记，脚本是被忽略的，不起作用；而firefox则会执行脚本；
	（2）setTimeout使得可以在函数内可以通过eval定义全局函数，这是由于setTimeout的默认空间就是全局空间决定的（它是window对象的方法，而所有全局变量和全局函数实际上都是window对象的属性和方法）。
	*/
  update: function(element, html) {
    $(element).innerHTML = html.stripScripts();
    setTimeout(function() {html.evalScripts()}, 10);
  },
	//获取节点的高度
  getHeight: function(element) {
    element = $(element);
    return element.offsetHeight;
  },
	//获取一个元素的class，返回一个数组，包括了所有的class名称，ClassNames后面实现
  classNames: function(element) {
    return new Element.ClassNames(element);
  },
	/*判断一个元素是否具有指定的class值*/
  hasClassName: function(element, className) {
    if (!(element = $(element))) return;
    return Element.classNames(element).include(className);
  },
	//为一个节点添加class名称
  addClassName: function(element, className) {
    if (!(element = $(element))) return;
    return Element.classNames(element).add(className);
  },
	//从一个节点移除一个class名称
  removeClassName: function(element, className) {
    if (!(element = $(element))) return;
    return Element.classNames(element).remove(className);
  },
 
  // removes whitespace-only text node children
  //删除空白文本节点，使用此方法能够使得childNodes属性对所有浏览器兼容，否则ie不认为空白文本节点是子节点。而firefox则会认为这些节点是子节点。
  cleanWhitespace: function(element) {
    element = $(element);
    for (var i = 0; i < element.childNodes.length; i++) {
      var node = element.childNodes[i];
      if (node.nodeType == 3 && !/\S/.test(node.nodeValue))
        Element.remove(node);
    }
  },
	//判断一个节点是否为空，如果全是空白内容，也认为空
  empty: function(element) {
    return $(element).innerHTML.match(/^\s*$/);
  },
	/*
	将滚动条滚动到指定节点的位置
	*/
  scrollTo: function(element) {
    element = $(element);
    var x = element.x ? element.x : element.offsetLeft,
        y = element.y ? element.y : element.offsetTop;
    window.scrollTo(x, y);
  },
	/*
	得到指定节点的指定样式的绝对值。
	即可以获得继承得到的样式。
	*/
  getStyle: function(element, style) {
    element = $(element);
    var value = element.style[style.camelize()];
    if (!value) {
      if (document.defaultView && document.defaultView.getComputedStyle) {
        var css = document.defaultView.getComputedStyle(element, null);
        value = css ? css.getPropertyValue(style) : null;
      } else if (element.currentStyle) {
        value = element.currentStyle[style.camelize()];
      }
    }
 
    if (window.opera && ['left', 'top', 'right', 'bottom'].include(style))
      if (Element.getStyle(element, 'position') == 'static') value = 'auto';
 
    return value == 'auto' ? null : value;
  },
	/*
	设置指定节点的样式，这里可以由style参数同时指定多个属性
	例如：
	Element.setStyle($("someElement"),{color:'#ff0000',background-color:'#000000'});
	就将指定节点的样式设置为红字黑底
	*/
  setStyle: function(element, style) {
    element = $(element);
    for (name in style)
      element.style[name.camelize()] = style[name];
  },
 
	/*
	返回节点的宽度和高度，以{width:xx,height:xx}形式返回。
	该方法使得无论节点可见与否，都能够获取其显示时的大小。
	*/
  getDimensions: function(element) {
    element = $(element);
    if (Element.getStyle(element, 'display') != 'none')
      return {width: element.offsetWidth, height: element.offsetHeight};
 
    // All *Width and *Height properties give 0 on elements with display none,
    // so enable the element temporarily
    var els = element.style;
    var originalVisibility = els.visibility;
    var originalPosition = els.position;
    els.visibility = 'hidden';
    els.position = 'absolute';
    els.display = '';
    var originalWidth = element.clientWidth;
    var originalHeight = element.clientHeight;
    els.display = 'none';
    els.position = originalPosition;
    els.visibility = originalVisibility;
    return {width: originalWidth, height: originalHeight};
  },
	/*
	使的元素相对定位
	*/
  makePositioned: function(element) {
    element = $(element);
    var pos = Element.getStyle(element, 'position');
    if (pos == 'static' || !pos) {
      element._madePositioned = true;
      element.style.position = 'relative';
      // Opera returns the offset relative to the positioning context, when an
      // element is position relative but top and left have not been defined
      if (window.opera) {
        element.style.top = 0;
        element.style.left = 0;
      }
    }
  },
	/*
	取消节点的相对定位。
	*/
  undoPositioned: function(element) {
    element = $(element);
    if (element._madePositioned) {
      element._madePositioned = undefined;
      element.style.position =
        element.style.top =
        element.style.left =
        element.style.bottom =
        element.style.right = '';
    }
  },
	/*
	
	*/
  makeClipping: function(element) {
    element = $(element);
    if (element._overflow) return;
    element._overflow = element.style.overflow;
    if ((Element.getStyle(element, 'overflow') || 'visible') != 'hidden')
      element.style.overflow = 'hidden';
  },
 
  undoClipping: function(element) {
    element = $(element);
    if (element._overflow) return;
    element.style.overflow = element._overflow;
    element._overflow = undefined;
  }
});
 
var Toggle = new Object();
Toggle.display = Element.toggle;
 
/*--------------------------------------------------------------------------*/
 
Abstract.Insertion = function(adjacency) {
  this.adjacency = adjacency;
}
 
Abstract.Insertion.prototype = {
  initialize: function(element, content) {
    this.element = $(element);
    this.content = content.stripScripts();
 
    if (this.adjacency && this.element.insertAdjacentHTML) {
      try {
        this.element.insertAdjacentHTML(this.adjacency, this.content);
      } catch (e) {
        if (this.element.tagName.toLowerCase() == 'tbody') {
          this.insertContent(this.contentFromAnonymousTable());
        } else {
          throw e;
        }
      }
    } else {
      this.range = this.element.ownerDocument.createRange();
      if (this.initializeRange) this.initializeRange();
      this.insertContent([this.range.createContextualFragment(this.content)]);
    }
 
    setTimeout(function() {content.evalScripts()}, 10);
  },
 
  contentFromAnonymousTable: function() {
    var div = document.createElement('div');
    div.innerHTML = '<table><tbody>' + this.content + '</tbody></table>';
    return $A(div.childNodes[0].childNodes[0].childNodes);
  }
}
 
var Insertion = new Object();
 
Insertion.Before = Class.create();
Insertion.Before.prototype = Object.extend(new Abstract.Insertion('beforeBegin'), {
  initializeRange: function() {
    this.range.setStartBefore(this.element);
  },
 
  insertContent: function(fragments) {
    fragments.each((function(fragment) {
      this.element.parentNode.insertBefore(fragment, this.element);
    }).bind(this));
  }
});
 
Insertion.Top = Class.create();
Insertion.Top.prototype = Object.extend(new Abstract.Insertion('afterBegin'), {
  initializeRange: function() {
    this.range.selectNodeContents(this.element);
    this.range.collapse(true);
  },
 
  insertContent: function(fragments) {
    fragments.reverse(false).each((function(fragment) {
      this.element.insertBefore(fragment, this.element.firstChild);
    }).bind(this));
  }
});
 
Insertion.Bottom = Class.create();
Insertion.Bottom.prototype = Object.extend(new Abstract.Insertion('beforeEnd'), {
  initializeRange: function() {
    this.range.selectNodeContents(this.element);
    this.range.collapse(this.element);
  },
 
  insertContent: function(fragments) {
    fragments.each((function(fragment) {
      this.element.appendChild(fragment);
    }).bind(this));
  }
});
 
Insertion.After = Class.create();
Insertion.After.prototype = Object.extend(new Abstract.Insertion('afterEnd'), {
  initializeRange: function() {
    this.range.setStartAfter(this.element);
  },
 
  insertContent: function(fragments) {
    fragments.each((function(fragment) {
      this.element.parentNode.insertBefore(fragment,
        this.element.nextSibling);
    }).bind(this));
  }
});
 
/*--------------------------------------------------------------------------*/
 
Element.ClassNames = Class.create();
Element.ClassNames.prototype = {
  initialize: function(element) {
    this.element = $(element);
  },
 
  _each: function(iterator) {
    this.element.className.split(/\s+/).select(function(name) {
      return name.length > 0;
    })._each(iterator);
  },
 
  set: function(className) {
    this.element.className = className;
  },
 
  add: function(classNameToAdd) {
    if (this.include(classNameToAdd)) return;
    this.set(this.toArray().concat(classNameToAdd).join(' '));
  },
 
  remove: function(classNameToRemove) {
    if (!this.include(classNameToRemove)) return;
    this.set(this.select(function(className) {
      return className != classNameToRemove;
    }).join(' '));
  },
 
  toString: function() {
    return this.toArray().join(' ');
  }
}
 
Object.extend(Element.ClassNames.prototype, Enumerable);
 
 
 
 
var Field = {
  clear: function() {
    for (var i = 0; i < arguments.length; i++)
      $(arguments[i]).value = '';
  },
 
  focus: function(element) {
    $(element).focus();
  },
 
  present: function() {
    for (var i = 0; i < arguments.length; i++)
      if ($(arguments[i]).value == '') return false;
    return true;
  },
 
  select: function(element) {
    $(element).select();
  },
 
  activate: function(element) {
    element = $(element);
    element.focus();
    if (element.select)
      element.select();
  }
}
 
/*--------------------------------------------------------------------------*/
 
var Form = {
  serialize: function(form) {
    var elements = Form.getElements($(form));
    var queryComponents = new Array();
 
    for (var i = 0; i < elements.length; i++) {
      var queryComponent = Form.Element.serialize(elements[i]);
      if (queryComponent)
        queryComponents.push(queryComponent);
    }
 
    return queryComponents.join('&');
  },
 
  getElements: function(form) {
    form = $(form);
    var elements = new Array();
 
    for (tagName in Form.Element.Serializers) {
      var tagElements = form.getElementsByTagName(tagName);
      for (var j = 0; j < tagElements.length; j++)
        elements.push(tagElements[j]);
    }
    return elements;
  },
 
  getInputs: function(form, typeName, name) {
    form = $(form);
    var inputs = form.getElementsByTagName('input');
 
    if (!typeName && !name)
      return inputs;
 
    var matchingInputs = new Array();
    for (var i = 0; i < inputs.length; i++) {
      var input = inputs[i];
      if ((typeName && input.type != typeName) ||
          (name && input.name != name))
        continue;
      matchingInputs.push(input);
    }
 
    return matchingInputs;
  },
 
  disable: function(form) {
    var elements = Form.getElements(form);
    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      element.blur();
      element.disabled = 'true';
    }
  },
 
  enable: function(form) {
    var elements = Form.getElements(form);
    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      element.disabled = '';
    }
  },
 
  findFirstElement: function(form) {
    return Form.getElements(form).find(function(element) {
      return element.type != 'hidden' && !element.disabled &&
        ['input', 'select', 'textarea'].include(element.tagName.toLowerCase());
    });
  },
 
  focusFirstElement: function(form) {
    Field.activate(Form.findFirstElement(form));
  },
 
  reset: function(form) {
    $(form).reset();
  }
}
 
Form.Element = {
  serialize: function(element) {
    element = $(element);
    var method = element.tagName.toLowerCase();
    var parameter = Form.Element.Serializers[method](element);
 
    if (parameter) {
      var key = encodeURIComponent(parameter[0]);
      if (key.length == 0) return;
 
      if (parameter[1].constructor != Array)
        parameter[1] = [parameter[1]];
 
      return parameter[1].map(function(value) {
        return key + '=' + encodeURIComponent(value);
      }).join('&');
    }
  },
 
  getValue: function(element) {
    element = $(element);
    var method = element.tagName.toLowerCase();
    var parameter = Form.Element.Serializers[method](element);
 
    if (parameter)
      return parameter[1];
  }
}
 
Form.Element.Serializers = {
	//对input标记序列化
  input: function(element) {
    switch (element.type.toLowerCase()) {
      case 'submit':
      case 'hidden':
      case 'password':
      case 'text':
        return Form.Element.Serializers.textarea(element);
      case 'checkbox':
      case 'radio':
        return Form.Element.Serializers.inputSelector(element);
    }
    return false;
  },
	//对单选框和复选框序列化
  inputSelector: function(element) {
    if (element.checked)
      return [element.name, element.value];
  },
	//对文本框序列化
  textarea: function(element) {
    return [element.name, element.value];
  },
	//对下拉列表框序列化
  select: function(element) {
    return Form.Element.Serializers[element.type == 'select-one' ?
      'selectOne' : 'selectMany'](element);
  },
	//对单选下拉列表框序列化
  selectOne: function(element) {
    var value = '', opt, index = element.selectedIndex;
    if (index >= 0) {
      opt = element.options[index];
      value = opt.value;
      if (!value && !('value' in opt))
        value = opt.text;
    }
    return [element.name, value];
  },
	//对多选下拉列表框序列化
  selectMany: function(element) {
    var value = new Array();
    for (var i = 0; i < element.length; i++) {
      var opt = element.options[i];
      if (opt.selected) {
        var optValue = opt.value;
        if (!optValue && !('value' in opt))
          optValue = opt.text;
        value.push(optValue);
      }
    }
    return [element.name, value];
  }
}
 
/*--------------------------------------------------------------------------*/
 
var $F = Form.Element.getValue;
 
/*--------------------------------------------------------------------------*/
 
Abstract.TimedObserver = function() {}
Abstract.TimedObserver.prototype = {
  initialize: function(element, frequency, callback) {
    this.frequency = frequency;
    this.element   = $(element);
    this.callback  = callback;
 
    this.lastValue = this.getValue();
    this.registerCallback();
  },
 
  registerCallback: function() {
    setInterval(this.onTimerEvent.bind(this), this.frequency * 1000);
  },
 
  onTimerEvent: function() {
    var value = this.getValue();
    if (this.lastValue != value) {
      this.callback(this.element, value);
      this.lastValue = value;
    }
  }
}
 
Form.Element.Observer = Class.create();
Form.Element.Observer.prototype = Object.extend(new Abstract.TimedObserver(), {
  getValue: function() {
    return Form.Element.getValue(this.element);
  }
});
 
Form.Observer = Class.create();
Form.Observer.prototype = Object.extend(new Abstract.TimedObserver(), {
  getValue: function() {
    return Form.serialize(this.element);
  }
});
 
/*--------------------------------------------------------------------------*/
 
Abstract.EventObserver = function() {}
Abstract.EventObserver.prototype = {
  initialize: function(element, callback) {
    this.element  = $(element);
    this.callback = callback;
 
    this.lastValue = this.getValue();
    if (this.element.tagName.toLowerCase() == 'form')
      this.registerFormCallbacks();
    else
      this.registerCallback(this.element);
  },
 
  onElementEvent: function() {
    var value = this.getValue();
    if (this.lastValue != value) {
      this.callback(this.element, value);
      this.lastValue = value;
    }
  },
 
  registerFormCallbacks: function() {
    var elements = Form.getElements(this.element);
    for (var i = 0; i < elements.length; i++)
      this.registerCallback(elements[i]);
  },
 
  registerCallback: function(element) {
    if (element.type) {
      switch (element.type.toLowerCase()) {
        case 'checkbox':
        case 'radio':
          Event.observe(element, 'click', this.onElementEvent.bind(this));
          break;
        case 'password':
        case 'text':
        case 'textarea':
        case 'select-one':
        case 'select-multiple':
          Event.observe(element, 'change', this.onElementEvent.bind(this));
          break;
      }
    }
  }
}
 
Form.Element.EventObserver = Class.create();
Form.Element.EventObserver.prototype = Object.extend(new Abstract.EventObserver(), {
  getValue: function() {
    return Form.Element.getValue(this.element);
  }
});
 
Form.EventObserver = Class.create();
Form.EventObserver.prototype = Object.extend(new Abstract.EventObserver(), {
  getValue: function() {
    return Form.serialize(this.element);
  }
});
if (!window.Event) {
  var Event = new Object();
}
 
Object.extend(Event, {
  KEY_BACKSPACE: 8,
  KEY_TAB:       9,
  KEY_RETURN:   13,
  KEY_ESC:      27,
  KEY_LEFT:     37,
  KEY_UP:       38,
  KEY_RIGHT:    39,
  KEY_DOWN:     40,
  KEY_DELETE:   46,
 
  element: function(event) {
    return event.target || event.srcElement;
  },
 
  isLeftClick: function(event) {
    return (((event.which) && (event.which == 1)) ||
            ((event.button) && (event.button == 1)));
  },
 
  pointerX: function(event) {
    return event.pageX || (event.clientX +
      (document.documentElement.scrollLeft || document.body.scrollLeft));
  },
 
  pointerY: function(event) {
    return event.pageY || (event.clientY +
      (document.documentElement.scrollTop || document.body.scrollTop));
  },
 
  stop: function(event) {
    if (event.preventDefault) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.returnValue = false;
      event.cancelBubble = true;
    }
  },
 
  // find the first node with the given tagName, starting from the
  // node the event was triggered on; traverses the DOM upwards
  findElement: function(event, tagName) {
    var element = Event.element(event);
    while (element.parentNode && (!element.tagName ||
        (element.tagName.toUpperCase() != tagName.toUpperCase())))
      element = element.parentNode;
    return element;
  },
 
  observers: false,
 
  _observeAndCache: function(element, name, observer, useCapture) {
    if (!this.observers) this.observers = [];
    if (element.addEventListener) {
      this.observers.push([element, name, observer, useCapture]);
      element.addEventListener(name, observer, useCapture);
    } else if (element.attachEvent) {
      this.observers.push([element, name, observer, useCapture]);
      element.attachEvent('on' + name, observer);
    }
  },
 
  unloadCache: function() {
    if (!Event.observers) return;
    for (var i = 0; i < Event.observers.length; i++) {
      Event.stopObserving.apply(this, Event.observers[i]);
      Event.observers[i][0] = null;
    }
    Event.observers = false;
  },
 
  observe: function(element, name, observer, useCapture) {
    var element = $(element);
    useCapture = useCapture || false;
 
    if (name == 'keypress' &&
        (navigator.appVersion.match(/Konqueror|Safari|KHTML/)
        || element.attachEvent))
      name = 'keydown';
 
    this._observeAndCache(element, name, observer, useCapture);
  },
 
  stopObserving: function(element, name, observer, useCapture) {
    var element = $(element);
    useCapture = useCapture || false;
 
    if (name == 'keypress' &&
        (navigator.appVersion.match(/Konqueror|Safari|KHTML/)
        || element.detachEvent))
      name = 'keydown';
 
    if (element.removeEventListener) {
      element.removeEventListener(name, observer, useCapture);
    } else if (element.detachEvent) {
      element.detachEvent('on' + name, observer);
    }
  }
});
 
/* prevent memory leaks in IE */
Event.observe(window, 'unload', Event.unloadCache, false);
var Position = {
  // set to true if needed, warning: firefox performance problems
  // NOT neeeded for page scrolling, only if draggable contained in
  // scrollable elements
  includeScrollOffsets: false,
 
  // must be called before calling withinIncludingScrolloffset, every time the
  // page is scrolled
  prepare: function() {
    this.deltaX =  window.pageXOffset
                || document.documentElement.scrollLeft
                || document.body.scrollLeft
                || 0;
    this.deltaY =  window.pageYOffset
                || document.documentElement.scrollTop
                || document.body.scrollTop
                || 0;
  },
 
  realOffset: function(element) {
    var valueT = 0, valueL = 0;
    do {
      valueT += element.scrollTop  || 0;
      valueL += element.scrollLeft || 0;
      element = element.parentNode;
    } while (element);
    return [valueL, valueT];
  },
 
  cumulativeOffset: function(element) {
    var valueT = 0, valueL = 0;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;
      element = element.offsetParent;
    } while (element);
    return [valueL, valueT];
  },
 
  positionedOffset: function(element) {
    var valueT = 0, valueL = 0;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;
      element = element.offsetParent;
      if (element) {
        p = Element.getStyle(element, 'position');
        if (p == 'relative' || p == 'absolute') break;
      }
    } while (element);
    return [valueL, valueT];
  },
 
  offsetParent: function(element) {
    if (element.offsetParent) return element.offsetParent;
    if (element == document.body) return element;
 
    while ((element = element.parentNode) && element != document.body)
      if (Element.getStyle(element, 'position') != 'static')
        return element;
 
    return document.body;
  },
 
  // caches x/y coordinate pair to use with overlap
  within: function(element, x, y) {
    if (this.includeScrollOffsets)
      return this.withinIncludingScrolloffsets(element, x, y);
    this.xcomp = x;
    this.ycomp = y;
    this.offset = this.cumulativeOffset(element);
 
    return (y >= this.offset[1] &&
            y <  this.offset[1] + element.offsetHeight &&
            x >= this.offset[0] &&
            x <  this.offset[0] + element.offsetWidth);
  },
 
  withinIncludingScrolloffsets: function(element, x, y) {
    var offsetcache = this.realOffset(element);
 
    this.xcomp = x + offsetcache[0] - this.deltaX;
    this.ycomp = y + offsetcache[1] - this.deltaY;
    this.offset = this.cumulativeOffset(element);
 
    return (this.ycomp >= this.offset[1] &&
            this.ycomp <  this.offset[1] + element.offsetHeight &&
            this.xcomp >= this.offset[0] &&
            this.xcomp <  this.offset[0] + element.offsetWidth);
  },
 
  // within must be called directly before
  overlap: function(mode, element) {
    if (!mode) return 0;
    if (mode == 'vertical')
      return ((this.offset[1] + element.offsetHeight) - this.ycomp) /
        element.offsetHeight;
    if (mode == 'horizontal')
      return ((this.offset[0] + element.offsetWidth) - this.xcomp) /
        element.offsetWidth;
  },
 
  clone: function(source, target) {
    source = $(source);
    target = $(target);
    target.style.position = 'absolute';
    var offsets = this.cumulativeOffset(source);
    target.style.top    = offsets[1] + 'px';
    target.style.left   = offsets[0] + 'px';
    target.style.width  = source.offsetWidth + 'px';
    target.style.height = source.offsetHeight + 'px';
  },
 
  page: function(forElement) {
    var valueT = 0, valueL = 0;
 
    var element = forElement;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;
 
      // Safari fix
      if (element.offsetParent==document.body)
        if (Element.getStyle(element,'position')=='absolute') break;
 
    } while (element = element.offsetParent);
 
    element = forElement;
    do {
      valueT -= element.scrollTop  || 0;
      valueL -= element.scrollLeft || 0;
    } while (element = element.parentNode);
 
    return [valueL, valueT];
  },
 
  clone: function(source, target) {
    var options = Object.extend({
      setLeft:    true,
      setTop:     true,
      setWidth:   true,
      setHeight:  true,
      offsetTop:  0,
      offsetLeft: 0
    }, arguments[2] || {})
 
    // find page position of source
    source = $(source);
    var p = Position.page(source);
 
    // find coordinate system to use
    target = $(target);
    var delta = [0, 0];
    var parent = null;
    // delta [0,0] will do fine with position: fixed elements,
    // position:absolute needs offsetParent deltas
    if (Element.getStyle(target,'position') == 'absolute') {
      parent = Position.offsetParent(target);
      delta = Position.page(parent);
    }
 
    // correct by body offsets (fixes Safari)
    if (parent == document.body) {
      delta[0] -= document.body.offsetLeft;
      delta[1] -= document.body.offsetTop;
    }
 
    // set position
    if(options.setLeft)   target.style.left  = (p[0] - delta[0] + options.offsetLeft) + 'px';
    if(options.setTop)    target.style.top   = (p[1] - delta[1] + options.offsetTop) + 'px';
    if(options.setWidth)  target.style.width = source.offsetWidth + 'px';
    if(options.setHeight) target.style.height = source.offsetHeight + 'px';
  },
 
  absolutize: function(element) {
    element = $(element);
    if (element.style.position == 'absolute') return;
    Position.prepare();
 
    var offsets = Position.positionedOffset(element);
    var top     = offsets[1];
    var left    = offsets[0];
    var width   = element.clientWidth;
    var height  = element.clientHeight;
 
    element._originalLeft   = left - parseFloat(element.style.left  || 0);
    element._originalTop    = top  - parseFloat(element.style.top || 0);
    element._originalWidth  = element.style.width;
    element._originalHeight = element.style.height;
 
    element.style.position = 'absolute';
    element.style.top    = top + 'px';;
    element.style.left   = left + 'px';;
    element.style.width  = width + 'px';;
    element.style.height = height + 'px';;
  },
 
  relativize: function(element) {
    element = $(element);
    if (element.style.position == 'relative') return;
    Position.prepare();
 
    element.style.position = 'relative';
    var top  = parseFloat(element.style.top  || 0) - (element._originalTop || 0);
    var left = parseFloat(element.style.left || 0) - (element._originalLeft || 0);
 
    element.style.top    = top + 'px';
    element.style.left   = left + 'px';
    element.style.height = element._originalHeight;
    element.style.width  = element._originalWidth;
  }
}
 
// Safari returns margins on body which is incorrect if the child is absolutely
// positioned.  For performance reasons, redefine Position.cumulativeOffset for
// KHTML/WebKit only.
if (/Konqueror|Safari|KHTML/.test(navigator.userAgent)) {
  Position.cumulativeOffset = function(element) {
    var valueT = 0, valueL = 0;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;
      if (element.offsetParent == document.body)
        if (Element.getStyle(element, 'position') == 'absolute') break;
 
      element = element.offsetParent;
    } while (element);
 
    return [valueL, valueT];
  }
}

