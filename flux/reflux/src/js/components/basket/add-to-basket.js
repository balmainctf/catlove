
'use strict';

let React = require('react');
let Reflux = require('reflux');

let basketStore = require('../../stores/basket-store');
let actions = require('../../actions/app-actions');

let AddToBasket = React.createClass({

  mixins: [Reflux.connect(basketStore), Reflux.ListenerMixin],

  render: function() {
    let clickHandler = () => {
      actions.addItem(this.props.item);
    };
    return (
      <button onClick={clickHandler} className="addBasket pure-button">
        {this.props.text}
     </button>
    );
  }
});

module.exports = AddToBasket;
