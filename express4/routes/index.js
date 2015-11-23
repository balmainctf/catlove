//var express = require('express');
//var router = express.Router();
//
///* GET home page. */
//router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
//});
//
//module.exports = router;

var express = require('express');
var model = require('./model.js');
var Demo = model.Demo;


exports.index = function(req, res){
  //查询所有数据，保存到demos中，在页面循环输出
  Demo.find(function(err,docs){
    console.log(docs);
    res.render('index', {
      title:'Express Demo Example',
      demos:docs
    });
  });

};


//跳转到添加页面
exports.add = function(req, res) {
  console.log('----here');
  res.render('add', {title :'添加 demo list'});
};

//添加操作
//创建新纪录
exports.create = function(req, res){
  console.log(req.body);

  var demo = new Demo({
    uid : req.body.uid,
    title: req.body.title,
    content : req.body.content
  });

  console.log('create----');
  demo.save(function(err,doc){
    console.log(doc);
    res.send({"status": "success",'uid':req.body.title, "title": req.body.title,'content':req.body.content});
  });

};

exports.delById = function(req,res){

};







