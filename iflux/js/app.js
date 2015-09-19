/**
 * Created by Administrator on 2015/9/18.
 */
var React = require('react');
var {msg, mixins,Store} = require('iflux');
var StoreMixin = mixins.StoreMixin;
var appStore = require('./store');

var app = document.getElementById('app');

var FormApp = React.createClass({
    mixins: [StoreMixin(appStore)],
    handleClick: function(e){
        var newName = this.refs.myName.getDOMNode().value;
        msg.emit('setName', newName);
    },
    getDefaultProps() {

    },
    getInitialState: function(){
        return {};

    },
    componentDidMount: function(){

    },
    render: function(){
        var store = appStore.data();
        return (
            <div>
                <input type="text" ref="myName"/>
                <input type="button" value="点击" onClick={this.handleClick}/>
                <div>{store.get('name')}</div>
            </div>
        )
    }

});

React.render(<FormApp />,app);