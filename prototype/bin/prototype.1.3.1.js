/**
 * 定义一个全局对象, 属性 Version 在发布的时候会替换为当前版本号
 */
var Prototype = {
  Version: '1.3.1',
  // 一个空方法，其后的代码常会用到，先前的版本该方法被定义于 Ajax 类中。
  emptyFunction: function() {}
}

/**
 * 创建一种类型，注意其属性 create 是一个方法，返回一个构造函数。
 * 一般使用如下 
 *     var X = Class.create();  返回一个类型，类似于 java 的一个Class实例。
 * 要使用 X 类型，需继续用 new X()来获取一个实例，如同 java 的 Class.newInstance()方法。
 *
 * 返回的构造函数会执行名为 initialize 的方法， initialize 是 Ruby 对象的构造器方法名字。
 * 此时initialize方法还没有定义，其后的代码中创建新类型时会建立相应的同名方法。
 *
 * 如果一定要从java上去理解。你可以理解为用Class.create()创建一个继承java.lang.Class类的类。
 * 当然java不允许这样做，因为Class类是final的
 *
 */
var Class = {
  create: function() {
    return function() {
      this.initialize.apply(this, arguments);
    }
  }
}

/**
 * 创建一个对象，从变量名来思考，本意也许是定义一个抽象类，以后创建新对象都 extend 它。
 * 但从其后代码的应用来看， Abstract 更多是为了保持命名空间清晰的考虑。
 * 也就是说，我们可以给 Abstract 这个对象实例添加新的对象定义。
 *
 * 从java去理解，就是动态给一个对象创建内部类。
 */
var Abstract = new Object();


Object.extend = function(destination, source) {
  for (property in source) {
    destination[property] = source[property];
  }
  return destination;
}

/**
 * 获取参数对象的所有属性和方法，有点象多重继承。但是这种继承是动态获得的。
 * 如：
 *     var a = new ObjectA(), b = new ObjectB();
 *     var c = a.extend(b);
 * 此时 c 对象同时拥有 a 和 b 对象的属性和方法。但是与多重继承不同的是，c instanceof ObjectB 将返回false。
 *
 * 旧版本的该方法定义如下：
 * Object.prototype.extend = function(object) {
 *     for (property in object) {
 *         this[property] = object[property];
 *     }
 *     return this;
 * }
 *
 * 新的形式新定义了一个静态方法 Object.extend，这样做的目的大概是为了使代码更为清晰
 */
Object.prototype.extend = function(object) {
  return Object.extend.apply(this, [this, object]);
}

/**
 * 这个方法很有趣，它封装一个javascript函数对象，返回一个新函数对象，新函数对象的主体和原对象相同，
 * 但是bind()方法参数将被用作当前对象的对象。
 * 也就是说新函数中的 this 引用被改变为参数提供的对象。
 * 比如：
 *     <input type="text" id="aaa" value="aaa">
 *     <input type="text" id="bbb" value="bbb">
 *     .................
 *     <script>
 *         var aaa = document.getElementById("aaa");
 *         var bbb = document.getElementById("bbb");
 *         aaa.showValue = function() {alert(this.value);}
 *         aaa.showValue2 = aaa.showValue.bind(bbb);
 *     </script>
 * 那么，调用aaa.showValue 将返回"aaa", 但调用aaa.showValue2 将返回"bbb"。
 *
 * apply 是ie5.5后才出现的新方法(Netscape好像很早就支持了)。
 * 该方法更多的资料参考MSDN http://msdn.microsoft.com/library/en-us/script56/html/js56jsmthApply.asp
 * 阅读其后的代码就会发现，bind 被应用的很广泛，该方法和 Object.prototype.extend 一样是 Prototype 的核心。
 * 还有一个 call 方法，应用起来和 apply 类似。可以一起研究下。
 */
Function.prototype.bind = function(object) {
  var __method = this;
  return function() {
    __method.apply(object, arguments);
  }
}

/**
 * 和bind一样，不过这个方法一般用做html控件对象的事件处理。所以要传递event对象
 * 注意这时候，用到了 Function.call。它与 Function.apply 的不同好像仅仅是对参数形式的定义。
 * 如同 java 两个过载的方法。
 */
Function.prototype.bindAsEventListener = function(object) {
  var __method = this;
  return function(event) {
    __method.call(object, event || window.event);
  }
}

/**
 * 将整数形式RGB颜色值转换为HEX形式
 */
Number.prototype.toColorPart = function() {
  var digits = this.toString(16);
  if (this < 16) return '0' + digits;
  return digits;
}

/**
 * 典型 Ruby 风格的函数，将参数中的方法逐个调用，返回第一个成功执行的方法的返回值
 */
