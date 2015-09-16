/**
 * Created by Administrator on 2015/9/10.
 */
var React = require('react');
var _ = require('lodash');
var QuestionAdd = require('./QuestionAdd.js');
var QuestionForm = require('./QuestionForm.js');
var QuestionList = require('./QuestionList.js');

module.exports = React.createClass({
    getInitialState: function(){
        return {
          questionData:[],
          formDisplayed: false
        };
    },
    componentDidMount: function(){
        $.ajax({
            url:'/data.json?'+ ( new Date()).getTime().toString(),
            type:'get',
            dataType: "json",
            success:function(data){
                console.log(data);
                var result = data.return;
                this.setState({
                    questionData: result
                });
            }.bind(this),
            error: function(e){
                console.log(e);
            }
        });
    },
    addQuestionForm: function(newQuestionData){
        newQuestionData.key = this.state.questionData.length + 1;
        var data = this.state.questionData.concat(newQuestionData);
        data = this.sortData(data);
        this.setState({
            questionData: data
        });
    },
    sortData: function(data){
        data.sort(function(a,b){
            return b.voteCount - a.voteCount;
        });
        return data;
    },
    onVoteClick: function(key,newCount){
        //数组去重
        var questions = _.uniq(this.state.questionData);
        //查询元素序号，遍历数组，如果查询到了符合要求的第一个元素则返回序号，如果没查询到符合要求的元素则返回-1
        var index = _.findIndex( questions, function(qst){
            return qst.key == key;
        } )
        questions[index].voteCount = newCount;

        questions = this.sortData(questions);

        this.setState({
            questionData: questions
        });
    },
    toggleClick: function(e){
        e.preventDefault();
        this.setState({
            formDisplayed: !this.state.formDisplayed
        });
    },
    render: function(){
        var questionData = this.sortData(this.state.questionData);
        return (
            <div>
                <div className="jumbotron text-center">
                    <div className="container">
                        <h1>React问答</h1>
                        <QuestionAdd toggle={this.toggleClick}/>
                    </div>
                </div>
                <div className="main container">
                    <QuestionForm formStyle={this.state.formDisplayed} toggle={this.toggleClick} addQuestionForm={this.addQuestionForm}/>
                    <QuestionList questionData={questionData}  voteClick={this.onVoteClick}/>
                </div>
            </div>
        );
    }
});