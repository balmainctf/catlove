/**
 * Created by Administrator on 2015/9/10.
 */
var React = require('react');
var QuestionItem = require('./QuestionItem.js');

module.exports = React.createClass({
    render: function(){
        var questionData = this.props.questionData;
        var voteClick = this.props.voteClick;
        var questionHtml = questionData.map(function(ques){
            return <QuestionItem keyId={ques.key} voteCount={ques.voteCount}  voteClick={voteClick} title={ques.title} content={ques.content}/>
        }.bind(this));
        return (
            <div id="questions" className="">
                {questionHtml}
            </div>
        );
    }
});