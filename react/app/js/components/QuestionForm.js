/**
 * Created by Administrator on 2015/9/10.
 */
var React = require('react');

module.exports = React.createClass({
    submitData: function(e){
        e.preventDefault();
        if(!this.refs.addTitle.getDOMNode().value) return;
        
        var formData = {
            title: this.refs.addTitle.getDOMNode().value,
            content: this.refs.addContent.getDOMNode().value,
            voteCount: 0
        };
        //console.log(formData);
        
        this.props.addQuestionForm(formData);

        this.refs.addQuestion.getDOMNode().reset();
        
    },
    render: function(){
        var styleObj = {
            display: this.props.formStyle?'block':'none'
        }
        return (
            <form ref="addQuestion" name="addQuestion" className="clearfix" style={styleObj}>
                <div className="form-group">
                    <label htmlFor="qtitle">问题</label>
                    <input type="text" ref="addTitle" className="form-control" id="qtitle" placeholder="您的问题的标题" />
                </div>
                <textarea className="form-control" ref="addContent" rows="3" placeholder="问题的描述"></textarea>
                <button className="btn btn-success pull-right" onClick={this.submitData}>确认</button>
                <button className="btn btn-default pull-right" onClick={this.props.toggle}>取消</button>
            </form>
        );
    }
});