var Try = {
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

/**
 * 一个设计精巧的定时执行器
 * 首先由 Class.create() 创建一个 PeriodicalExecuter 类型，
 * 然后用对象直接量的语法形式设置原型。
 *
 * 需要特别说明的是 rgisterCallback 方法，它调用上面定义的函数原型方法bind, 并传递自己为参数。
 * 之所以这样做，是因为 setTimeout 默认总以 window 对象为当前对象，也就是说，如果 registerCallback 方法定义如下的话：
 *     registerCallback: function() {
 *         setTimeout(this.onTimerEvent, this.frequency * 1000);
 *     }
 * 那么，this.onTimeoutEvent 方法执行失败，因为它无法访问 this.currentlyExecuting 属性。
 * 而使用了bind以后，该方法才能正确的找到this，也就是PeriodicalExecuter的当前实例。
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
    setInterval(this.onTimerEvent.bind(this), this.frequency * 1000);
  },

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

/**
 * 这个函数就 Ruby 了。我觉得它的作用主要有两个
 * 1.  大概是 document.getElementById(id) 的最简化调用。
 * 比如：$("aaa") 将返回 aaa 对象
 * 2.  得到对象数组
 * 比如: $("aaa","bbb") 返回一个包括id为"aaa"和"bbb"两个input控件对象的数组。
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

/**
 * 为兼容旧版本的浏览器增加 Array 的 push 方法。
 */
if (!Array.prototype.push) {
  Array.prototype.push = function() {
      var startLength = this.length;
      for (var i = 0; i < arguments.length; i++)
      this[startLength + i] = arguments[i];
     return this.length;
  }
}

/**
 * 为兼容旧版本的浏览器增加 Function 的 apply 方法。
 */
if (!Function.prototype.apply) {
  // Based on code from http://www.youngpup.net/
  Function.prototype.apply = function(object, parameters) {
    var parameterStrings = new Array();
    if (!object)     object = window;
    if (!parameters) parameters = new Array();
   
    for (var i = 0; i < parameters.length; i++)
      parameterStrings[i] = 'parameters[' + i + ']';
   
    object.__apply__ = this;
    var result = eval('object.__apply__(' +
      parameterStrings.join(', ') + ')');
    object.__apply__ = null;
   
    return result;
  }
}

/**
 * 扩展 javascript 内置的 String 对象
 */
String.prototype.extend({

  /**
   * 去掉字符串中的<html>标签
   */
  stripTags: function() {
    return this.replace(/<\/?[^>]+>/gi, '');
  },

  /**
   * 这个方法很常见，通常的实现都是用正则表达式替换特殊字符为html规范定义的命名实体或者十进制编码，比如：
   * string.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
   * 而这里的实现借用浏览器自身的内部替换，确实巧妙。
   */
  escapeHTML: function() {
    var div = document.createElement('div');
    var text = document.createTextNode(this);
    div.appendChild(text);
    return div.innerHTML;
  },
 
  /**
   * 同上
   */
  unescapeHTML: function() {
    var div = document.createElement('div');
    div.innerHTML = this.stripTags();
    return div.childNodes[0].nodeValue;
  }
});

/**
 * 定义 Ajax 对象, 静态方法 getTransport 方法返回一个 XMLHttp 对象
 */
var Ajax = {
  getTransport: function() {
    return Try.these(
      function() {return new ActiveXObject('Msxml2.XMLHTTP')},
      function() {return new ActiveXObject('Microsoft.XMLHTTP')},
      function() {return new XMLHttpRequest()}
    ) || false;
  }
}

/**
 * 我以为此时的Ajax对象起到命名空间的作用。
 * Ajax.Base 声明为一个基础对象类型
 * 注意 Ajax.Base 并没有使用 Class.create() 的方式来创建，我想是因为作者并不希望 Ajax.Base 被库使用者实例化。
 * 作者在其他对象类型的声明中，将会继承于它。
 * 就好像 java 中的私有抽象类
 */
Ajax.Base = function() {};
Ajax.Base.prototype = {
  /**
   * extend (见上) 的用法真是让人耳目一新
   * options 首先设置默认属性，然后再 extend 参数对象，那么参数对象中也有同名的属性，那么就覆盖默认属性值。
   * 想想如果我写这样的实现，应该类似如下：
     setOptions: function(options) {
      this.options.methed = options.methed? options.methed : 'post';
      ..........
     }
     我想很多时候，java 限制了 js 的创意。
   */
  setOptions: function(options) {
    this.options = {
      method:       'post',
      asynchronous: true,
      parameters:   ''
    }.extend(options || {});
  },
 
  /**
   * 如果　xmlhttp 调用返回正确的HTTP状态值，函数返回ture,　反之false。
   * xmlhttp　的 readyState 属性不足以准确判断 xmlhttp　远程调用成功，该方法是readyState判断的一个前提条件
   */
  responseIsSuccess: function() {
    return this.transport.status == undefined
        || this.transport.status == 0
        || (this.transport.status >= 200 && this.transport.status < 300);
  },
 
  /**
   * 如果　xmlhttp 调用返回错误的HTTP状态值，函数返回ture,　反之false。
   */
  responseIsFailure: function() {
    return !this.responseIsSuccess();
  }
}

/**
 * Ajax.Request 封装 XmlHttp
 */
Ajax.Request = Class.create();

/**
 * 定义四种事件(状态)， 参考http://msdn.microsoft.com/workshop/author/dhtml/reference/properties/readystate_1.asp
 */
Ajax.Request.Events =
  ['Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete'];

/**
 *　相比先前的版本，对于　xmlhttp 的调用和返回值处理分离得更为清晰
 */
Ajax.Request.prototype = (new Ajax.Base()).extend({
  initialize: function(url, options) {
    this.transport = Ajax.getTransport();
    this.setOptions(options);
    this.request(url);
  },

　/**
   * 新增加 request 方法封装 xmlhttp　的调用过程。
   */
  request: function(url) {
    var parameters = this.options.parameters || '';
    if (parameters.length > 0) parameters += '&_=';

    try {
      if (this.options.method == 'get')
        url += '?' + parameters;

      this.transport.open(this.options.method, url,
        this.options.asynchronous);

      if (this.options.asynchronous) {
        this.transport.onreadystatechange = this.onStateChange.bind(this);
        setTimeout((function() {this.respondToReadyState(1)}).bind(this), 10);
      }

      this.setRequestHeaders();

      var body = this.options.postBody ? this.options.postBody : parameters;
      this.transport.send(this.options.method == 'post' ? body : null);

    } catch (e) {
    }
  },

  /**
   * 新增加的 setRequestHeaders 方法允许添加自定义的http header
   */
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

   /**
    * 其后的 apply 方法的调用有些奇技淫巧的意味
    * 从上下文中我们可以分析出 this.options.requestHeaders 是调用者自定义的http header数组。
    * requestHeaders 也是一个数组，将一个数组中的元素逐个添加到另一个元素中，直接调用
    * requestHeaders.push(this.options.requestHeaders)
    * 是不行的，因为该调用导致 this.options.requestHeaders 整个数组作为一个元素添加到 requestHeaders中。
    * javascript的Array对象还提供一个concat 的方法表面上满足要求，但是concat实际上是创建一个新数组，将两个数组的元素添加到新数组中。
    * 所以，下面的代码也可以替换为
    * requestHeaders = requestHeaders.concat(this.options.requestHeaders);
    * 很显然，作者不喜欢这样的代码方式
    * 而 apply 方法的语法 apply([thisObj[,argArray]]) 本身就要求第二个参数是一个数组或者arguments对象。
    * 所以巧妙的实现了 concat 函数的作用。
    * 令人拍案叫绝啊!
    */
    if (this.options.requestHeaders)
      requestHeaders.push.apply(requestHeaders, this.options.requestHeaders);

    for (var i = 0; i < requestHeaders.length; i += 2)
      this.transport.setRequestHeader(requestHeaders[i], requestHeaders[i+1]);
  },

 
  onStateChange: function() {
    var readyState = this.transport.readyState;
   /**
    * 如果不是 Loading 状态，就调用回调函数
     */
    if (readyState != 1)
      this.respondToReadyState(this.transport.readyState);
  },

  /**
   * 回调函数定义在 this.options 属性中，比如:
      var option = {
         onLoaded : function(req) {...};
         ......
      }
      new Ajax.Request(url, option);
   */
  respondToReadyState: function(readyState) {
    var event = Ajax.Request.Events[readyState];

    /**
    * 新增的回调函数处理，调用者还可以在options中定义 on200, onSuccess 这样的回调函数
    * 在 readyState 为完成状态的时候调用
    */
    if (event == 'Complete')
      (this.options['on' + this.transport.status]
       || this.options['on' + (this.responseIsSuccess() ? 'Success' : 'Failure')]
       || Prototype.emptyFunction)(this.transport);

    (this.options['on' + event] || Prototype.emptyFunction)(this.transport);

    /* Avoid memory leak in MSIE: clean up the oncomplete event handler */
    if (event == 'Complete')
      this.transport.onreadystatechange = Prototype.emptyFunction;
  }
});

