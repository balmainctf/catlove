/*  Prototype JavaScript framework, version 1.5.1.1  
 *  (c) 2005-2007 Sam Stephenson  
 *  
 *  Prototype is freely distributable under the terms of an MIT-style license.  
 *  For details, see the Prototype web site: http://www.prototypejs.org/  
 *  
/*--------------------------------------------------------------------------*/  
  
/*一个新建对象，包含当前Prototype的版本以及当前浏览器信息*/  
var Prototype = {   
  Version: '1.5.1.1',   
  
/*这个方法用的很巧，将一个NaN或者undefined对象通过两次!运算，得到false*/  
  Browser: {   
    IE:     !!(window.attachEvent && !window.opera),   
    Opera:  !!window.opera,   
    WebKit: navigator.userAgent.indexOf('AppleWebKit/') > -1,   
    Gecko:  navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') == -1   
  },   
  
/*IE6.0和Firefox2.0都不支持XPath*/  
/*IE6.0不支持ElementExtensions,Firefox则支持*/  
  BrowserFeatures: {   
    XPath: !!document.evaluate,   
    ElementExtensions: !!window.HTMLElement,   
    SpecificElementExtensions:   
      (document.createElement('div').__proto__ !==   
       document.createElement('form').__proto__)   
  },   
  
/*正则，用来抽取出页面上用<script ...> ... </script>标记的代码段*/  
  ScriptFragment: '<script[^>]*>([//S//s]*?)<//script>',   
  JSONFilter: /^///*-secure-([/s/S]*)/*///s*$/,   
  
/*定义一个空函数*/  
  emptyFunction: function() { },   
/*暂时不明白定义这个函数的用意*/  
  K: function(x) { return x }   
}   
  
/*定义了一个对象Class，抵用Class.create会返回一个function，返回的function代码为  
function() {  
    this.initialize.apply(this.arguments);  
}  
当调用返回的这个function或者使用new关键字的时候会调用function中定义的initialize方法  
*/  
var Class = {   
  create: function() {   
    return function() {   
      this.initialize.apply(this, arguments);   
    }   
  }   
}   
  
var Abstract = new Object();   
  
/*定义了一个方法叫做extend，意思是把source中的属性，函数等都复制到destination这个对象里面去，  
有点儿ruby中mixin的味道*/  
Object.extend = function(destination, source) {   
  for (var property in source) {   
    destination[property] = source[property];   
  }   
  return destination;   
}   
  
/*  
给Object类新增加一个新的类方法，名叫inspect  
用法Object.inspect(obj);  
输出为一个字符串，代表obj的类新名称  
*/  
Object.extend(Object, {   
  inspect: function(object) {   
    try {   
      if (object === undefined) return 'undefined';   
      if (object === null) return 'null';   
/*object.inspect?  意思是如果object定义了inspect方法，则执行inspect  
和ruby中的duck type有异曲同工之妙，只不过js中更加直接，不需要ruby中的respond_to?了*/  
      return object.inspect ? object.inspect() : object.toString();   
    } catch (e) {   
      if (e instanceof RangeError) return '...';   
      throw e;   
    }   
  },   
  
  toJSON: function(object) {   
    var type = typeof object;   
    switch(type) {   
      case 'undefined':   
      case 'function':   
      case 'unknown': return;   
      case 'boolean': return object.toString();   
    }   
    if (object === null) return 'null';   
    if (object.toJSON) return object.toJSON();   
    if (object.ownerDocument === document) return;   
    var results = [];   
    for (var property in object) {   
      var value = Object.toJSON(object[property]);   
      if (value !== undefined)   
        results.push(property.toJSON() + ': ' + value);   
    }   
    return '{' + results.join(', ') + '}';   
  },   
  
/*把对象当哈希使唤。。。  
当然js中这是再常用不过的了*/  
  keys: function(object) {   
    var keys = [];   
    for (var property in object)   
      keys.push(property);   
    return keys;   
  },   
  
  values: function(object) {   
    var values = [];   
    for (var property in object)   
      values.push(object[property]);   
    return values;   
  },   
  
/*建立对象的浅拷贝,仅仅复制字段和引用*/  
  clone: function(object) {   
    return Object.extend({}, object);   
  }   
});   
  
/*给function添加一个bind方法，以便把某个方法的执行绑定到一个对象上，也就是说在一个指定对象的上下文中执行本方法*/  
Function.prototype.bind = function() {   
/*注意此处__method变量和this的用法，这是为了避免this指向错误的上下文环境*/  
  var __method = this, args = $A(arguments), object = args.shift();   
  return function() {   
    return __method.apply(object, args.concat($A(arguments)));   
  }   
}   
  
/*把function绑定到一个对象上作为事件处理函数*/  
Function.prototype.bindAsEventListener = function(object) {   
  var __method = this, args = $A(arguments), object = args.shift();   
  return function(event) {   
/*为了兼容IE，使用[event || window.event]*/  
    return __method.apply(object, [event || window.event].concat(args));   
  }   
}   
  
/*为数值类型增加了  
toColorPart,  
succ,  
times,  
toPaddedString,  
toJSON  
方法*/  
Object.extend(Number.prototype, {   
  toColorPart: function() {   
    return this.toPaddedString(2, 16);   
  },   
  
  succ: function() {   
    return this + 1;   
  },   
  
  times: function(iterator) {   
    $R(0, this, true).each(iterator);   
    return this;   
  },   
  
  toPaddedString: function(length, radix) {   
    var string = this.toString(radix || 10);   
    return '0'.times(length - string.length) + string;   
  },   
  
  toJSON: function() {   
    return isFinite(this) ? this.toString() : 'null';   
  }   
});   
  
/*为日期类型增加toJSON方法*/  
Date.prototype.toJSON = function() {   
  return '"' + this.getFullYear() + '-' +   
    (this.getMonth() + 1).toPaddedString(2) + '-' +   
    this.getDate().toPaddedString(2) + 'T' +   
    this.getHours().toPaddedString(2) + ':' +   
    this.getMinutes().toPaddedString(2) + ':' +   
    this.getSeconds().toPaddedString(2) + '"';   
};   
  
