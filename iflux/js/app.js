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
    componentDidMount: function(){
        msg.emit('getName');
    },
    render: function(){
        var store = this.state;
        return (
            <div>
                <input type="text" ref="myName"/>
                <input type="button" value="点击" onClick={this.handleClick}/>
                <div>{store.getIn(['json','result','name'])}</div>

                <div>{store.getIn(['json','result','age'])}</div>

                <div>{store.getIn(['json','result','list'])}</div>

            </div>
        )
    }

});

React.render(<FormApp />,app);