/**
 * Ajax.Updater 用于绑定一个html元素与 XmlHttp调用的返回值。类似与 buffalo 的 bind。
 * 如果 options 中有 insertion(见后) 对象的话, insertion 能提供更多的插入控制。
 */
Ajax.Updater = Class.create();
Ajax.Updater.ScriptFragment = '(?:<script.*?>)((\n|.)*?)(?:<\/script>)';

Ajax.Updater.prototype.extend(Ajax.Request.prototype).extend({
  initialize: function(container, url, options) {

   /**
    * containers 就是被绑定的 html 对象，xmlhttp的返回值被赋给该对象的 innerHTML 属性。
    * 相比新版本，containers 根据container参数定义 success 和 failure 引用，如果它们被定义的话，根据xmlhttp调用是否成功来选择
    * 更新对象，假想调用可能如下：
    * var c = {success: $("successDiv"), failure: $("failureDiv")};
    * new Ajax.Updater(c, url, options);
    * 那么调用成功则 successDiv 显示成功信息或者数据，反之 failureDiv 显示错误信息
    */
    this.containers = {
      success: container.success ? $(container.success) : $(container),
      failure: container.failure ? $(container.failure) :
        (container.success ? null : $(container))
    }

    this.transport = Ajax.getTransport();
    this.setOptions(options);

    var onComplete = this.options.onComplete || Prototype.emptyFunction;
    this.options.onComplete = (function() {
      this.updateContent();
      onComplete(this.transport);
    }).bind(this);

    this.request(url);
  },

  updateContent: function() {
    var receiver = this.responseIsSuccess() ?
      this.containers.success : this.containers.failure;

    var match    = new RegExp(Ajax.Updater.ScriptFragment, 'img');
    var response = this.transport.responseText.replace(match, '');
    var scripts  = this.transport.responseText.match(match);

    if (receiver) {
      if (this.options.insertion) {
        new this.options.insertion(receiver, response);
      } else {
        receiver.innerHTML = response;
      }
    }

    if (this.responseIsSuccess()) {
      if (this.onComplete)
        setTimeout((function() {this.onComplete(
          this.transport)}).bind(this), 10);
    }

   /**
    * 如果调用者在传入的options参数中定义 evalScripts=true，同时xmlhttp返回值的html中包含<script>标签的话，执行该脚本
    */
    if (this.options.evalScripts && scripts) {
     /**
      * 注意前二十行左右还有一个 match 的声明
      * var match    = new RegExp(Ajax.Updater.ScriptFragment, 'img');
      * 和此处的区别就是，正则表达式匹配标记多一个 "g"。
      * 多个g, 所以 scripts 是一个数组，数组中每个元素是一段 <script>...</script> 文本。
      * 没有g, scripts[i].match(match)[1] 匹配的就是 <script>标记中的 script 代码。
      * 关于正则表达式，请参考javascript的相关资料。
      */
      match = new RegExp(Ajax.Updater.ScriptFragment, 'im');
      setTimeout((function() {
        for (var i = 0; i < scripts.length; i++)
          eval(scripts[i].match(match)[1]);
      }).bind(this), 10);
    }
  }
});

