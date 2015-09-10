/**
 * Created by Administrator on 2015/9/10.
 */
var React = require('react');

module.exports = React.createClass({
    render: function(){
        return (
            <div className="media-left">
                <button className="btn btn-default">
                    <span className="glyphicon glyphicon-chevron-up"></span>
                    <span className="vote-count">22</span>
                </button>
                <button className="btn btn-default">
                    <span className="glyphicon glyphicon-chevron-down"></span>
                </button>
            </div>
        );
    }
});