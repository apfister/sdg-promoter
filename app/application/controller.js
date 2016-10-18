import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    showSettings: function () {
      Ember.debug('hi!');
    }
  },
  
  orgName: Ember.computed('session.isAuthenticated', function () {
    return this.get('session.portal.name') ? this.get('session.portal.name') : '';
  }),

  currentAppUrl: Ember.computed('currentPath', function () {
    return location.href;
  })
});
