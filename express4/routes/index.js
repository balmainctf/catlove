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
/**
 * 删除一条记录
 * @param req
 * @param res
 */
exports.delById = function(req,res){
    console.log(req.body);
    var id = req.body.id;
    if(id && id!=''){
        Demo.findByIdAndRemove(id, function(err, docs) {
          console.log('delete-----'+ docs);
          res.send({"status": "success",'uid':req.body.id});
        });
    }

};

/**
 * 跳转到更新页面
 * @param req
 * @param res
 */
exports.upd = function(req,res){

    //获取路径值
    console.log(req.params);
    var id = req.params.id;

    if(id && id!=''){
        Demo.findById(id, function(err, docs) {
          console.log('findById-----'+ docs);
          res.render('update',
              {title :'添加 demo list',demo:docs}
          );
        });
    }

};

/**
 * 更新数据
 */
exports.update = function(req,res){

    var id = req.body._id;

    var demo = new Demo({
        _id:id,
        uid : req.body.uid,
        title: req.body.title,
        content : req.body.content
    });

    if(id && '' != id) {
        console.log('----update id = ' + id + "," + demo);
        Demo.findByIdAndUpdate(id, demo,function(err, docs) {
            console.log('update-----'+ docs);
            res.send({"status": "success",'uid':req.body.title, "title": req.body.title,'content':req.body.content});
        });
    }

};








