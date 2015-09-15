
'use strict';

let React = require('react');
let Router = require('react-router');
let { Route, DefaultRoute, RouteHandler, Link } = Router;

var Nav = React.createClass({

  render: function() {

    return (
      <nav className='appNav'>
          <ul className='appNav-list'>
            <li className='appNav-listItem'><Link className='appBtn' to='food' >Food</Link></li>
            <li className='appNav-listItem'><Link className='appBtn' to='fashion' >Fashion</Link></li>
          </ul>
      </nav>
    );
  }

});

module.exports = Nav;
