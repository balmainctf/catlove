
let React = require('react');
let Basket = require('../basket/basket.js');

var Header =
  React.createClass({
    render:function(){
      return (
        <div className='container'>
        <div className="pure-g">
          <header className="appHeader pure-u-1">
            <h1>Super fantastic shop</h1>
            <p>A demo shop making use of the incredible powers provided by <a href="http://facebook.github.io/react/" target="_new">react</a>, <a href="https://github.com/rackt/react-router" target="_new">react-router</a> and <a href="https://www.npmjs.com/package/reflux" target="_new">reflux</a>. <a href="https://github.com/stylecoder/react-reflux-super-fantastic-shop-demo" target="_new">View source code here.</a>
            </p>

              { this.props.children }
          </header>
          <div className="fixed-container">
            <div className="container">
              <Basket className="pure-g" />
            </div>
          </div>
          </div>
        </div>
      );
    }
  });
module.exports = Header;
