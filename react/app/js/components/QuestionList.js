/**
 * Created by Administrator on 2015/9/10.
 */
var React = require('react');
var QuestionItem = require('./QuestionItem.js');

module.exports = React.createClass({
    render: function(){
        return (
            <div id="questions" className="">
                <div className="media">
                    <QuestionItem />
                    <div className="media-body">
                        <h4 className="media-heading">产品经理与程序员矛盾的本质是什么？</h4>
                        <p>理性探讨，请勿撕逼。产品经理的主要工作职责是产品设计。接受来自其他部门的需求，经过设计后交付研发。但这里有好些职责不清楚的地方。</p>
                    </div>
                </div>
            </div>
        );
    }
});