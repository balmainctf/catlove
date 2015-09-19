/**
 * Created by Administrator on 2015/9/18.
 */
var Immutable = require('immutable');
var React = require('react');
var {msg, mixins,Store} = require('iflux');
var WebApi = require('./webapi.js');

var appStore = module.exports = Store({
    name:''
});

msg.on('getName',() => {
    WebApi.getName().done((data) => {
        console.log(data);
        appStore.cursor().withMutations(cursor => {
            cursor.update('name', () => Immutable.fromJS(data));
        });
    });
}).on('setName',(data) => {
    console.log(data);
    WebApi.setName(data).done(e => {
        console.log(e);
        appStore.cursor().withMutations(cursor => {
            cursor.update('name', () => Immutable.fromJS(e));
        });
    });
});