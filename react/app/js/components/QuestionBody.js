/**
 * Created by Administrator on 2015/9/10.
 */
var React = require('react');
var QuestionAdd = require('./QuestionAdd.js');
var QuestionForm = require('./QuestionForm.js');
var QuestionList = require('./QuestionList.js');

module.exports = React.createClass({
    getInitialState: function(){
        return {
          questionData:{
              key: 1,
              title: '我的战友在前线打仗，而我却还在这儿修改BUG',
              content: '与其当初战死沙场，也不会落得如此下场',
              voteCount: 10
          },
          formDisplayed: false
        };
    },
    toggleClick: function(){
        this.setState({
            formDisplayed: !this.state.formDisplayed
        });
    },
    render: function(){
        return (
            <div>
                <div className="jumbotron text-center">
                    <div className="container">
                        <h1>React问答</h1>
                        <QuestionAdd toggle={this.toggleClick}/>
                    </div>
                </div>
                <div className="main container">
                    <QuestionForm formStyle={this.state.formDisplayed}/>
                    <QuestionList />
                </div>
            </div>
        );
    }
});