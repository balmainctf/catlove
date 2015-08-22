/**
 * Created by Administrator on 2015/8/21.
 */
//引入建模模块
var mongoose = require('mongoose');
//模式
var MovieSchema = require('../schemas/movie.js');
//实例化模型
var Movie = mongoose.model('Movie',MovieSchema);

//导出模型
module.exports = Movie;