/**
 * 定期更新器
 */
Ajax.PeriodicalUpdater = Class.create();
Ajax.PeriodicalUpdater.prototype = (new Ajax.Base()).extend({
  initialize: function(container, url, options) {
    this.setOptions(options);
    this.onComplete = this.options.onComplete;

    this.frequency = (this.options.frequency || 2);
   // decay 可能是一个时间调整因素
    this.decay = 1;

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
    (this.onComplete || Ajax.emptyFunction).apply(this, arguments);
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

/**
 * 根据 class attribute 的名字得到对象数组，支持 multiple class
 *
 */
document.getElementsByClassName = function(className) {
  var children = document.getElementsByTagName('*') || document.all;
  var elements = new Array();
 
  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    var classNames = child.className.split(' ');
    for (var j = 0; j < classNames.length; j++) {
      if (classNames[j] == className) {
        elements.push(child);
        break;
      }
    }
  }
 
  return elements;
}

/*--------------------------------------------------------------------------*/


/**
 * Element 就象一个 java 的工具类，主要用来 隐藏/显示/销除 对象，以及获取对象的简单属性。
 *
 */
if (!window.Element) {
  var Element = new Object();
}

Object.extend(Element, {
  /**
   * 切换 显示/隐藏
   */
  toggle: function() {
    for (var i = 0; i < arguments.length; i++) {
      var element = $(arguments[i]);
      element.style.display =
        (element.style.display == 'none' ? '' : 'none');
    }
  },

  hide: function() {
    for (var i = 0; i < arguments.length; i++) {
      var element = $(arguments[i]);
      element.style.display = 'none';
    }
  },

  show: function() {
    for (var i = 0; i < arguments.length; i++) {
      var element = $(arguments[i]);
      element.style.display = '';
    }
  },

  /**
   * 从父节点中移除
   */
  remove: function(element) {
    element = $(element);
    element.parentNode.removeChild(element);
  },
   
  getHeight: function(element) {
    element = $(element);
    return element.offsetHeight;
  },

  /**
   * 是否拥有 class 属性值
   */
  hasClassName: function(element, className) {
    element = $(element);
    if (!element)
      return;
    var a = element.className.split(' ');
    for (var i = 0; i < a.length; i++) {
      if (a[i] == className)
        return true;
    }
    return false;
  },

  /**
   * 为对象添加 class 属性值
   */
  addClassName: function(element, className) {
    element = $(element);
    Element.removeClassName(element, className);
    element.className += ' ' + className;
  },

  /**
   * 为对象移除 class 属性值
   */
  removeClassName: function(element, className) {
    element = $(element);
    if (!element)
      return;
    var newClassName = '';
    var a = element.className.split(' ');
    for (var i = 0; i < a.length; i++) {
      if (a[i] != className) {
        if (i > 0)
          newClassName += ' ';
        newClassName += a[i];
      }
    }
    element.className = newClassName;
  },
 
  // removes whitespace-only text node children
  cleanWhitespace: function(element) {
    var element = $(element);
    for (var i = 0; i < element.childNodes.length; i++) {
      var node = element.childNodes[i];
      if (node.nodeType == 3 && !/\S/.test(node.nodeValue))
        Element.remove(node);
    }
  }
});

/**
 * 为 Element.toggle 做了一个符号连接，大概是兼容性的考虑
 */
var Toggle = new Object();
Toggle.display = Element.toggle;

/*--------------------------------------------------------------------------*/

/**
 * 动态插入内容的实现，MS的Jscript实现中对象有一个 insertAdjacentHTML 方法
 * (http: //msdn.microsoft.com/workshop/author/dhtml/reference/methods/insertadjacenthtml.asp)
 * 这里算是一个对象形式的封装。
 */
Abstract.Insertion = function(adjacency) {
  this.adjacency = adjacency;
}

Abstract.Insertion.prototype = {
  initialize: function(element, content) {
    this.element = $(element);
    this.content = content;
   
    if (this.adjacency && this.element.insertAdjacentHTML) {
      this.element.insertAdjacentHTML(this.adjacency, this.content);
    } else {
      /**
      * gecko 不支持 insertAdjacentHTML 方法，但可以用如下代码代替
      */
      this.range = this.element.ownerDocument.createRange();
     /**
      * 如果定义了 initializeRange 方法，则实行，这里相当与定义了一个抽象的 initializeRange 方法
      */
      if (this.initializeRange) this.initializeRange();
      this.fragment = this.range.createContextualFragment(this.content);

     /**
      * insertContent 也是一个抽象方法，子类必须实现
      */
      this.insertContent();
    }
  }
}

/**
 * prototype 加深了我的体会，就是写js 如何去遵循　Don’t Repeat Yourself (DRY) 原则
 * 上文中 Abstract.Insertion 算是一个抽象类，定义了名为　initializeRange 的一个抽象方法
 * var Insertion = new Object()　建立一个命名空间
 * Insertion.Before|Top|Bottom|After 就象是四个java中的四个静态内部类，而它们分别继承于Abstract.Insertion，并实现了initializeRange方法。
 */
var Insertion = new Object();

/**
* 将内容插入到指定节点的前面, 与指定节点同级
*/
Insertion.Before = Class.create();
Insertion.Before.prototype = (new Abstract.Insertion('beforeBegin')).extend({
  initializeRange: function() {
    this.range.setStartBefore(this.element);
  },
 
  insertContent: function() {
    this.element.parentNode.insertBefore(this.fragment, this.element);
  }
});

/**
* 将内容插入到指定节点的第一个子节点前，于是内容变为该节点的第一个子节点
*/
Insertion.Top = Class.create();
Insertion.Top.prototype = (new Abstract.Insertion('afterBegin')).extend({
  initializeRange: function() {
    this.range.selectNodeContents(this.element);
    this.range.collapse(true);
  },
 
  insertContent: function() { 
    this.element.insertBefore(this.fragment, this.element.firstChild);
  }
});

/**
* 将内容插入到指定节点的最后，于是内容变为该节点的最后一个子节点
*/
Insertion.Bottom = Class.create();
Insertion.Bottom.prototype = (new Abstract.Insertion('beforeEnd')).extend({
  initializeRange: function() {
    this.range.selectNodeContents(this.element);
    this.range.collapse(this.element);
  },
 
  insertContent: function() {
    this.element.appendChild(this.fragment);
  }
});

/**
* 将内容插入到指定节点的后面, 与指定节点同级
*/
Insertion.After = Class.create();
Insertion.After.prototype = (new Abstract.Insertion('afterEnd')).extend({
  initializeRange: function() {
    this.range.setStartAfter(this.element);
  },
 
  insertContent: function() {
    this.element.parentNode.insertBefore(this.fragment,
      this.element.nextSibling);
  }
});

/**
 * 针对 页面元素对象(一般都是表单控件)的工具类，提供一些简单静态方法
 * 这些方法显然常用在表单处理中
 * 注意 Field 这种声明方式类似于 java 声明一个静态的 singleton 工具类
 * 等同于 :
 *   var Field = new Object();
 *   Field.extend({...});
 *
 * 后文中的 Form, Event, Position 对象声明方式如出一辙
 */
var Field = {

  /**
   * 清除参数引用的对象的值
   */
  clear: function() {
    for (var i = 0; i < arguments.length; i++)
      $(arguments[i]).value = '';
  },

  /**
   * 使参数引用对象获取焦点
   */
  focus: function(element) {
    $(element).focus();
  },
 
  /**
   * 判断参数引用对象是否有非空值，如为空值，返回false, 反之true
   */
  present: function() {
    for (var i = 0; i < arguments.length; i++)
      if ($(arguments[i]).value == '') return false;
    return true;
  },
 
  /**
   * 使选中参数引用对象
   */
  select: function(element) {
    $(element).select();
  },
   
  /**
   * 使参数引用对象处于可编辑状态
   */
  activate: function(element) {
    $(element).focus();
    $(element).select();
  }
}

/*--------------------------------------------------------------------------*/

/**
 * 表单工具类
 */
var Form = {
  /**
   * 将表单元素序列化后的值(其实就是 name=value 形式的名值配对)组合成 QueryString 的形式
   */
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
 
  /**
   * 得到表单的所有元素对象
   */
  getElements: function(form) {
    var form = $(form);
    var elements = new Array();

    for (tagName in Form.Element.Serializers) {
      var tagElements = form.getElementsByTagName(tagName);
      for (var j = 0; j < tagElements.length; j++)
        elements.push(tagElements[j]);
    }
    return elements;
  },
 
  /**
   * 根据 type 和 name 过滤得到表单中符合的 <input> 对象
   */
  getInputs: function(form, typeName, name) {
    var form = $(form);
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

  /**
   * 将指定表单的元素置于不可用状态
   */ 
  disable: function(form) {
    var elements = Form.getElements(form);
    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      element.blur();
      element.disabled = 'true';
    }
  },

  /**
   * 将指定表单的元素置于可用状态
   */
  enable: function(form) {
    var elements = Form.getElements(form);
    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      element.disabled = '';
    }
  },

  /**
   * 使表单的第一个非 hidden 类型而且处于可用状态的元素获得焦点
   */
  focusFirstElement: function(form) {
    var form = $(form);
    var elements = Form.getElements(form);
    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      if (element.type != 'hidden' && !element.disabled) {
        Field.activate(element);
        break;
      }
    }
  },

  /*
   * 重置表单
   */
  reset: function(form) {
    $(form).reset();
  }
}

