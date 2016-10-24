import Ember from 'ember';

export default Ember.Controller.extend({
  
  appState: Ember.inject.service(),

  actions: {
  
    showSettings() {
      console.log('showSettings modal goes here');
    }
  }

});
