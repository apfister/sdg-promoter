import Ember from 'ember';

export default Ember.Service.extend({

  users: {},

  init() {

  },

  getUser(userOwner) {
    const cache = this.get('users');

    return cache[userOwner];
  },

  add(userOwner, data) {
    const cache = this.get('users');

    if (Ember.isEmpty(cache[userOwner])) {
      cache[userOwner] = data;
    }
  }

});
