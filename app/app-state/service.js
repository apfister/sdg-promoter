import Ember from 'ember';

export default Ember.Service.extend({

  groupName: '',
  gridStore: null,
  grid: null,

  init() {
    this.set('groupName', '');
    this.set('gridStore', null);
    this.set('grid', null);
  }

});
