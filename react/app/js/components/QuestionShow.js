/**
 * Created by Administrator on 2015/9/10.
 */
var React = require('react');
var QuestionAdd = require('./QuestionAdd.js');
var QuestionBody = require('./QuestionBody.js');

var QuestionShow = React.createClass({
    render: function(){
        return (
            <div>
                <QuestionAdd />
                <QuestionBody />
            </div>
        );
    }
});

module.exports = QuestionShow;