import Ember from 'ember';

export default Ember.Service.extend({

  items: {},

  init() {

  },

  getItem(itemId) {
    const cache = this.get('items');

    return cache[itemId];
  },

  add(itemId, data) {
    const cache = this.get('items');

    if (Ember.isEmpty(cache[itemId])) {
      cache[itemId] = data;
    }
  }

});
