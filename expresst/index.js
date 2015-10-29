/**
 * express
 * Created by soraping on 15/10/29.
 */
var express = require('express');

var app = express();

var port = process.env.PORT || 3000;

//get请求
app.get('/',(req,res)=>{
    res.send('hello world');
});

//post
app.get('/home',(req,res)=>{
    res.send('get 请求');
});

//命令行输入 PORT=1234 node index.js,监听1234端口
app.listen(port);
//app.set('port',port);
console.log('app start on port ' + port);