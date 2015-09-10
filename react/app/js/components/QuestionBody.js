/**
 * Created by Administrator on 2015/9/10.
 */
var React = require('react');
var QuestionForm = require('./QuestionForm.js');
var QuestionList = require('./QuestionList.js');

module.exports = React.createClass({
    render: function(){
        return (
            <div className="main container">
                <QuestionForm />
                <QuestionList />
            </div>
        );
    }
});