/**
 * 表单元素工具类
 */
Form.Element = {
  /**
   * 返回表单元素的值先序列化, 其实就是 name=value 形式的名值配对
   */
  serialize: function(element) {
    var element = $(element);
    var method = element.tagName.toLowerCase();
    var parameter = Form.Element.Serializers[method](element);
   
    if (parameter)
      return encodeURIComponent(parameter[0]) + '=' +
        encodeURIComponent(parameter[1]);                   
  },
 
  /**
   *  返回表单元素的值
   */
  getValue: function(element) {
    var element = $(element);
    var method = element.tagName.toLowerCase();
    var parameter = Form.Element.Serializers[method](element);
   
    if (parameter)
      return parameter[1];
  }
}

/**
 * prototype 的所谓序列化其实就是将表单的名字和值组合成一个数组
 */
Form.Element.Serializers = {
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

  /**
   * 单/多选框 由此方法处理序列化
   */
  inputSelector: function(element) {
    if (element.checked)
      return [element.name, element.value];
  },

  /**
   * textarea 由此方法处理序列化
   */
  textarea: function(element) {
    return [element.name, element.value];
  },

  /**
   * select 下拉列表由此方法处理序列化
   */
  select: function(element) {
    var value = '';
    if (element.type == 'select-one') {
      var index = element.selectedIndex;
      if (index >= 0)
        value = element.options[index].value || element.options[index].text;
    } else {
     /**
      * 支持 select-mulitple 的下拉列表，返回的数组的第二个元素，是一个值数组
      */
      value = new Array();
      for (var i = 0; i < element.length; i++) {
        var opt = element.options[i];
        if (opt.selected)
          value.push(opt.value || opt.text);
      }
    }
    return [element.name, value];
  }
}

