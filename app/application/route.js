import Ember from 'ember';

export default Ember.Route.extend({

  intl: Ember.inject.service(),

  beforeModel() {
    
    const intl = this.get('intl');

    let defaultLocale = 'en-us';

    intl.setLocale(defaultLocale);
  },

  actions: {
    signin() {
      this.transitionTo('signin');
    }
  }
});
