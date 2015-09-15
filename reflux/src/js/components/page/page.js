'use strict';

let React = require('react');
let Reflux = require('reflux');


let Items = require('../products/items');

require('./page.css');

// page data
let pages = {
  pagefood : {
    pageClasses : 'page page--food',
    heading : 'Food'
  },
  pagefashion : {
    pageClasses : 'page page--fashion',
    heading : 'Fashion'
  }
};

let Page = React.createClass({
      render: function() {
        let pageName = this.props.params.pathname.slice(1);
        //console.log(pageName);
        return (
          <div className='container'>
              <div className={pages['page'+pageName].pageClasses}>
                <h1>{pages['page'+pageName].heading}</h1>
                <Items type={pageName} />
              </div>
          </div>
          );
        }
      });

module.exports = Page;
