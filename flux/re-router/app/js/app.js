/**
 * Created by Administrator on 2015/9/18.
 */
var React = require('react');
var Router = require('react-router');
var { Route, DefaultRoute, RouteHandler, Link } = Router;
//主要功能就是让组件能够通过 this.getParams() 或 this.getQuery() 等方法获取到当前路由的各种值或参数
var StateMixin = Router.State;


/**
 * 图书列表组件
 */
var Books = React.createClass({
    mixins: [StateMixin],

    render: function() {
        var id = this.getParams().id;
        return id ? <Book id={id} /> : (
            <div>
                <ul>
                    <li key={1}><Link to="books" params={{id: 1}}>活着</Link></li>
                    <li key={2}><Link to="books" params={{id: 2}}>挪威的森林</Link></li>
                    <li key={3}><Link to="books" params={{id: 3}}>从你的全世界走过</Link></li>
                </ul>
                <RouteHandler />
            </div>
        );
    }
});

/**
 * 单本图书组件
 */
var Book = React.createClass({
    render: function() {
        return (
            <article>
                <h1>这里是图书 id 为 {this.props.id} 的详情介绍</h1>
            </article>
        );
    }
});

/**
 * 电影列表组件
 */
var Movies = React.createClass({

    mixins: [StateMixin],

    render: function() {
        var id = this.getParams().id;
        return id ? <Movie id={id} /> : (
            <div>
                <ul>
                    <li key={1}><Link to="movies" params={{id: 1}}>煎饼侠</Link></li>
                    <li key={2}><Link to="movies" params={{id: 2}}>捉妖记</Link></li>
                    <li key={3}><Link to="movies" params={{id: 3}}>西游记之大圣归来</Link></li>
                </ul>
                <RouteHandler />
            </div>
        );
    }
});

/**
 * 单部电影组件
 */
var Movie = React.createClass({
    render: function() {
        return (
            <article>
                <h1>这里是电影 id 为 {this.props.id} 的详情介绍</h1>
            </article>
        );
    }
});




//Link 组件可以认为是 ReactRouter 提供的对 <a> 标签进行封装的组件，你可以查看 Link 组件渲染到 DOM 上其实就是 a 标签。
// 它接受的 props 有 to、params 和 query。to 可以是一个路由的名称，也可以是一个完整的 http 地址（类似 href 属性）；
// params 和 query 都是这个链接带的参数
//此外，Link 组件还有一个小特点，就是如果这个 Link 组件指向的路由被激活的话，
// 组件会自动添加一个值为 active 的 className，方便你对当前激活的菜单项设置不同的样式


//RouteHandler 组件是 ReactRouter 的核心组件之一，它代表着当前路由匹配到的 React 组件。假设当前的路由为 /books，
// 那么 App 这个组件里的 RouteHandler 其实就是 Books 组件。

//应用入口
var App = React.createClass({

    render: function(){
        return (
            <div className="app">
                <nav>
                    <a href="#">
                        <Link to="movies">电影</Link>
                    </a>
                    <a href="#">
                        <Link to="books">图书</Link>
                    </a>
                </nav>
                <section>
                    <RouteHandler />
                </section>
            </div>
        );
    }
});


//定义路由页面
//另外一个 ReactRouter 提供的组件 Route，这个组件就是定义整个页面路由的基础，可以嵌套。
//Route 接受的 props 包括 name、path、handler 等等。
// 其中 name 就是上文提到的路由名称，可以通过 <Link to="路由的名称"> 来生成一个跳转到该路由的链接。
// path 指明的是当前路由对应的 url，如果不指定，那么默认就是 name 对应的值；
// 如果 name 也不指定，那默认是 /，即根目录。另外 path 还支持指定 params（上文有提到），就是上面的例子中 : 及后面跟着的名称。

//params 和 query 的区别在于，params 定义的是「路由」中的参数，比如 /movies/:id ，params 为 id；
// 而 query 是 「URL」中的参数，是跟在 URL 中「?」后面的。定义路由时一般不考虑也不能限制 query 会是什么。

//比如 <Route name="movies" handler={Movie} /> 就指明了一条指向 /movies 的路由，当该路由激活时，调用 Movies 这个组件进行渲染。

//routes 中定义的路由，多了一个 DefaultRoute，它的 handler 是 Index 组件，即我们希望用户在默认打开页面时看到的组件内容。
//<DefaultRoute handler={Index} />
//想用户进来默认就看到电影列表，则可以使用 Redirect 组件<Redirect to="movies" />

//可以看到，当我们直接访问这个 URL 的时候，自动被重定向到了 /movies。
// Redirect 同时接受 from 这个 props，可以指定当什么规则下才进行重定向。

var routes = (
    <Route handler={App}>
        <Route name="movies" path="/movies/:id?" handler={Movies} />
        <Route name="books" path="/books/:id?" handler={Books} />
        <DefaultRoute handler={Movies} />
    </Route>
);


//渲染到DOM
//Router 即 ReactRouter，run 方法接受 2 - 3个参数，其中第一个参数必填，即我们指定的路由规则。
// 第二个参数选填，即路由的实现方式，Router.HashLocation 指明了当前页面使用 hash 变化来实现路由，
// 反映在浏览器的地址栏中就是类似 xxx.com/#/movies 这样的地址。
// 使用这种 Location 的好处是兼容 IE 8，如果你的应用不需要兼容 IE 8，可以使用更高级的 Router.HistoryLocation

//最后一个参数是一个回调函数，函数的第一个参数是 ReactRouter 判断出的当前路由中需要渲染的根节点组件，
// 在这里就是 <App /> 这个组件（虽然名字叫做 Root，但在本例中 Root 指的就是 App）

Router.run(routes, Router.HashLocation, function(Root){
    React.render(<Root />, document.getElementById('app'));
});

