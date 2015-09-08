/**
 * Created by Administrator on 2015/9/8.
 */
var React = require('react');
var QuestionApp = require('./components/ShowAddButton.js');

var mainCom = React.render(
	<QuestionApp />,
	document.getElementById('app')
)