/*Try.these(meth1,meth2,meth3...)  
会依次尝试执行meth1,meth2,meth3....，第一个成功执行的方法的结果被返回，剩下的方法不再执行*/  
var Try = {   
  these: function() {   
    var returnValue;   
  
    for (var i = 0, length = arguments.length; i < length; i++) {   
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
/*一个定时器*/  
/*usage:   
var timer = new PeriodicalExecuter(callback_function, frequency)  
顾名思义，第一个参数是定时器的回调函数，第二个参数是时间间隔,生成定时器的实例后，定时器自动开始执行  
timer.registerCallback; //启动定时器  
timer.stop; //终止定时器  
*/  
var PeriodicalExecuter = Class.create();   
PeriodicalExecuter.prototype = {   
  initialize: function(callback, frequency) {   
    this.callback = callback;   
    this.frequency = frequency;   
    this.currentlyExecuting = false;   
  
    this.registerCallback();   
  },   
  
  registerCallback: function() {   
    this.timer = setInterval(this.onTimerEvent.bind(this), this.frequency * 1000);   
  },   
  
  stop: function() {   
    if (!this.timer) return;   
    clearInterval(this.timer);   
    this.timer = null;   
  },   
  
  onTimerEvent: function() {   
    if (!this.currentlyExecuting) {   
      try {   
        this.currentlyExecuting = true;   
/*这里暂时不太理解，为什么callback要加上一个this参数？*/  
        this.callback(this);   
      } finally {   
        this.currentlyExecuting = false;   
      }   
    }   
  }   
}   
  
/*给String类增加了一个类方法interpret和一个静态哈希specialChar*/  
Object.extend(String, {   
  interpret: function(value) {   
/*String(value)相当于value.toString(); */  
    return value == null ? '' : String(value);   
  },   
/*一些转义字符*/  
  specialChar: {   
    '/b': '//b',   
    '/t': '//t',   
    '/n': '//n',   
    '/f': '//f',   
    '/r': '//r',   
    '//': '////'   
  }   
});   
  
/*String类的实例增加一些方法*/  
/*  
gsub,  
sub,  
scan,  
truncate,  
strip,  
stripTags,  
*/  
Object.extend(String.prototype, {   
/*gsub方法，replacement参数可以是一方法，也可是一个元素*/  
/*usage:  
  var str = somestring;  
  str.gsub(param1,param2);  
  其中params是用来匹配的字符串，也可是一个正则表达式，param2可以是一个用来替换的字符串，也可以是一个方法，这个方法一般定义为  
  function(match){...}  
  match为每一个匹配到的子字符串，在函数内部可以对子字符串进行处理，然后返回处理后的结果，举一个实际例子：  
  var str = "hello world!";  
  alert(str.gsub("o",function(match){ return match[0].succ(); } ));   
  弹出窗口显示"hellp,wprld!"  
*/  
  gsub: function(pattern, replacement) {   
    var result = '', source = this, match;   
/*假如某个字符串变量str调用了gsub方法，则在此会调用str的prepareReplacement方法  
此方法接收gsub的replacement变量作为参数*/  
    replacement = arguments.callee.prepareReplacement(replacement);   
/*source就是调用gsub方法的字符串对象本身*/  
    while (source.length > 0) {   
/*调用match方法进行匹配，找到第一个匹配的对象*/  
      if (match = source.match(pattern)) {   
/*截取开头到匹配位置的字符串，添加到result中*/  
        result += source.slice(0, match.index);   
/*替换匹配的字符串,然后加到result结尾*/  
        result += String.interpret(replacement(match));   
/*删除第一个被匹配元素以及之前的部分,进行下一个循环*/  
        source  = source.slice(match.index + match[0].length);   
      } else {   
        result += source, source = '';   
      }   
    }   
    return result;   
  },   
  
/*同gsub类似*/  
/*只替换前count个匹配对象*/  
  sub: function(pattern, replacement, count) {   
    replacement = this.gsub.prepareReplacement(replacement);   
    count = count === undefined ? 1 : count;   
  
    return this.gsub(pattern, function(match) {   
      if (--count < 0) return match[0];   
      return replacement(match);   
    });   
  },   
  
/*找到所有匹配对象，在每个对象上执行iterator中定义的方法*/  
  scan: function(pattern, iterator) {   
    this.gsub(pattern, iterator);   
    return this;   
  },   
  
/*截断函数，如果没有定义length就默认截断长度为30，没有定义truncation就默认为...*/  
/*usage:  
var str = "hello world";  
str.truncate(7,"..");  
此时str的内容变为"hello.."  
注意它直接修改了当前字符串对象的内容  
truncate的长度也计算到了length中  
*/  
  truncate: function(length, truncation) {   
    length = length || 30;   
    truncation = truncation === undefined ? '...' : truncation;   
    return this.length > length ?   
      this.slice(0, length - truncation.length) + truncation : this;   
  },   
  
/*去掉字符串开头和结尾的空格*/  
  strip: function() {   
    return this.replace(/^/s+/, '').replace(//s+$/, '');   
  },   
  
/*去除所有<xxxx>和</xxxx>这样的字符串*/  
  stripTags: function() {   
    return this.replace(/<//?[^>]+>/gi, '');   
  },   
  
/*这三个函数还不是很懂，等到以后功力长进一点儿了再看*/  
  stripScripts: function() {   
    return this.replace(new RegExp(Prototype.ScriptFragment, 'img'), '');   
  },   
  
  extractScripts: function() {   
    var matchAll = new RegExp(Prototype.ScriptFragment, 'img');   
    var matchOne = new RegExp(Prototype.ScriptFragment, 'im');   
    return (this.match(matchAll) || []).map(function(scriptTag) {   
      return (scriptTag.match(matchOne) || ['', ''])[1];   
    });   
  },   
  
  evalScripts: function() {   
    return this.extractScripts().map(function(script) { return eval(script) });   
  },   
  
/*prototype给function添加了两个属性，一个是div，一个是text，这里似乎是利用了浏览器本身的功能来做escape  
等到后面看到的时候再说吧*/  
  escapeHTML: function() {   
    var self = arguments.callee;   
    self.text.data = this;   
    return self.div.innerHTML;   
  },   
  
  unescapeHTML: function() {   
    var div = document.createElement('div');   
    div.innerHTML = this.stripTags();   
    return div.childNodes[0] ? (div.childNodes.length > 1 ?   
      $A(div.childNodes).inject('', function(memo, node) { return memo+node.nodeValue }) :   
      div.childNodes[0].nodeValue) : '';   
  },   
  
  toQueryParams: function(separator) {   
/*  
把类似于param1=value1&param2=value2...&paramn=valuen#dock这样的uri拆分  
返回一个对象，对象包含n个属性，属性名分别为param1,param2....paramn，对应的值分别为value1,value2...valuen  
*/  
    var match = this.strip().match(/([^?#]*)(#.*)?$/);   
    if (!match) return {};   
  
    return match[1].split(separator || '&').inject({}, function(hash, pair) {   
      if ((pair = pair.split('='))[0]) {   
        var key = decodeURIComponent(pair.shift());   
        /*主要是为了防止value值本身中包含等号，例如某个param名叫expression，他的value为"x=10*10-y;"  
        若不考虑这种情况可能会导致params截断出错*/  
        var value = pair.length > 1 ? pair.join('=') : pair[0];   
        if (value != undefined) value = decodeURIComponent(value);   
  
        /*如果字符串中包含了多个同名的param，则这这个param对应的values会放入一个数组*/  
        /*例如有一个查询字符串name=jacobo&sex=male&hobit=soccer&hobit=music  
        经过toQueryParams后会返回一个对象{name:jacobo,sex:male,hobit:[soccer,music]}*/  
        if (key in hash) {   
          if (hash[key].constructor != Array) hash[key] = [hash[key]];   
          hash[key].push(value);   
        }   
        else hash[key] = value;   
      }   
      return hash;   
    });   
  },   
  
  toArray: function() {   
    return this.split('');   
  },   
  
/*succ方法和ruby中的几乎一样  
var str = "1"  
str.succ 输出结果为"2"  
var str = "abcd"  
str.succ 输出结果为"abce"  
*/  
  succ: function() {   
    return this.slice(0, this.length - 1) +   
      String.fromCharCode(this.charCodeAt(this.length - 1) + 1);   
  },   
  
/*times不知道是不是也是来源于ruby，用法有差别不过效果一样  
var str = "ab";  
str.times(5);输出结果为"ababababab"五次"ab"  
*/  
  times: function(count) {   
    var result = '';   
    for (var i = 0; i < count; i++) result += this;   
    return result;   
  },   
  
  
/*将类似于"ab-cd-ef-gh"这样的字符串转化为"abCdEfGh"*/  
  camelize: function() {   
    var parts = this.split('-'), len = parts.length;   
    if (len == 1) return parts[0];   
  
/*不明白这句话的意思，如果字符串第一个字符为'-'，直接忽略掉parts[0]不就ok了么，高人写的代码就是不明白*/  
    var camelized = this.charAt(0) == '-'  
      ? parts[0].charAt(0).toUpperCase() + parts[0].substring(1)   
      : parts[0];   
  
    for (var i = 1; i < len; i++)   
      camelized += parts[i].charAt(0).toUpperCase() + parts[i].substring(1);   
  
    return camelized;   
  },   
  
/*大写首字母*/  
  capitalize: function() {   
    return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();   
  },   
  
/*将大小写混杂的字符串按照大小写分割，然后再用下划线连接起来  
例如  
var str = "aBCd-eFg";  
str.underscore;输出结果为"a_BC_d_e_F_g  
*/  
  underscore: function() {   
    return this.gsub(/::/, '/').gsub(/([A-Z]+)([A-Z][a-z])/,'#{1}_#{2}').gsub(/([a-z/d])([A-Z])/,'#{1}_#{2}').gsub(/-/,'_').toLowerCase();   
  },   
  
/*将下划线替换为'-'  
例如  
var str = "a_b_c";  
str.dasherize; 输出"a-b-c"  
*/  
  dasherize: function() {   
    return this.gsub(/_/,'-');   
  },   
  
/*暂时不明白，留到最后看,不过ms和ruby中的inspect功能是一致的*/  
  inspect: function(useDoubleQuotes) {   
    var escapedString = this.gsub(/[/x00-/x1f//]/, function(match) {   
      var character = String.specialChar[match[0]];   
      return character ? character : '//u00' + match[0].charCodeAt().toPaddedString(2, 16);   
    });   
    if (useDoubleQuotes) return '"' + escapedString.replace(/"/g, '//"') + '"';   
    return "'" + escapedString.replace(/'/g, '///'') + "'";   
  },   
  
  toJSON: function() {   
    return this.inspect(true);   
  },   
  
  unfilterJSON: function(filter) {   
    return this.sub(filter || Prototype.JSONFilter, '#{1}');   
  },   
  
  isJSON: function() {   
    var str = this.replace(///./g, '@').replace(/"[^"///n/r]*"/g, '');   
    return (/^[,:{}/[/]0-9./-+Eaeflnr-u /n/r/t]*$/).test(str);   
  },   
  
  evalJSON: function(sanitize) {   
    var json = this.unfilterJSON();   
    try {   
      if (!sanitize || json.isJSON()) return eval('(' + json + ')');   
    } catch (e) { }   
    throw new SyntaxError('Badly formed JSON string: ' + this.inspect());   
  },   
  
/*确定字符串是否包含某个子字符串*/  
  include: function(pattern) {   
    return this.indexOf(pattern) > -1;   
  },   
  
/*是否以某个字符串开头*/  
  startsWith: function(pattern) {   
    return this.indexOf(pattern) === 0;   
  },   
  
/*是否以某个字符串结尾*/  
  endsWith: function(pattern) {   
    var d = this.length - pattern.length;   
    return d >= 0 && this.lastIndexOf(pattern) === d;   
  },   
  
/*判断字符串是否为空字符串(也就是是否为"")*/  
  empty: function() {   
    return this == '';   
  },   
  
/*是否为仅包含空格的字符串*/  
  blank: function() {   
/*此处用到了javascript正则的test方法*/  
    return /^/s*$/.test(this);   
  }   
});   
  
/*IE里面处理escapeHTML和unescapeHTML的方式和在firefox中不同，此处重新定义了一遍  
就是用正则查找然后几个关键字"&","<",">"转义  
*/  
if (Prototype.Browser.WebKit || Prototype.Browser.IE) Object.extend(String.prototype, {   
  escapeHTML: function() {   
    return this.replace(/&/g,'&').replace(/</g,'<').replace(/>/g,'>');   
  },   
  unescapeHTML: function() {   
    return this.replace(/&/g,'&').replace(/</g,'<').replace(/>/g,'>');   
  }   
});   
  
String.prototype.gsub.prepareReplacement = function(replacement) {   
  if (typeof replacement == 'function') return replacement;   
  var template = new Template(replacement);   
  return function(match) { return template.evaluate(match) };   
}   
  
/*给toQueryParams起了一个别名，叫做parseQuery*/  
String.prototype.parseQuery = String.prototype.toQueryParams;   
  
/*给String类型实例的escapeHTML方法添加了两个方法  
div:创建一个层  
text:创建了一个Text节点  
*/  
Object.extend(String.prototype.escapeHTML, {   
  div:  document.createElement('div'),   
  text: document.createTextNode('')   
});   
  
  
var Template = Class.create();   
/*这个正则实在不明白。。。*/  
Template.Pattern = /(^|.|/r|/n)(#/{(.*?)/})/;   
Template.prototype = {   
  initialize: function(template, pattern) {   
    this.template = template.toString();   
    this.pattern  = pattern || Template.Pattern;   
  },   
  
  evaluate: function(object) {   
    return this.template.gsub(this.pattern, function(match) {   
      var before = match[1];   
/*如果replacement字符串以'/'开头，则直接返回后面的"#{some words here}"  
否则，返回replacement的第一个字符+"#some words here",注意这里会去掉{} */  
/*不明白道理*/  
      if (before == '//') return match[2];   
      return before + String.interpret(object[match[3]]);   
    });   
  }   
}   
  
var $break = {}, $continue = new Error('"throw $continue" is deprecated, use "return" instead');   
  
var Enumerable = {   
/*对枚举类型进行扩展，添加each方法,each方法的参数为一个两个参数的函数  
函数第一个参数接收每一轮枚举时的枚举对象，第二个参数指示该枚举值位于原枚举类型中的第几项,当然，这两个参数也是可以省略的  
若函数执行中抛出异常，则枚举过程立刻停止  
usage:  
  var arr = new Array;  
  arr.each(function(value,index){...});  
实际的例子：  
  var arr = [0,1,2,3,4,5];  
  arr.each(function(value,index){ alert("value is "+String(value)+",index is "+String(index)+".");});  
*/  
/*iterator的返回值被忽略*/  
  each: function(iterator) {   
    var index = 0;   
    try {   
/*_each可枚举类型自带的一个方法，可枚举类型包括Array*/  
      this._each(function(value) {   
        iterator(value, index++);   
      });   
    } catch (e) {   
      if (e != $break) throw e;   
    }   
    return this;   
  },   
  
/*  
    var arr = [1,2,3,4,5];  
    alert(arr.eachSlice(2).inspect());  
        输出结果为[[1,2],[3,4],[5]]  
*/  
  eachSlice: function(number, iterator) {   
    var index = -number, slices = [], array = this.toArray();   
    while ((index += number) < array.length)   
      slices.push(array.slice(index, index+number));   
    return slices.map(iterator);   
  },   
  
/*对可枚举类型中的每一个元素调用传入的iterator方法进行处理,最后返回true或者false，如果不传入iterator方法，则比较可枚举类型中的每一个枚举项，  
若枚举项中有NaN，undefined，null，则停止枚举，结果返回false*/  
/*iterator的返回值被忽略*/  
  all: function(iterator) {   
    var result = true;   
    this.each(function(value, index) {   
/*注意这里的用法，js的弱类型特性一目了然*/  
      result = result && !!(iterator || Prototype.K)(value, index);   
      if (!result) throw $break;   
    });   
    return result;   
  },   
  
/*任意一项执行成功则枚举停止*/  
/*iterator的返回值被忽略*/  
  any: function(iterator) {   
    var result = false;   
    this.each(function(value, index) {   
      if (result = !!(iterator || Prototype.K)(value, index))   
        throw $break;   
    });   
    return result;   
  },   
  
/*对枚举中所有元素进行处理，并将处理结果保存并且返回  
此时需要iterator将单个元素的处理结果返回*/  
/*  
    var arr = [1,2,3,4,5];  
    arr.collect(function(value){ return value.succ(); } ).each(function(value) { alert(value); })  
    弹出窗口分别显示2,3,4,5,6  
*/  
  collect: function(iterator) {   
    var results = [];   
    this.each(function(value, index) {   
      results.push((iterator || Prototype.K)(value, index));   
    });   
    return results;   
  },   
  
/*对枚举类型中所有元素依次处理，若iterator函数返回true，则终止枚举，并返回当前枚举项的值*/  
/*  
    var arr = [1,2,3,4,5];  
    alert(arr.detect(function(value){return value>3; }));  
    弹出窗口显示4  
*/  
  detect: function(iterator) {   
    var result;   
    this.each(function(value, index) {   
      if (iterator(value, index)) {   
        result = value;   
        throw $break;   
      }   
    });   
    return result;   
  },   
  
/*对枚举类型中所有元素一次处理，若iterator函数返回非NaN,null,undefined,false  
则将当前枚举元素的值存放到一个新的枚举类型中，最后返回此新的枚举类新*/  
  findAll: function(iterator) {   
    var results = [];   
    this.each(function(value, index) {   
      if (iterator(value, index))   
        results.push(value);   
    });   
    return results;   
  },   
  
/*加强版的findAll，先用正则匹配出符合pattern的元素，然后使用iterator进行处理，最后将处理后的结果存放在数组中返回*/  
  grep: function(pattern, iterator) {   
    var results = [];   
    this.each(function(value, index) {   
      var stringValue = value.toString();   
      if (stringValue.match(pattern))   
        results.push((iterator || Prototype.K)(value, index));   
    })   
    return results;   
  },   
  
/*判断数组中是否包含某个元素*/  
/*包含则返回true，否则返回false*/  
/*注意这里用==来进行比较，也就是说如果经过转换相等的，也会返回true  
    var arr = [1,2,3,4,5];  
    alert(arr.include("3"));  
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
  
/*把数组分为指定大小的子数组，如果不够的话，用指定的fillwith进行填充*/  
/* var arr = [1,2,3];  
   arr.inGroupsOf(2,0);  
返回结果为[[1,2],[3,0]]  
*/  
  inGroupsOf: function(number, fillWith) {   
    fillWith = fillWith === undefined ? null : fillWith;   
    return this.eachSlice(number, function(slice) {   
      while(slice.length < number) slice.push(fillWith);   
      return slice;   
    });   
  },   
  
/*inject,用法和ruby里面的inject一模一样*/  
/*此处的interator需要三个参数function(memo,value,index){...}*/  
/*  
    var arr = [1,2,3,4,5];  
    alert(arr.inject(0,function(memo,value){ return memo+value; } ));  
*/  
  inject: function(memo, iterator) {   
    this.each(function(value, index) {   
      memo = iterator(memo, value, index);   
    });   
    return memo;   
  },   
  
/*  
对数组中所有元素调用指定的方法，参数为方法名和参数列表  
    var arr = [1,2,3,4,5];  
    alert(arr.invoke("succ").inspect());  
*/  
  invoke: function(method) {   
    var args = $A(arguments).slice(1);   
    return this.map(function(value) {   
      return value[method].apply(value, args);   
    });   
  },   
  
/*找到最大的元素，如果iterator为一个函数，则比较经过此函数处理后的每一个元素，若不定义iterator，  
则直接找到最大的元素并返回*/  
/*这里有个问题，如果数组中包含一个NaN，或者undefined，或者null，或者iterator的返回值不小心为NaN/undefined/null了，那么最大值岂不是成NaN/undefined/null了？*/  
  max: function(iterator) {   
    var result;   
    this.each(function(value, index) {   
      value = (iterator || Prototype.K)(value, index);   
      if (result == undefined || value >= result)   
        result = value;   
    });   
    return result;   
  },   
  
  min: function(iterator) {   
    var result;   
    this.each(function(value, index) {   
      value = (iterator || Prototype.K)(value, index);   
      if (result == undefined || value < result)   
        result = value;   
    });   
    return result;   
  },   
  
/*对数组项进行分组，经过iterator处理后返回true的分为一组，false的分为一组*/  
/*结果为一个包含数组的数组*/  
  partition: function(iterator) {   
    var trues = [], falses = [];   
    this.each(function(value, index) {   
      ((iterator || Prototype.K)(value, index) ?   
        trues : falses).push(value);   
    });   
    return [trues, falses];   
  },   
  
/*取出每一个元素的property属性的值，返回一个包含这些值的数组*/  
/*Luciano学英语:  
pluck: [ pl?k ]     
 
n. 勇气,猛拉,动物内脏  
v. 摘,猛拉,拔  
 
词形变化:  
名词:plucker 动词过去式:plucked 过去分词:plucked 现在分词:plucking 第三人称单数:plucks   
*/  
  pluck: function(property) {   
    var results = [];   
    this.each(function(value, index) {   
      results.push(value[property]);   
    });   
    return results;   
  },   
  
/*和ruby里面用法一样，结果iterator处理，返回false的元素将不会包含在返回的数组中*/  
/* var arr = [1,2,3,4,5];  
   arr.reject(function(value){ return(value>2 && value<5) }).each(function(value){alert(value);});  
*/  
  reject: function(iterator) {   
    var results = [];   
    this.each(function(value, index) {   
      if (!iterator(value, index))   
        results.push(value);   
    });   
    return results;   
  },   
  
/*sortBy传入一个函数，此参数不能省略，用来处理数组中的每一个元素，并且将处理结果保存起来，用来作为排序的依据（升序排列）*/  
/*luciano学英语*/  
/*  
criteria: [ krai'ti?ri? ]     
 
n. 标准  
 
例句与用法:  
1.  What are the criteria for deciding (ie How do we decide) who gets the prize?   
    评定获奖者以什麽作标准?  
2.  An experiment was made to check up on the reliability of certain criteria.   
    已经进行了一项实验以检查某些标准的可靠性。  
3.  Success in making money is not always a good criterion of success in life.   
    能挣钱并不一定是衡量人生幸福的可靠标准.  
*/  
  sortBy: function(iterator) {   
    return this.map(function(value, index) {   
      return {value: value, criteria: iterator(value, index)};   
    }).sort(function(left, right) {   
      var a = left.criteria, b = right.criteria;   
      return a < b ? -1 : a > b ? 1 : 0;   
    }).pluck('value');   
  },   
  
/*toArray = map = collect()*/  
  toArray: function() {   
    return this.map();   
  },   
  
  zip: function() {   
    var iterator = Prototype.K, args = $A(arguments);   
    if (typeof args.last() == 'function')   
      iterator = args.pop();   
  
    var collections = [this].concat(args).map($A);   
    return this.map(function(value, index) {   
      return iterator(collections.pluck(index));   
    });   
  },   
  
  size: function() {   
    return this.toArray().length;   
  },   
  
  inspect: function() {   
    return '#<Enumerable:' + this.toArray().inspect() + '>';   
  }   
}   
  
Object.extend(Enumerable, {   
  map:     Enumerable.collect,   
  find:    Enumerable.detect,   
  select:  Enumerable.findAll,   
  member:  Enumerable.include,   
  entries: Enumerable.toArray   
});   
  
/* $A方法将返回一个数组*/  
/*如果对象有toArray()方法的话会直接调用对象的toArray方法*/  
var $A = Array.from = function(iterable) {   
  if (!iterable) return [];   
  if (iterable.toArray) {   
    return iterable.toArray();   
  } else {   
    var results = [];   
    for (var i = 0, length = iterable.length; i < length; i++)   
      results.push(iterable[i]);   
    return results;   
  }   
}   
  
/*因为js是脚本语言，所以后设置的会覆盖先前设置的*/  
if (Prototype.Browser.WebKit) {   
  $A = Array.from = function(iterable) {   
    if (!iterable) return [];   
    if (!(typeof iterable == 'function' && iterable == '[object NodeList]') &&   
      iterable.toArray) {   
      return iterable.toArray();   
    } else {   
      var results = [];   
      for (var i = 0, length = iterable.length; i < length; i++)   
        results.push(iterable[i]);   
      return results;   
    }   
  }   
}   
  
Object.extend(Array.prototype, Enumerable);   
  
/*reverse是js Array对象的内部方法*/  
if (!Array.prototype._reverse)   
  Array.prototype._reverse = Array.prototype.reverse;   
  
/*nnd原来_each方法也是扩展上去的*/  
Object.extend(Array.prototype, {   
  _each: function(iterator) {   
    for (var i = 0, length = this.length; i < length; i++)   
      iterator(this[i]);   
  },   
  
/*敢情这样就能清空数组元素，长见识了*/  
  clear: function() {   
    this.length = 0;   
    return this;   
  },   
  
  first: function() {   
    return this[0];   
  },   
  
  last: function() {   
    return this[this.length - 1];   
  },   
  
/*压缩数组，剔除其中所有值为null的元素*/  
  compact: function() {   
    return this.select(function(value) {   
      return value != null;   
    });   
  },   
  
/*同ruby中的flatten用法一致*/  
/*  
    var arr=[[1,2],3,[5,6]];  
    alert(arr.flatten().inspect());  
输出结果[1,2,3,5,6]  
*/  
  flatten: function() {   
    return this.inject([], function(array, value) {   
      return array.concat(value && value.constructor == Array ?   
        value.flatten() : [value]);   
    });   
  },   
  
/*得到一个不包含参数中指定元素的新数组*/  
/*  
    var arr=[1,2,3,4,5,6];  
    alert(arr.without(2,3,6).inspect();  
输出结果为[1,4,5]  
*/  
  without: function() {   
    var values = $A(arguments);   
    return this.select(function(value) {   
      return !values.include(value);   
    });   
  },   
  
/*得到指定元素在数组中的索引*/  
  indexOf: function(object) {   
    for (var i = 0, length = this.length; i < length; i++)   
      if (this[i] == object) return i;   
    return -1;   
  },   
  
  reverse: function(inline) {   
    return (inline !== false ? this : this.toArray())._reverse();   
  },   
  
  reduce: function() {   
    return this.length > 1 ? this : this[0];   
  },   
  
  uniq: function(sorted) {   
    return this.inject([], function(array, value, index) {   
      if (0 == index || (sorted ? array.last() != value : !array.include(value)))   
        array.push(value);   
      return array;   
    });   
  },   
  
/*这个太巧妙了,经典*/  
  clone: function() {   
    return [].concat(this);   
  },   
  
  size: function() {   
    return this.length;   
  },   
  
  inspect: function() {   
    return '[' + this.map(Object.inspect).join(', ') + ']';   
  },   
  
  toJSON: function() {   
    var results = [];   
    this.each(function(object) {   
      var value = Object.toJSON(object);   
      if (value !== undefined) results.push(value);   
    });   
    return '[' + results.join(', ') + ']';   
  }   
});   
  
Array.prototype.toArray = Array.prototype.clone;   
  
/*就是ruby中的%w方法*/  
/* alert($w(1 2 3 4 5));  
输出结果为[1,2,3,4,5]  
*/  
function $w(string) {   
  string = string.strip();   
  return string ? string.split(//s+/) : [];   
}   
  
if (Prototype.Browser.Opera){   
  Array.prototype.concat = function() {   
    var array = [];   
    for (var i = 0, length = this.length; i < length; i++) array.push(this[i]);   
    for (var i = 0, length = arguments.length; i < length; i++) {   
      if (arguments[i].constructor == Array) {   
        for (var j = 0, arrayLength = arguments[i].length; j < arrayLength; j++)   
          array.push(arguments[i][j]);   
      } else {   
        array.push(arguments[i]);   
      }   
    }   
    return array;   
  }   
}   
  
/*哈希类型的构造函数*/  
var Hash = function(object) {   
  if (object instanceof Hash) this.merge(object);   
  else Object.extend(this, object || {});   
};   
  
/*扩展了Hash类型，添加了toQueryString()和toJSON方法*/  
/*usage:  
    var hash = new Hash({name:'jacobo',age:17});  
    alert(hash.toQueryString());  
    输出结果name=jacobo&age=17  
*/  
Object.extend(Hash, {   
  toQueryString: function(obj) {   
    var parts = [];   
    parts.add = arguments.callee.addPair;   
  
    this.prototype._each.call(obj, function(pair) {   
      if (!pair.key) return;   
      var value = pair.value;   
  
      if (value && typeof value == 'object') {   
        if (value.constructor == Array) value.each(function(value) {   
          parts.add(pair.key, value);   
        });   
        return;   
      }   
      parts.add(pair.key, value);   
    });   
  
    return parts.join('&');   
  },   
     
/*usage:  
    var hash = new Hash({name:'jacobo',age:17});  
    alert(hash.toJSON());  
    输出结果{"name":"jacobo","age":"17"}  
*/  
  toJSON: function(object) {   
    var results = [];   
    this.prototype._each.call(object, function(pair) {   
      var value = Object.toJSON(pair.value);   
      if (value !== undefined) results.push(pair.key.toJSON() + ': ' + value);   
    });   
    return '{' + results.join(', ') + '}';   
  }   
});   
  
Hash.toQueryString.addPair = function(key, value, prefix) {   
  key = encodeURIComponent(key);   
  if (value === undefined) this.push(key);   
  else this.push(key + '=' + (value == null ? '' : encodeURIComponent(value)));   
}   
  
/*把Enumerable中的方法mixin到Hash.prototype中去*/  
Object.extend(Hash.prototype, Enumerable);   
Object.extend(Hash.prototype, {   
/*给Hash.prototype添加_each方法，在Enumerable中，实际上each方法方法内部调用的就是_each方法*/  
  _each: function(iterator) {   
    for (var key in this) {   
      var value = this[key];   
      if (value && value == Hash.prototype[key]) continue;   
  
      var pair = [key, value];   
      pair.key = key;   
      pair.value = value;   
      iterator(pair);   
    }   
  },   
  
  keys: function() {   
    return this.pluck('key');   
  },   
  
  values: function() {   
    return this.pluck('value');   
  },   
  
/*利用Enumerable的inject方法对两个哈希进行合并  
  inject: function(memo, iterator) {  
    this.each(function(value, index) {  
      memo = iterator(memo, value, index);  
    });  
    return memo;  
  }  
*/  
  merge: function(hash) {   
    return $H(hash).inject(this, function(mergedHash, pair) {   
      mergedHash[pair.key] = pair.value;   
      return mergedHash;   
    });   
  },   
  
/*可以传入多个参数，会从object中删除相应的属性  
如果传入一个参数，会返回此参数对应属性的值，  
如果传入多个参数，会返回包含这些参数对应属性值的数组*/  
/*  
    var hash = new Hash({name:'jacobo',age:17,sex:"male",hobit:['football','rock']});  
    alert(hash.remove("age","hobit").inspect());   
    弹出提示[17,['football','rock']]  
*/  
  remove: function() {   
    var result;   
    for(var i = 0, length = arguments.length; i < length; i++) {   
      var value = this[arguments[i]];   
      if (value !== undefined){   
        if (result === undefined) result = value;   
        else {   
          if (result.constructor != Array) result = [result];   
          result.push(value)   
        }   
      }   
      delete this[arguments[i]];   
    }   
    return result;   
  },   
  
  toQueryString: function() {   
    return Hash.toQueryString(this);   
  },   
  
  inspect: function() {   
    return '#<Hash:{' + this.map(function(pair) {   
      return pair.map(Object.inspect).join(': ');   
    }).join(', ') + '}>';   
  },   
  
  toJSON: function() {   
    return Hash.toJSON(this);   
  }   
});   
  
function $H(object) {   
  if (object instanceof Hash) return object;   
  return new Hash(object);   
};   
  
// Safari iterates over shadowed properties   
/*为了消除浏览器的差异，针对于Safari浏览器重新定义了_each方法，主要差别是Safari中的对象可能存在同名的key*/  
/*这段代码就是为了进行测试  
function() {  
  var i = 0, Test = function(value) { this.key = value };  
  Test.prototype.key = 'foo';  
  for (var property in new Test('bar')) i++;  
  return i > 1;  
}()  
*/  
if (function() {   
  var i = 0, Test = function(value) { this.key = value };   
  Test.prototype.key = 'foo';   
  for (var property in new Test('bar')) i++;   
  return i > 1;   
}()) Hash.prototype._each = function(iterator) {   
  var cache = [];   
  for (var key in this) {   
    var value = this[key];   
    if ((value && value == Hash.prototype[key]) || cache.include(key)) continue;   
    cache.push(key);   
    var pair = [key, value];   
    pair.key = key;   
    pair.value = value;   
    iterator(pair);   
  }   
};   
  
/*ObjectRange对象，看起来非常类似ruby中的Range*/  
/*ObjectRange操作的对象必须实现了succ()方法*/  
ObjectRange = Class.create();   
Object.extend(ObjectRange.prototype, Enumerable);   
Object.extend(ObjectRange.prototype, {   
/*exclusive指示是否包含下边界（总是包含上边界）*/  
  initialize: function(start, end, exclusive) {   
    this.start = start;   
    this.end = end;   
    this.exclusive = exclusive;   
  },   
  
  _each: function(iterator) {   
    var value = this.start;   
    while (this.include(value)) {   
      iterator(value);   
      value = value.succ();   
    }   
  },   
  
  include: function(value) {   
    if (value < this.start)   
      return false;   
    if (this.exclusive)   
      return value < this.end;   
    return value <= this.end;   
  }   
});   
  
/*ObjectRange的快捷命名*/  
var $R = function(start, end, exclusive) {   
  return new ObjectRange(start, end, exclusive);   
}  
var Ajax = {
  getTransport: function() {
  /*之前定义的Try.these终于派上用场了*/
    return Try.these(
      function() {return new XMLHttpRequest()},
      function() {return new ActiveXObject('Msxml2.XMLHTTP')},
      function() {return new ActiveXObject('Microsoft.XMLHTTP')}
    ) || false;
  },

  /*用来统计活动的连接数*/
  activeRequestCount: 0
}

/*Ajax.Responders同样mixin了Enumerable对象*/
Ajax.Responders = {
  responders: [],

  _each: function(iterator) {
    this.responders._each(iterator);
  },

  /*注册一个responder，重复注册没有任何副作用*/
  /*参数为responder的名称*/
  register: function(responder) {
    if (!this.include(responder))
      this.responders.push(responder);
  },

  /*撤销注册*/
  /*参数为responder的名称*/
  unregister: function(responder) {
    this.responders = this.responders.without(responder);
  },

  /*遍历所有注册的responder，并在调用其上的用callback指示的函数，这些函数接受一个数组作为参数
  数组包含request,transport,json三项*/
  dispatch: function(callback, request, transport, json) {
    this.each(function(responder) {
      if (typeof responder[callback] == 'function') {
        try {
          responder[callback].apply(responder, [request, transport, json]);
        } catch (e) {}
      }
    });
  }
};

Object.extend(Ajax.Responders, Enumerable);

/*定义两个静态方法
onCreate和onComplete
*/
Ajax.Responders.register({
  onCreate: function() {
  /*做的工作很简单，增加一个活动链接数*/
    Ajax.activeRequestCount++;
  },
  onComplete: function() {
    Ajax.activeRequestCount--;
  }
});

Ajax.Base = function() {};
Ajax.Base.prototype = {
/*Ajax.Base的每个实例都有一个setOptions方法，此方法接收一个哈希对象作为参数，或者不传入参数，使用默认值*/
/*哈希对象的格式为{param1:value1,param2:value2...}*/
/*parameters为一个字符串，形为param1=value1&param2=value2....&paramn=valuen#dock*/
/*经过处理后parameters会被拆分然后填充到一个对象中去，对象的格式为
{param1=value1;param2=value2....paramn=valuen}
*/
/*默认值为
      method:       'post',
      asynchronous: true,
      contentType:  'application/x-www-form-urlencoded',
      encoding:     'UTF-8',
      parameters:   ''
  可能含有的其他参数
      postBody
      requestHeaders
      evalScripts(Ajax.Updater)
      insertion(Ajax.Updater)
      frequency(Ajax.PeriodicalUpdater)
      decay(Ajax.PeriodicalUpdater)
  可能含有的方法，用户只需要定义自己关心事件的回调函数。
      onSuccess
      onFailure
      on2xx
      on3xx
      on4xx
      on5xx
      onUninitialized
      onLoading
      onLoaded
      onInteractive
      onComplete
*/
/*usage
ajaxBaseInstance.setOptions( {postBody:"...",onSuccess:function(){...},onComplete:function(){...}} );
*/
  setOptions: function(options) {
    this.options = {
      method:       'post',
      asynchronous: true,
      contentType:  'application/x-www-form-urlencoded',
      encoding:     'UTF-8',
      parameters:   ''
    }
    Object.extend(this.options, options || {});

    this.options.method = this.options.method.toLowerCase();
    if (typeof this.options.parameters == 'string')
      this.options.parameters = this.options.parameters.toQueryParams();
  }
}

Ajax.Request = Class.create();
Ajax.Request.Events =
  ['Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete'];

Ajax.Request.prototype = Object.extend(new Ajax.Base(), {
  _complete: false,

  initialize: function(url, options) {
    this.transport = Ajax.getTransport();
    this.setOptions(options);
    /*新建一个AjaxRequest对象的时候直接发起请求*/
    this.request(url);
  },
               
  /*                      (如果state等于Complete)   (如果response是js代码)           
  /*onCreate---->onLoading------> on2xx -------------->调用evalResponse-----------> onUninitialized------
                                  on3xx                                             onLoading           |
                                  on4xx                                             onLoaded            |
                                  on5xx                                             onInteractive       | (transport状态更改会导致循环这个过程)
                                  onSuccess                                         onComplete          |
                                  onFailure                                                             |
                                    |___________________________________________________________________|
   注：所有这些函数均接受两个参数transport, json
  */
  request: function(url) {
    this.url = url;
    this.method = this.options.method;
    var params = Object.clone(this.options.parameters);

    /*如果this.method既不是get也不是post（在setOptions的时候被重写了，可能是put或者delete之类的）
    则把this.method的值保存在params._method中，并把this.method设置为post（因为不论put还是delete，
    其实都要向服务器端提交数据，在现有绝大部分浏览器仅支持get和post的情况下可以用post来模拟）*/
    if (!['get', 'post'].include(this.method)) {
      // simulate other verbs over post
      params['_method'] = this.method;
      this.method = 'post';
    }

    /*将params对象保存到this.parameters对象中，params将会保存toQueryString后的结果*/
    this.parameters = params;

    if (params = Hash.toQueryString(params)) {
      // when GET, append parameters to URL
      /*这里多说一句，万一我传入的url包含锚点符号怎么办？。。。*/
      if (this.method == 'get')
        this.url += (this.url.include('?') ? '&' : '?') + params;
      else if (/Konqueror|Safari|KHTML/.test(navigator.userAgent))
        params += '&_=';
    }

    try {
      if (this.options.onCreate) this.options.onCreate(this.transport);
      /*在创建Ajax调用之前*/
      /*对所有注册的Responders调用它们的onCreate方法*/
      Ajax.Responders.dispatch('onCreate', this, this.transport);

      /*发起一个Ajax调用，默认使用异步方法*/
      /*如果是同步的话会一直在这里等到连接建立或者超时*/
      this.transport.open(this.method.toUpperCase(), this.url,
        this.options.asynchronous);

      /*如果是使用异步调用，等待10毫秒后将会调用respondToReadyState方法，参数为1表示Loading状态*/
      /*人为的触发一个1xx事件（这个时候还没有使用onStateChange回调），以便于做一些等待时的处理，譬如显示一个Loading提示，或者进度条什么的*/
      if (this.options.asynchronous)
        setTimeout(function() { this.respondToReadyState(1) }.bind(this), 10);

      /*设置transport.onreadystatechange事件的回调函数为Ajax.Request.prototype.onStateChange*/
      /*无论是同步还是异步，这个onStatechange事件都会被调用*/
      this.transport.onreadystatechange = this.onStateChange.bind(this);
      this.setRequestHeaders();

      this.body = this.method == 'post' ? (this.options.postBody || params) : null;
      /*发送请求*/
      this.transport.send(this.body);

      /* Force Firefox to handle ready state 4 for synchronous requests */
      if (!this.options.asynchronous && this.transport.overrideMimeType)
        this.onStateChange();

    }
    catch (e) {
      this.dispatchException(e);
    }
  },
  
  /*
    1xx:信息响应类，表示接收到请求并且继续处理
    2xx:处理成功响应类，表示动作被成功接收、理解和接受
    3xx:重定向响应类，为了完成指定的动作，必须接受进一步处理
    4xx:客户端错误，客户请求包含语法错误或者是不能正确执行
    5xx:服务端错误，服务器不能正确执行一个正确的请求 
  */

  onStateChange: function() {
    var readyState = this.transport.readyState;
    if (readyState > 1 && !((readyState == 4) && this._complete/*在一个成功的调用之前，这个值一直都被设置为false*/))
      this.respondToReadyState(this.transport.readyState);
  },

  /*核心是调用transport.setRequestHeader方法*/
  setRequestHeaders: function() {
    var headers = {
      'X-Requested-With': 'XMLHttpRequest',
      'X-Prototype-Version': Prototype.Version,
      'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
    };

    if (this.method == 'post') {
      headers['Content-type'] = this.options.contentType +
        (this.options.encoding ? '; charset=' + this.options.encoding : '');

      /* Force "Connection: close" for older Mozilla browsers to work
       * around a bug where XMLHttpRequest sends an incorrect
       * Content-length header. See Mozilla Bugzilla #246651.
       */
      if (this.transport.overrideMimeType &&
          (navigator.userAgent.match(/Gecko//(/d{4})/) || [0,2005])[1] < 2005)
            headers['Connection'] = 'close';
    }

    // user-defined headers
    if (typeof this.options.requestHeaders == 'object') {
      var extras = this.options.requestHeaders;

      if (typeof extras.push == 'function')
        for (var i = 0, length = extras.length; i < length; i += 2)
          headers[extras[i]] = extras[i+1];
      else
        $H(extras).each(function(pair) { headers[pair.key] = pair.value });
    }

    for (var name in headers)
      this.transport.setRequestHeader(name, headers[name]);
  },

  /*transport.status为false,null,undefined,NaN也表示success？*/
  /*或者transport.status为2xx*/
  success: function() {
    return !this.transport.status
        || (this.transport.status >= 200 && this.transport.status < 300);
  },

  respondToReadyState: function(readyState) {
    var state = Ajax.Request.Events[readyState];
    var transport = this.transport, json = this.evalJSON();

    /*查看this.options里面是否定义了onXXX(2xx~5xx)或者onSuccess或者onFailure方法*/
    /*如果定义了就调用相应的方法，如果没有定义则调用空方法*/
    if (state == 'Complete') {
      try {
      /*设置this._complete参数为true*/
        this._complete = true;
        (this.options['on' + this.transport.status]
         || this.options['on' + (this.success() ? 'Success' : 'Failure')]
         || Prototype.emptyFunction)(transport, json);
      } catch (e) {
        this.dispatchException(e);
      }

      /*通过比较响应的Content-type来查看是否是javascript代码，如果是，就动态eval返回的js代码*/
      var contentType = this.getHeader('Content-type');
      if (contentType && contentType.strip().
        match(/^(text|application)//(x-)?(java|ecma)script(;.*)?$/i))
          this.evalResponse();
    }

    /*根据返回结果不同执行不同的回调函数*/
    /*
    onUninitialized
    onLoading
    onLoaded
    onInteractive
    onComplete
    */
    /*从代码可以看出来如果transport的状态码为4，这里会先后执行两个回调函数，
    首先是onXXX(2xx~5xx)或者onSuccess或者onFailure方法
    接着是上述函数之一*/
    try {
      (this.options['on' + state] || Prototype.emptyFunction)(transport, json);
      Ajax.Responders.dispatch('on' + state, this, transport, json);
    } catch (e) {
      this.dispatchException(e);
    }

    if (state == 'Complete') {
      // avoid memory leak in MSIE: clean up
      this.transport.onreadystatechange = Prototype.emptyFunction;
    }
  },

  getHeader: function(name) {
    try {
      return this.transport.getResponseHeader(name);
    } catch (e) { return null }
  },

  evalJSON: function() {
    try {
      var json = this.getHeader('X-JSON');
      return json ? json.evalJSON() : null;
    } catch (e) { return null }
  },

  evalResponse: function() {
    try {
      return eval((this.transport.responseText || '').unfilterJSON());
    } catch (e) {
      this.dispatchException(e);
    }
  },

  dispatchException: function(exception) {
  /*首先进行统一的异常处理（通过定义this.options.onException方法
  然后分别执行每个注册了的Responder的onException方法*/
    (this.options.onException || Prototype.emptyFunction)(this, exception);
    Ajax.Responders.dispatch('onException', this, exception);
  }
});

Ajax.Updater = Class.create();

/*这里有一个小技巧是先mixin，然后复写其中需要的方法*/
Object.extend(Object.extend(Ajax.Updater.prototype, Ajax.Request.prototype), {
  initialize: function(container, url, options) {
    /*这里用来指定Ajax调用成功和失败后分别用来更新的DOM对象
    参数可以是一个代表指定DOM元素的字符串（无论成功失败均更新此DOM对象），也可以是一个包含success和failure属性的对象*/
    this.container = {
      success: (container.success || container),
      failure: (container.failure || (container.success ? null : container))
    }

    this.transport = Ajax.getTransport();
    this.setOptions(options);

    /*在用户定义的onComplete事件前插入一个updateContent()事件*/
    /*这个updateContent事件是已经定义好的，所以无论用户是否定义onComplete，
    这个updateContent动作都是一定会执行的*/
    var onComplete = this.options.onComplete || Prototype.emptyFunction;
    this.options.onComplete = (function(transport, param) {
      this.updateContent();
      onComplete(transport, param);
    }).bind(this);

    this.request(url);
  },

  updateContent: function() {
    var receiver = this.container[this.success() ? 'success' : 'failure'];
    var response = this.transport.responseText;

    /*如果用户没有在options中指定evalScripts属性，会自动过滤掉返回结果中的<script...></script>标签*/
    if (!this.options.evalScripts) response = response.stripScripts();

    if (receiver = $(receiver)) {
      if (this.options.insertion)
        new this.options.insertion(receiver, response);
      else
        receiver.update(response);
    }

    if (this.success()) {
      if (this.onComplete)
        setTimeout(this.onComplete.bind(this), 10);
    }
  }
});

/*周期性的更新某个DOM*/
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
    /*当transport状态变为complete的时候调用updateComplete方法*/
    this.options.onComplete = this.updateComplete.bind(this);
    this.onTimerEvent();
  },

  stop: function() {
    this.updater.options.onComplete = undefined;
    clearTimeout(this.timer);
    (this.onComplete || Prototype.emptyFunction).apply(this, arguments);
  },

  /*这个方法主要有两个作用：
  1.保存返回结果，主要是用来比较两次更新的结果，如果结果一直没有发生变化的话，更新的周期会呈指数性越来越长
  2.设置一个定时器，在decay*frequency秒后进行下下一次更新
  */
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

 /*用的最多的怕就是这个方法了吧*/
function $(element) {
  if (arguments.length > 1) {
    for (var i = 0, elements = [], length = arguments.length; i < length; i++)
      elements.push($(arguments[i]));
    return elements;
  }
  if (typeof element == 'string')
    element = document.getElementById(element);
  return Element.extend(element);
}

/*定义getElementByClassName方法*/
if (Prototype.BrowserFeatures.XPath) {
  document._getElementsByXPath = function(expression, parentElement) {
    var results = [];
    var query = document.evaluate(expression, $(parentElement) || document,
      null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0, length = query.snapshotLength; i < length; i++)
      results.push(query.snapshotItem(i));
    return results;
  };

  document.getElementsByClassName = function(className, parentElement) {
    var q = ".//*[contains(concat(' ', @class, ' '), ' " + className + " ')]";
    return document._getElementsByXPath(q, parentElement);
  }

} else document.getElementsByClassName = function(className, parentElement) {
  var children = ($(parentElement) || document.body).getElementsByTagName('*');
  var elements = [], child, pattern = new RegExp("(^|//s)" + className + "(//s|$)");
  for (var i = 0, length = children.length; i < length; i++) {
    child = children[i];
    var elementClassName = child.className;
    if (elementClassName.length == 0) continue;
    if (elementClassName == className || elementClassName.match(pattern))
      elements.push(Element.extend(child));
  }
  return elements;
};

/*--------------------------------------------------------------------------*/

if (!window.Element) var Element = {};

Element.extend = function(element) {
  var F = Prototype.BrowserFeatures;
  /*
    element的nodeType属性：
        1 Element node. 
        3 Text node. 
  */
  /*
    只有在element
        1.包含tagName属性
        2.element不是text node
        3.element不包含_extended属性
        4.当前浏览器不是IE
        5.且element元素不是window对象
    的情况下才会继续执行
  */
  if (!element || !element.tagName || element.nodeType == 3 ||
   element._extended || F.SpecificElementExtensions || element == window)
    return element;

  var methods = {}, tagName = element.tagName, cache = Element.extend.cache,
   T = Element.Methods.ByTag;

  // extend methods for all tags ( Safari doesn't need this)
  /*从我测试的结果来看F.ElementExtensions在firefox上同样是true*/
  if (!F.ElementExtensions) {
    Object.extend(methods, Element.Methods),
    Object.extend(methods, Element.Methods.Simulated);
  }

  // extend methods for specific tags
  if (T[tagName]) Object.extend(methods, T[tagName]);

  for (var property in methods) {
    var value = methods[property];
    if (typeof value == 'function' && !(property in element))
      element[property] = cache.findOrStore(value);
  }
  /*这里定义了一把element._extended，飘逸啊。。。。完全一头雾水*/  
  element._extended = Prototype.emptyFunction;
  return element;
};

Element.extend.cache = {
  findOrStore: function(value) {
    return this[value] = this[value] || function() {
      return value.apply(null, [this].concat($A(arguments)));
    }
  }
};

/*定义了一些通用的methods
*/
Element.Methods = {
  visible: function(element) {
    return $(element).style.display != 'none';
  },

  toggle: function(element) {
    element = $(element);
    Element[Element.visible(element) ? 'hide' : 'show'](element);
    return element;
  },

  hide: function(element) {
    $(element).style.display = 'none';
    return element;
  },

  show: function(element) {
    $(element).style.display = '';
    return element;
  },

  remove: function(element) {
    element = $(element);
    element.parentNode.removeChild(element);
    return element;
  },

  update: function(element, html) {
    html = typeof html == 'undefined' ? '' : html.toString();
    $(element).innerHTML = html.stripScripts();
    /*这一步不太理解*/
    setTimeout(function() {html.evalScripts()}, 10);
    return element;
  },

  replace: function(element, html) {
    element = $(element);
    html = typeof html == 'undefined' ? '' : html.toString();
    /*IE里面定义了outerHTML而Firefox中没有这个属性*/
    if (element.outerHTML) {
      element.outerHTML = html.stripScripts();
    } else {
      /*取得包含element的document对象，并调用它的createRange方法*/
      /*Creates a TextRange object from the current text selection, or a controlRange collection from a control selection*/
      /*
      用Range进行选择，用selectNode()或者selectNodeContents()方法，这两个方法只有一个接收参数，一个DOM节点。
        selectNode()方法选择全部节点，包括它的孩子，而selectNodeContents()选择的节点只是它的孩子。如<p id="p1"><b>Hello</b> World</p>
        <script>
        var oRange1 = document.createRange();
        var oRange2 = document.createRange();
        var oP1 = document.getElementById("p1");
        oRange1.selectNode(oP1);
        oRange2.selectNodeContents(oP1);
        </script>
        使用selectNode方法，选择的部分如下：
        <p id="p1"><b>Hello</b> World</p>
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        而使用selectNodeContents方法，选择的部分如下：
        <p id="p1"><b>Hello</b> World</p>
                   ~~~~~~~~~~~~
      关于Range对象更多的说明，可以参考http://hi.baidu.com/llaa27/blog/item/2ea8f1f49fcb81daf2d385db.html
      */
      var range = element.ownerDocument.createRange();
      range.selectNodeContents(element);
      element.parentNode.replaceChild(
        range.createContextualFragment(html.stripScripts()), element);
    }
    setTimeout(function() {html.evalScripts()}, 10);
    return element;
  },

  inspect: function(element) {
    element = $(element);
    var result = '<' + element.tagName.toLowerCase();
    $H({'id': 'id', 'className': 'class'}).each(function(pair) {
      /*property对应DOM中对应的属性名
      attribute对应实际HTML文件中书写的代码
      举一个例子：
      <div id="content" class="div_content"></div>
      property       attribute
      ---------------------------
      "id"             "id"
      "className"     "class"
      ---------------------------
      */
      var property = pair.first(), attribute = pair.last();
      var value = (element[property] || '').toString();
      if (value) result += ' ' + attribute + '=' + value.inspect(true);
    });
    return result + '>';
  },
  /*
    <ul id="fruits">
      <li id="apples">
        <ul id="list-of-apples">
          <li id="golden-delicious"><p>Golden Delicious</p></li>
          <li id="mutsu">Mutsu</li>
          <li id="mcintosh">McIntosh</li>
          <li id="ida-red">Ida Red</li>
        </ul>
      </li>
    </ul>

    $('fruits').recursivelyCollect('firstChild');
    -> [li#apples, ul#list-of-apples, li#golden-delicious, p]
  */
  /*注：不包含text node*/
  recursivelyCollect: function(element, property) {
    element = $(element);
    var elements = [];
    while (element = element[property])
      if (element.nodeType == 1)
        elements.push(Element.extend(element));
    return elements;
  },

  /*收集某个元素的祖先列表*/
  /*注：不包含text node*/
  ancestors: function(element) {
    return $(element).recursivelyCollect('parentNode');
  },

  /*收集某个元素的子孙元素列表*/
  /*注：不包含text node*/
  descendants: function(element) {
    return $A($(element).getElementsByTagName('*')).each(Element.extend);
  },

  /*element的第一个子节点*/
  /*注：不包含text node*/
  firstDescendant: function(element) {
    element = $(element).firstChild;
    while (element && element.nodeType != 1) element = element.nextSibling;
    return $(element);
  },

  /*取得element所有子节点元素的列表*/
  /*
    <div id="australopithecus">
      <div id="homo-herectus">
        <div id="homo-neanderthalensis"></div>
        <div id="homo-sapiens"></div>
      </div>
    </div>

    $('australopithecus').immediateDescendants();
    -> [div#homo-herectus]

    $('homo-herectus').immediateDescendants();
    -> [div#homo-neanderthalensis, div#homo-sapiens]

    $('homo-sapiens').immediateDescendants();
    -> []
    */
    /*注：不包含text node*/
  immediateDescendants: function(element) {
    if (!(element = $(element).firstChild)) return [];
    while (element && element.nodeType != 1) element = element.nextSibling;
    if (element) return [element].concat($(element).nextSiblings());
    return [];
  },

  /*取得element所有的previous兄弟节点*/
  previousSiblings: function(element) {
    return $(element).recursivelyCollect('previousSibling');
  },

  /*取得element所有的next兄弟节点*/
  nextSiblings: function(element) {
    return $(element).recursivelyCollect('nextSibling');
  },

  /*element所有的兄弟节点*/
  siblings: function(element) {
    element = $(element);
    return element.previousSiblings().reverse().concat(element.nextSiblings());
  },

  match: function(element, selector) {
    if (typeof selector == 'string')
      selector = new Selector(selector);
    return selector.match($(element));
  },

  up: function(element, expression, index) {
    element = $(element);
    if (arguments.length == 1) return $(element.parentNode);
    var ancestors = element.ancestors();
    return expression ? Selector.findElement(ancestors, expression, index) :
      ancestors[index || 0];
  },

  down: function(element, expression, index) {
    element = $(element);
    if (arguments.length == 1) return element.firstDescendant();
    var descendants = element.descendants();
    return expression ? Selector.findElement(descendants, expression, index) :
      descendants[index || 0];
  },

  previous: function(element, expression, index) {
    element = $(element);
    if (arguments.length == 1) return $(Selector.handlers.previousElementSibling(element));
    var previousSiblings = element.previousSiblings();
    return expression ? Selector.findElement(previousSiblings, expression, index) :
      previousSiblings[index || 0];
  },

  next: function(element, expression, index) {
    element = $(element);
    if (arguments.length == 1) return $(Selector.handlers.nextElementSibling(element));
    var nextSiblings = element.nextSiblings();
    return expression ? Selector.findElement(nextSiblings, expression, index) :
      nextSiblings[index || 0];
  },

  getElementsBySelector: function() {
    var args = $A(arguments), element = $(args.shift());
    return Selector.findChildElements(element, args);
  },

  getElementsByClassName: function(element, className) {
    return document.getElementsByClassName(className, element);
  },

  
  /*可供查询的属性有：
  colspan,
  rowspan,
  valign,
  datetime,
  accesskey,
  tablindex,
  enctype,
  maxlength,
  readonly,
  longdesc,
  style,
  title,
  href,
  src,
  type,
  disabled,
  checked,
  readonly,
  multiple
  如果这里面没有的话可以直接调用Element._attributeTranslations.values["_getAttr"](ele,attr)
  也可以用Element._attributeTranslations.values["_flag"](ele,attr)来判断某个element是否包含指定属性
  */
  readAttribute: function(element, name) {
    element = $(element);
    if (Prototype.Browser.IE) {
      if (!element.attributes) return null;
      var t = Element._attributeTranslations;
      if (t.values[name]) return t.values[name](element, name);
      if (t.names[name])  name = t.names[name];
      var attribute = element.attributes[name];
      return attribute ? attribute.nodeValue : null;
    }
    return element.getAttribute(name);
  },

  getHeight: function(element) {
    return $(element).getDimensions().height;
  },

  getWidth: function(element) {
    return $(element).getDimensions().width;
  },

  classNames: function(element) {
    return new Element.ClassNames(element);
  },

  /*判断element是否有指定的className*/
  /*判断前element.className中前后的空格将会被忽略*/
  hasClassName: function(element, className) {
    if (!(element = $(element))) return;
    var elementClassName = element.className;
    if (elementClassName.length == 0) return false;
    if (elementClassName == className ||
        elementClassName.match(new RegExp("(^|//s)" + className + "(//s|$)")))
      return true;
    return false;
  },

  addClassName: function(element, className) {
    if (!(element = $(element))) return;
    Element.classNames(element).add(className);
    return element;
  },

  removeClassName: function(element, className) {
    if (!(element = $(element))) return;
    Element.classNames(element).remove(className);
    return element;
  },

  toggleClassName: function(element, className) {
    if (!(element = $(element))) return;
    Element.classNames(element)[element.hasClassName(className) ? 'remove' : 'add'](className);
    return element;
  },

  observe: function() {
    Event.observe.apply(Event, arguments);
    return $A(arguments).first();
  },

  stopObserving: function() {
    Event.stopObserving.apply(Event, arguments);
    return $A(arguments).first();
  },

  // removes whitespace-only text node children
  cleanWhitespace: function(element) {
    element = $(element);
    var node = element.firstChild;
    while (node) {
      var nextNode = node.nextSibling;
      if (node.nodeType == 3 && !//S/.test(node.nodeValue))
        element.removeChild(node);
      node = nextNode;
    }
    return element;
  },

  /*判断element的innerHTML是否为空*/
  empty: function(element) {
    return $(element).innerHTML.blank();
  },

  /*判断element是否是ancestor的子孙节点*/
  descendantOf: function(element, ancestor) {
    element = $(element), ancestor = $(ancestor);
    while (element = element.parentNode)
      if (element == ancestor) return true;
    return false;
  },

  /*网页卷动到指定元素的位置*/
  scrollTo: function(element) {
    element = $(element);
    var pos = Position.cumulativeOffset(element);
    window.scrollTo(pos[0], pos[1]);
    return element;
  },
 
  
  getStyle: function(element, style) {
    element = $(element);
    style = style == 'float' ? 'cssFloat' : style.camelize();
    var value = element.style[style];
    if (!value) {
      var css = document.defaultView.getComputedStyle(element, null);
      value = css ? css[style] : null;
    }
    if (style == 'opacity') return value ? parseFloat(value) : 1.0;
    return value == 'auto' ? null : value;
  },

  getOpacity: function(element) {
    return $(element).getStyle('opacity');
  },

  setStyle: function(element, styles, camelized) {
    element = $(element);
    var elementStyle = element.style;

    for (var property in styles)
      if (property == 'opacity') element.setOpacity(styles[property])
      else
        elementStyle[(property == 'float' || property == 'cssFloat') ?
          (elementStyle.styleFloat === undefined ? 'cssFloat' : 'styleFloat') :
          (camelized ? property : property.camelize())] = styles[property];

    return element;
  },

  /*设置透明度*/
  setOpacity: function(element, value) {
    element = $(element);
    element.style.opacity = (value == 1 || value === '') ? '' :
      (value < 0.00001) ? 0 : value;
    return element;
  },

  /*取得DOM元素的大小*/
  getDimensions: function(element) {
    element = $(element);
    var display = $(element).getStyle('display');
    if (display != 'none' && display != null) // Safari bug
      return {width: element.offsetWidth, height: element.offsetHeight};

    // All *Width and *Height properties give 0 on elements with display none,
    // so enable the element temporarily
    var els = element.style;
    var originalVisibility = els.visibility;
    var originalPosition = els.position;
    var originalDisplay = els.display;
    els.visibility = 'hidden';
    els.position = 'absolute';
    els.display = 'block';
    var originalWidth = element.clientWidth;
    var originalHeight = element.clientHeight;
    els.display = originalDisplay;
    els.position = originalPosition;
    els.visibility = originalVisibility;
    return {width: originalWidth, height: originalHeight};
  },

  /*把一个元素的postion从static改为relative*/
  makePositioned: function(element) {
    element = $(element);
    var pos = Element.getStyle(element, 'position');
    if (pos == 'static' || !pos) {
      //这里留下一个记号，表示此元素曾经使用过makePositioned方法
      element._madePositioned = true;
      element.style.position = 'relative';
      // Opera returns the offset relative to the positioning context, when an
      // element is position relative but top and left have not been defined
      if (window.opera) {
        element.style.top = 0;
        element.style.left = 0;
      }
    }
    return element;
  },

  undoPositioned: function(element) {
    element = $(element);
    //必须先makePositioned之后才能undoPositioned
    if (element._madePositioned) {
      //销毁makePositioned的证据
      element._madePositioned = undefined;
      element.style.position =
        element.style.top =
        element.style.left =
        element.style.bottom =
        element.style.right = '';
    }
    return element;
  },

  //设置某个元素的overflow属性为hidden，也就是说超出的地方会被隐藏
  makeClipping: function(element) {
    element = $(element);
    if (element._overflow) return element;
    element._overflow = element.style.overflow || 'auto';
    if ((Element.getStyle(element, 'overflow') || 'visible') != 'hidden')
      element.style.overflow = 'hidden';
    return element;
  },

  //如果对某个元素调用过makeClipping，调用undoClipping会设置overflow属性回auto
  undoClipping: function(element) {
    element = $(element);
    if (!element._overflow) return element;
    element.style.overflow = element._overflow == 'auto' ? '' : element._overflow;
    element._overflow = null;
    return element;
  }
};

Object.extend(Element.Methods, {
  childOf: Element.Methods.descendantOf,
  childElements: Element.Methods.immediateDescendants
});

if (Prototype.Browser.Opera) {
  Element.Methods._getStyle = Element.Methods.getStyle;
  Element.Methods.getStyle = function(element, style) {
    switch(style) {
      case 'left':
      case 'top':
      case 'right':
      case 'bottom':
        if (Element._getStyle(element, 'position') == 'static') return null;
      default: return Element._getStyle(element, style);
    }
  };
}
else if (Prototype.Browser.IE) {
  Element.Methods.getStyle = function(element, style) {
    element = $(element);
    style = (style == 'float' || style == 'cssFloat') ? 'styleFloat' : style.camelize();
    var value = element.style[style];
    if (!value && element.currentStyle) value = element.currentStyle[style];

    if (style == 'opacity') {
      if (value = (element.getStyle('filter') || '').match(/alpha/(opacity=(.*)/)/))
        if (value[1]) return parseFloat(value[1]) / 100;
      return 1.0;
    }

    if (value == 'auto') {
      if ((style == 'width' || style == 'height') && (element.getStyle('display') != 'none'))
        return element['offset'+style.capitalize()] + 'px';
      return null;
    }
    return value;
  };

  Element.Methods.setOpacity = function(element, value) {
    element = $(element);
    var filter = element.getStyle('filter'), style = element.style;
    if (value == 1 || value === '') {
      style.filter = filter.replace(/alpha/([^/)]*/)/gi,'');
      return element;
    } else if (value < 0.00001) value = 0;
    style.filter = filter.replace(/alpha/([^/)]*/)/gi, '') +
      'alpha(opacity=' + (value * 100) + ')';
    return element;
  };

  // IE is missing .innerHTML support for TABLE-related elements
  // 因为IE在处理THEAD,TBODY,TR,TD的时候没有.innerHTML属性，所以只能采用appendChild的方式来曲线救国
  // 首先创建一个包含Table元素的DIV,将要替换的html添加到div的table中，这样就可以利用table以node的方法
  // 读取要添加的html元素，再把这些node添加到element中去
  Element.Methods.update = function(element, html) {
    element = $(element);
    html = typeof html == 'undefined' ? '' : html.toString();
    var tagName = element.tagName.toUpperCase();
    if (['THEAD','TBODY','TR','TD'].include(tagName)) {
      var div = document.createElement('div');
      switch (tagName) {
        case 'THEAD':
        case 'TBODY':
          div.innerHTML = '<table><tbody>' +  html.stripScripts() + '</tbody></table>';
          depth = 2;
          break;
        case 'TR':
          div.innerHTML = '<table><tbody><tr>' +  html.stripScripts() + '</tr></tbody></table>';
          depth = 3;
          break;
        case 'TD':
          div.innerHTML = '<table><tbody><tr><td>' +  html.stripScripts() + '</td></tr></tbody></table>';
          depth = 4;
      }
      $A(element.childNodes).each(function(node) { element.removeChild(node) });
      depth.times(function() { div = div.firstChild });
      $A(div.childNodes).each(function(node) { element.appendChild(node) });
    } else {
      element.innerHTML = html.stripScripts();
    }
    setTimeout(function() { html.evalScripts() }, 10);
    return element;
  }
}
else if (Prototype.Browser.Gecko) {
  Element.Methods.setOpacity = function(element, value) {
    element = $(element);
    element.style.opacity = (value == 1) ? 0.999999 :
      (value === '') ? '' : (value < 0.00001) ? 0 : value;
    return element;
  };
}

/*关于getAttribute说明
    Retrieves the value of the specified attribute.

    Syntax

    vAttrValue = object.getAttribute(sAttrName [, iFlags])
    Parameters

    sAttrName Required. String that specifies the name of the attribute. 
    iFlags Optional. Integer that specifies one or more of the following flags:
    0 Default. Performs a property search that is not case-sensitive, and returns an interpolated value if the property is found. 
    1 Performs a case-sensitive property search. To find a match, the uppercase and lowercase letters in sAttrName must exactly match those in the attribute name. If the iFlags parameter for getAttribute is set to 1 and this option is set to 0 (default), the specified property name might not be found. 
    2 Returns the value exactly as it was set in script or in the source document. 
    

    Return Value
    Variant that returns a String, number, or Boolean value as defined by the attribute. If the attribute is not present, this method returns null. 
*/
Element._attributeTranslations = {
  names: {
    colspan:   "colSpan",
    rowspan:   "rowSpan",
    valign:    "vAlign",
    datetime:  "dateTime",
    accesskey: "accessKey",
    tabindex:  "tabIndex",
    enctype:   "encType",
    maxlength: "maxLength",
    readonly:  "readOnly",
    longdesc:  "longDesc"
  },
  values: {
    //取得attribute node
    _getAttr: function(element, attribute) {
      return element.getAttribute(attribute, 2);
    },
    //判断是否包含某个attribute
    _flag: function(element, attribute) {
      return $(element).hasAttribute(attribute) ? attribute : null;
    },
    //获得DOM中style属性的内容
    style: function(element) {
      return element.style.cssText.toLowerCase();
    },
    //获得DOM元素title属性的内用
    title: function(element) {
      var node = element.getAttributeNode('title');
      return node.specified ? node.nodeValue : null;
    }
  }
};

/*给Element._attributeTranslations.values添加了7个方法
之所以写在外面完全是为了DRY吧
href,
src,
type,
disabled,
checked,
readonly,
multiple
这样话基本上所有的属性都覆盖到了，除了一些不常用的，例如dir,lang等
*/
(function() {
  Object.extend(this, {
    href: this._getAttr,
    src:  this._getAttr,
    type: this._getAttr,
    disabled: this._flag,
    checked:  this._flag,
    readonly: this._flag,
    multiple: this._flag
  });
}).call(Element._attributeTranslations.values);

/* getAttributeNode方法说明
    Retrieves an attribute object referenced by the attribute.name property.

    Syntax

    oAttribute = object.getAttributeNode(sName)
    Parameters

    sName Required. String that specifies the name property of the requested attribute object.

    Return Value

    Returns a reference to an attribute object.
*/
Element.Methods.Simulated = {
  hasAttribute: function(element, attribute) {
    var t = Element._attributeTranslations, node;
    attribute = t.names[attribute] || attribute;
    node = $(element).getAttributeNode(attribute);
    return node && node.specified;
  }
};

Element.Methods.ByTag = {};

Object.extend(Element, Element.Methods);

if (!Prototype.BrowserFeatures.ElementExtensions &&
 document.createElement('div').__proto__) {
  window.HTMLElement = {};
  window.HTMLElement.prototype = document.createElement('div').__proto__;
  Prototype.BrowserFeatures.ElementExtensions = true;
}

Element.hasAttribute = function(element, attribute) {
  if (element.hasAttribute) return element.hasAttribute(attribute);
  return Element.Methods.Simulated.hasAttribute(element, attribute);
};

Element.addMethods = function(methods) {
  var F = Prototype.BrowserFeatures, T = Element.Methods.ByTag;

  if (!methods) {
    Object.extend(Form, Form.Methods);
    Object.extend(Form.Element, Form.Element.Methods);
    Object.extend(Element.Methods.ByTag, {
    //在Element.Methods.ByTag下产生四个命名空间，各自下面有不同标签对应的方法
      "FORM":     Object.clone(Form.Methods),
      "INPUT":    Object.clone(Form.Element.Methods),
      "SELECT":   Object.clone(Form.Element.Methods),
      "TEXTAREA": Object.clone(Form.Element.Methods)
    });
  }

  if (arguments.length == 2) {
    var tagName = methods;
    methods = arguments[1];
  }

  if (!tagName) Object.extend(Element.Methods, methods || {});
  else {
    if (tagName.constructor == Array) tagName.each(extend);
    else extend(tagName);
  }

  function extend(tagName) {
    tagName = tagName.toUpperCase();
    if (!Element.Methods.ByTag[tagName])
      Element.Methods.ByTag[tagName] = {};
    Object.extend(Element.Methods.ByTag[tagName], methods);
  }

  function copy(methods, destination, onlyIfAbsent) {
    onlyIfAbsent = onlyIfAbsent || false;
    var cache = Element.extend.cache;
    for (var property in methods) {
      var value = methods[property];
      if (!onlyIfAbsent || !(property in destination))
        destination[property] = cache.findOrStore(value);
    }
  }

  function findDOMClass(tagName) {
    var klass;
    var trans = {
      "OPTGROUP": "OptGroup", "TEXTAREA": "TextArea", "P": "Paragraph",
      "FIELDSET": "FieldSet", "UL": "UList", "OL": "OList", "DL": "DList",
      "DIR": "Directory", "H1": "Heading", "H2": "Heading", "H3": "Heading",
      "H4": "Heading", "H5": "Heading", "H6": "Heading", "Q": "Quote",
      "INS": "Mod", "DEL": "Mod", "A": "Anchor", "IMG": "Image", "CAPTION":
      "TableCaption", "COL": "TableCol", "COLGROUP": "TableCol", "THEAD":
      "TableSection", "TFOOT": "TableSection", "TBODY": "TableSection", "TR":
      "TableRow", "TH": "TableCell", "TD": "TableCell", "FRAMESET":
      "FrameSet", "IFRAME": "IFrame"
    };
    if (trans[tagName]) klass = 'HTML' + trans[tagName] + 'Element';
    if (window[klass]) return window[klass];
    klass = 'HTML' + tagName + 'Element';
    if (window[klass]) return window[klass];
    klass = 'HTML' + tagName.capitalize() + 'Element';
    if (window[klass]) return window[klass];

    window[klass] = {};
    window[klass].prototype = document.createElement(tagName).__proto__;
    return window[klass];
  }

  if (F.ElementExtensions) {
    copy(Element.Methods, HTMLElement.prototype);
    copy(Element.Methods.Simulated, HTMLElement.prototype, true);
  }

  if (F.SpecificElementExtensions) {
    for (var tag in Element.Methods.ByTag) {
      var klass = findDOMClass(tag);
      if (typeof klass == "undefined") continue;
      copy(T[tag], klass.prototype);
    }
  }

  Object.extend(Element, Element.Methods);
  delete Element.ByTag;
};

var Toggle = { display: Element.toggle };

/*--------------------------------------------------------------------------*/

Abstract.Insertion = function(adjacency) {
  this.adjacency = adjacency;
}

/*
    Inserts the given HTML text into the element at the location.

    Syntax

    object.insertAdjacentHTML(sWhere, sText)
    Parameters

    sWhere Required. String that specifies where to insert the HTML text, using one of the following values: beforeBegin Inserts sText immediately before the object. 
    afterBegin Inserts sText after the start of the object but before all other content in the object. 
    beforeEnd Inserts sText immediately before the end of the object but after all other content in the object. 
    afterEnd Inserts sText immediately after the end of the object. 
     
    sText Required. String that specifies the HTML text to insert. The string can be a combination of text and HTML tags. This must be well-formed, valid HTML or this method will fail. 
*/
Abstract.Insertion.prototype = {
  initialize: function(element, content) {
    this.element = $(element);
    this.content = content.stripScripts();

    if (this.adjacency && this.element.insertAdjacentHTML) {
      try {
        this.element.insertAdjacentHTML(this.adjacency, this.content);
      } catch (e) {
        var tagName = this.element.tagName.toUpperCase();
        // 在TBODY和TR前插入对象与众不同
        if (['TBODY', 'TR'].include(tagName)) {
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

  // 构造一个匿名table，然后把指定的内容插到<tbody></tbody>之间
  // 最后返回一个代表指定内容的node对象
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
    this.element.className.split(//s+/).select(function(name) {
      return name.length > 0;
    })._each(iterator);
  },

  set: function(className) {
    this.element.className = className;
  },

  add: function(classNameToAdd) {
    if (this.include(classNameToAdd)) return;
    this.set($A(this).concat(classNameToAdd).join(' '));
  },

  remove: function(classNameToRemove) {
    if (!this.include(classNameToRemove)) return;
    this.set($A(this).without(classNameToRemove).join(' '));
  },

  toString: function() {
    return $A(this).join(' ');
  }
};