/**
 * Created by Administrator on 2015/9/18.
 */
var Immutable = require('immutable');
var React = require('react');
var {msg, mixins,Store} = require('iflux');
var WebApi = require('./webapi.js');

var appStore = module.exports = Store({
    name:'点击前，后台获取'
});

msg.on('setName',(data) => {
    console.log(data);
}).on('refresh',() => {
    WebApi.getName(data).done(data => {
        appStore.cursor().withMutations(cursor => {
            cursor.update("name", () => Immutable.fromJS(data));
        });
    });
});