/**
 * Created by Administrator on 2015/9/10.
 */
var React = require('react');

module.exports = React.createClass({
    render: function(){
        return (
              <button id="add-question-btn" className="btn btn-success" onClick={this.props.toggle}>添加问题</button>
        );
    }
});