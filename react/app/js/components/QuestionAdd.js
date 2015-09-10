/**
 * Created by Administrator on 2015/9/10.
 */
var React = require('react');

module.exports = React.createClass({
    render: function(){
        return (
            <div className="jumbotron text-center">
                <div className="container">
                    <h1>React问答</h1>
                    <button id="add-question-btn" className="btn btn-success">添加问题</button>
                </div>
            </div>
        );
    }
});