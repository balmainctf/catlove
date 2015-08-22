/**
 * Created by Administrator on 2015/8/21.
 */
//引入建模模块
var mongoose = require('mongoose');

//在这个地方定义字段类型
var MovieSchema = new mongoose.Schema({
    doctor: String,
    title: String,
    language: String,
    country: String,
    summary: String,
    flash: String,
    poster: String,
    year: String,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

//每次存储都会调用此方法
MovieSchema.pre('save',function(next){
    //如果是新加的数据，则将创建时间和更新时间设置为当前时间
    if(this.isNew){
        this.meta.createAt = Date.now();
        this.meta.updateAt = Date.now();
    }else{
        this.updateAt = Date.now();
    }

    next();
});

//静态方法在Model层就能使用
MovieSchema.statics = {
    //取出数据库中所有的数据
    fetch: function(cb){
        return this
            .find({})
            .sort('meta.updateAt')
            //执行回调
            exec(cb)
    },
    findById: function(id,cb){
        return this
            .findOne({_id: id})
            exec(cb)
    }
};

//将模式导出
module.exports = MoviesSchema;