/**
 * Created by Administrator on 2015/11/1.
 */
var express = require('express');

var app = express();

app.use(express.static('static'));

app.post('/login',function(req,res){
    console.log(req.params);
});

app.listen('3000');