/*--------------------------------------------------------------------------*/
/**
 * Form.Element.getValue 会经常用到，所以做了一个快捷引用
 * 取得某个表单控件的值，可以简化调用为 $F("username")，真是方便啊
 */
var $F = Form.Element.getValue;

/*--------------------------------------------------------------------------*/

/**
 * Abstract.TimedObserver 也没有用 Class.create() 来创建，和Ajax.Base 意图应该一样
 * Abstract.TimedObserver 顾名思义，是套用Observer设计模式来跟踪指定表单元素，
 * 当表单元素的值发生变化的时候，就执行回调函数
 *
 * 我想　Observer 与注册onchange事件相似，不同点在于 onchange 事件是在元素失去焦点的时候才激发。
 * 同样的与 onpropertychange 事件也相似，不过它只关注表单元素的值的变化，而且提供timeout的控制。
 *
 * 除此之外，Observer 的好处大概就在与更面向对象，另外可以动态的更换回调函数，这就比注册事件要灵活一些。
 * Observer 应该可以胜任动态数据校验，或者多个关联下拉选项列表的连动等等
 *
 */
Abstract.TimedObserver = function() {}

/**
 * 这个设计和 PeriodicalExecuter 一样，bind 方法是实现的核心
 */
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

/**
 * Form.Element.Observer 监视指定表单域的值是否变化
 */
