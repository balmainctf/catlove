'use strict';

require('./item.css');

let React = require('react');
let Reflux = require('reflux');

let basketStore = require('../../stores/basket-store');
let actions = require('../../actions/app-actions');

let AddToBasket = require('../basket/add-to-basket.js');
let RemoveFromBasket = require('../basket/remove-from-basket.js');

let Item = React.createClass({
  mixins: [Reflux.connect(basketStore),Reflux.ListenerMixin],

  isInBasket() {
    return basketStore.isInBasket(this.props.item);
  },

  getBasketQty() {
    return basketStore.getBasketQty(this.props.item);
  },

  onStatusChange: function(productType) {
    if (typeof productType === "string") {
      //console.log('current productType', productType);
    }
    this.setState({inBasket : this.isInBasket()});
    this.setState({inBasketQty : this.getBasketQty()});
  },

  componentDidMount: function() {
    this.setState({inBasket : this.isInBasket()});
    this.setState({inBasketQty : this.getBasketQty()});
    this.listenTo(actions.pageChange, this.onStatusChange);
    this.listenTo(actions.addItem, this.onStatusChange);
    this.listenTo(actions.removeItem, this.onStatusChange);
  },

  getBasketControls() {
    let controls = <AddToBasket text="Add to basket" item={this.props.item} />;
    if (this.state.inBasket) {
      controls = (<div><AddToBasket text="+" item={this.props.item} /> <RemoveFromBasket item={this.props.item} /></div>);
    }
    return controls;
  },

  componentDidEnter() {
    console.log('componentWillEnter');
  },


  componentWillEnter() {
    console.log('componentWillEnter');
  },

  render: function() {
    let statusClassName = this.state.inBasket ? 'is-inBasket ' : '',
        itemStyle = {
          transitionDelay: this.props.index * 0.25 + 's'
        };
    return (
      <li style={itemStyle} className='pure-u-1 pure-u-md-1-3 pure-u-lg-1-4' >
        <div className={"appItem appItem--"+ statusClassName}>
          <h4 className="appItem-title truncate">{this.props.item.name}</h4>

          <img className={'img-responsive appItem-img'} src={this.props.item.image} alt="" />
          <div className="appItem-price">£ {this.props.item.price}.00</div>
          <div className="appItem-qty">x { this.props.item.qty }</div>
          <div className="basketControls">
            {this.getBasketControls()}
          </div>
        </div>
      </li>
    );
    //
  }
});

module.exports = Item;
