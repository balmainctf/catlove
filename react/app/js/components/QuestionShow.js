/**
 * Created by Administrator on 2015/9/10.
 */
var React = require('react');
var QuestionBody = require('./QuestionBody.js');

var QuestionShow = React.createClass({
    render: function(){
        return (
            <div>
                <QuestionBody />
            </div>
        );
    }
});

module.exports = QuestionShow;