Form.Element.Observer = Class.create();
Form.Element.Observer.prototype = (new Abstract.TimedObserver()).extend({
  getValue: function() {
    return Form.Element.getValue(this.element);
  }
});

/**
 * Form.Element.Observer 监视指定表单所有控件的值是否有变化
 */
Form.Observer = Class.create();
Form.Observer.prototype = (new Abstract.TimedObserver()).extend({
  getValue: function() {
    return Form.serialize(this.element);
  }
});

/*--------------------------------------------------------------------------*/

/**
 * EventObserver 相比上面的 TimedObserver，是更具主动性的一种监测
 * 它直接为表单控件(根据 type 的不同) 注册相应的事件处理, 只要发现某个控件值发生改变，就执行回调函数
 */
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
        /**
       * checkbox 和 radio 类型的控件注册 onclick 事件处理
       */
        case 'checkbox': 
        case 'radio':
          element.target = this;
          element.prev_onclick = element.onclick || Prototype.emptyFunction;
        /**
         * 相信这里有改进的空间，应该使用其后的 Event对象提供的注册管理功能来统一注册
         */
          element.onclick = function() {
            this.prev_onclick();
            this.target.onElementEvent();
          }
          break;

        /**
       * 其他类型的控件注册 onchange 事件处理
       */
        case 'password':
        case 'text':
        case 'textarea':
        case 'select-one':
        case 'select-multiple':
          element.target = this;
          element.prev_onchange = element.onchange || Prototype.emptyFunction;
          element.onchange = function() {
            this.prev_onchange();
            this.target.onElementEvent();
          }
          break;
      }
    }   
  }
}

/**
 * 监视指定表单控件
 */
Form.Element.EventObserver = Class.create();
Form.Element.EventObserver.prototype = (new Abstract.EventObserver()).extend({
  getValue: function() {
    return Form.Element.getValue(this.element);
  }
});

/**
 * 监视指定表单所有控件
 */
Form.EventObserver = Class.create();
Form.EventObserver.prototype = (new Abstract.EventObserver()).extend({
  getValue: function() {
    return Form.serialize(this.element);
  }
});


