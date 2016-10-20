import Ember from 'ember';

export default Ember.Service.extend({

  groupName: '',

  init() {
    this.set('groupName', '');
  }

});
