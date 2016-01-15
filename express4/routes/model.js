/**
 * routes文件夹相当于controller
 * Created by soraping on 15/11/10.
 */
var mongoose = require('../models/mongodb.js');
// Schema 结构
var Schema = mongoose.mongodb.Schema;

var demoSchema = new Schema({
    uid : String,
    title:String,
    content:String,
    createTime : { type: Date, default: Date.now }
});


exports.Demo = mongoose.mongodb.model('movie',demoSchema);

