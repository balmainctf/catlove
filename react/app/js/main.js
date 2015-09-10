/**
 * Created by Administrator on 2015/9/8.
 */
var React = require('react');

var QuestionShow = require('./components/QuestionShow.js');

var ShowBody = React.createClass({
    render: function(){
        return (
            <QuestionShow />
        )
    }
});

var myReact = React.render(<ShowBody />,document.getElementById('app'));