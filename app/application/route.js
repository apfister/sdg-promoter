import Ember from 'ember';

export default Ember.Route.extend({

  intl: Ember.inject.service(),

  beforeModel: function () {
    
    const intl = this.get('intl');

    let defaultLocale = 'en-us';

    intl.setLocale(defaultLocale);
    
  },

  actions: {
    
    signin: function () {
      this.transitionTo('signin');
    },

    showSettings: function () {
      console.log('settings');
    }
  }
});
