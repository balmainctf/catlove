/**
 * Created by Administrator on 2015/9/10.
 */
var React = require('react');

module.exports = React.createClass({
    upClick: function(e){
        e.preventDefault();
        var newCount = parseInt(this.props.voteCount,10) + 1;
        this.props.voteClick(this.props.keyId,newCount);
    },
    downClick: function(e){
        e.preventDefault();
        var newCount = parseInt(this.props.voteCount,10) - 1;
        this.props.voteClick(this.props.keyId,newCount);
    },
    render: function(){
        return (
            <div className="media">
                <div className="media-left">
                    <button className="btn btn-default" onClick={this.upClick}>
                        <span className="glyphicon glyphicon-chevron-up"></span>
                        <span className="vote-count">{this.props.voteCount}</span>
                    </button>
                    <button className="btn btn-default" onClick={this.downClick}>
                        <span className="glyphicon glyphicon-chevron-down"></span>
                    </button>
                </div>
                <div className="media-body">
                    <h4 className="media-heading">{this.props.title}</h4>
                    <p>{this.props.content}</p>
                </div>
            </div>

        );
    }
});