/**
 * 封装事件处理的静态工具对象
 */
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

  /**
   * click事件时鼠标以页面为基准的x坐标值, 考虑到了滚动条导致的位移差
   */
  pointerX: function(event) {
    return event.pageX || (event.clientX +
      (document.documentElement.scrollLeft || document.body.scrollLeft));
  },

  /**
   * click事件时鼠标以页面为基准的y坐标值, 考虑到了滚动条导致的位移差
   */
  pointerY: function(event) {
    return event.pageY || (event.clientY +
      (document.documentElement.scrollTop || document.body.scrollTop));
  },

  /**
   * 停止冒泡(参见 http://www.quirksmode.org/js/events_order.html) 和阻止浏览器执行与事件相关的默认动作
   * 比如
   * <a href="http://www.google.com" onclick="Event.stop(event);">google</a>
   * 那么点击该连接，页面并不会执行转向
   */
  stop: function(event) {
    if (event.preventDefault) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.returnValue = false;
    }
  },

  // find the first node with the given tagName, starting from the
  // node the event was triggered on; traverses the DOM upwards
  /**
   * 找到事件元素的父级元素中，最接近事件元素且等同于指定标签名的父元素。
   * 如果到达顶级元素(HTML)，那么就返回顶级元素
   */
  findElement: function(event, tagName) {
    var element = Event.element(event);
    while (element.parentNode && (!element.tagName ||
        (element.tagName.toUpperCase() != tagName.toUpperCase())))
      element = element.parentNode;
    return element;
  },


  /**
   * 其后的代码封装了事件的注册和反注册，避免ie的内存泄露的bug
   * 参见  http://javascript.weblogsinc.com/entry/1234000267034921/
   */
  observers: false,
 
  /**
   * this.observers 的数据格式是一个二维数组，二维的数组分别四个元素分别是
   * [注册事件对象，事件名，事件处理函数，事件处理模式布尔值]
   */
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
     /**
      * 这里与 Ajax.Request 对象设置 request header 的代码异曲同工
      */
      Event.stopObserving.apply(this, Event.observers[i]);
      Event.observers[i][0] = null;
    }
    Event.observers = false;
  },

  /**
   * 注册对象的事件处理，并记录到cache中
   */
  observe: function(element, name, observer, useCapture) {
    var element = $(element);
    useCapture = useCapture || false;
   
    if (name == 'keypress' &&
        ((navigator.appVersion.indexOf('AppleWebKit') > 0)
        || element.attachEvent))
      name = 'keydown';
   
    this._observeAndCache(element, name, observer, useCapture);
  },

  /**
   * 取消对象已注册的事件处理
   */
  stopObserving: function(element, name, observer, useCapture) {
    var element = $(element);
    useCapture = useCapture || false;
   
    if (name == 'keypress' &&
        ((navigator.appVersion.indexOf('AppleWebKit') > 0)
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
/**
* 页面onload 的时候取消所有事件注册，避免ie内存泄漏的bug
*/
Event.observe(window, 'unload', Event.unloadCache, false);

/**
 * Position 对象也是常用的工具类，提供了获取元素在页面上位置的函数，Drag&Drop的效果一定常会用到
 * 具体的应用参考 script.aculo.us 基于prototype 的实现，尤其是dragdrop.js。
 */
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

  /**
   * 当对象所处的页面有滚动条是，计算位移
   */
  realOffset: function(element) {
    var valueT = 0, valueL = 0;
    do {
      valueT += element.scrollTop  || 0;
      valueL += element.scrollLeft || 0;
      element = element.parentNode;
    } while (element);
    return [valueL, valueT];
  },

  /**
   * 计算出对象在页面上的位置
   */
  cumulativeOffset: function(element) {
    var valueT = 0, valueL = 0;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;
      element = element.offsetParent;
    } while (element);
    return [valueL, valueT];
  },

  // caches x/y coordinate pair to use with overlap
  /**
   * 判断一个坐标是否在指定元素的空间范围中
   * 比如你想判断鼠标点击点的坐标是否在某个层或窗口
   */
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
  /**
   * 调用该方法时，确保首先调用了within方法
   * 如果x,y坐标位于element的空间范围中，那么返回一个小于1的标示位置的值，比如0.5标示该坐标位于element空间的中线上
   */
  overlap: function(mode, element) { 
    if (!mode) return 0; 
    if (mode == 'vertical')
      return ((this.offset[1] + element.offsetHeight) - this.ycomp) /
        element.offsetHeight;
    if (mode == 'horizontal')
      return ((this.offset[0] + element.offsetWidth) - this.xcomp) /
        element.offsetWidth;
  },

  /**
   * 复制源对象的空间数据到目的对象。
   * 常用的地方：拖缀一个层到新地方时，常常动态构造和该层同样大小的虚层。
   */
  clone: function(source, target) {
    source = $(source);
    target = $(target);
    target.style.position = 'absolute';
    var offsets = this.cumulativeOffset(source);
    target.style.top    = offsets[1] + 'px';
    target.style.left   = offsets[0] + 'px';
    target.style.width  = source.offsetWidth + 'px';
    target.style.height = source.offsetHeight + 'px';
  }
}