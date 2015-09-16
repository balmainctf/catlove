
'use strict';

let React = require('react');
let Reflux = require('reflux');

let basketStore = require('../../stores/basket-store');
let actions = require('../../actions/app-actions');

let RemoveFromBasket = React.createClass({
  mixins: [Reflux.connect(basketStore), Reflux.ListenerMixin],

  render: function() {
    var clickHandler = actions.removeItem.bind(this, this.props.item);
    return (
      <button onClick={clickHandler} className="pure-button removeBasket">-</button>
    );
  }
});

module.exports = RemoveFromBasket;
