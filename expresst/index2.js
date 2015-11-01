/**
 * Created by Administrator on 2015/11/1.
 */
var express = require('express');
var app = express();

//读取静态资源
app.use(express.static('static'));

app.listen(3000);