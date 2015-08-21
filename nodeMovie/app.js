/**
 * Created by Administrator on 2015/8/20.
 * 入口文件
 */
var express = require('express');
var path = require('path');
//命令行获取或默认设置
var port = process.env.PORT || 3000;
var app = express();

//设置模版路径
app.set('views','./views/pages');
//模版引擎
app.set('view engine','jade');
//表单数据格式化
//app.use(express.bodyParser());
//静态资源的获取
app.use(express.static(path.join(__dirname,'bower_components')));
//端口监听
app.listen(port);
//app.set('port',port);
console.log('app start on port' + port);

//express路由设置
//get 方式
//第一个参数是路由名(在url上显示)，，第二个是callback
app.get('/',function(req,res){
    res.render('index',{
        title:'首页'
    });
});

app.get('/movie/:id',function(req,res){
    res.render('detail',{
        title:'详情页'
    });
});

app.get('/admin/movie',function(req,res){
    res.render('admin',{
        title:'后台首页'
    });
});

app.get('/admin/list',function(req,res){
    res.render('list',{
        title:'列表页'
    });
});