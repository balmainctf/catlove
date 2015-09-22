/**
 * Created by Administrator on 2015/9/18.
 */
var Immutable = require('immutable');
var React = require('react');
var {msg, mixins,Store} = require('iflux');
var WebApi = require('./webapi.js');

var appStore = module.exports = Store({
    json:{}
});

msg.on('getName',() => {
    //WebApi.getName().done((data) => {
    //    //appStore.cursor().withMutations(cursor => {
    //    //    cursor.update('json', () => Immutable.fromJS(data));
    //    //
    //    //});
    //    appStore.cursor().update('json', () => Immutable.fromJS(data));
    //});
    WebApi.getName().then(function(data){
        appStore.cursor().update('json', () => Immutable.fromJS(data));
    }).catch(function(e){
        console.log(e);
    });
}).on('setName',(data) => {
    WebApi.setName(data).done(e => {
        //appStore.cursor().withMutations(cursor => {
        //    cursor.update('json', () => Immutable.fromJS(e));
        //});
        appStore.cursor().update('json', () => Immutable.fromJS(e));
    });
});