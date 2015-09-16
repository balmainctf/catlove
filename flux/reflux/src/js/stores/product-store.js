'use strict';

let Reflux = require('reflux');
let request = require('superagent');
let actions = require('../actions/app-actions');

let ProductStore = Reflux.createStore({

  init() {
    this.data = {
      products: {
        food: [],
        fashion: []
      }
    };

    this.listenTo(actions.loadPage, this.loadPage);
  },

  loadPage(productType,cached) {
    if(cached !== true || this.data.products[productType].length === 0) {
      request.get('data/' + productType +'.json')
        .end((err, res) => {
          this.data.products[productType] = JSON.parse(res.text)[0].products;
          this.trigger(this.data);
        });
    } else {
      this.trigger(this.data);
    }
  },

  getInitialState() {
    return this.data;
  }
});

module.exports = ProductStore;
