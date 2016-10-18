import Ember from 'ember';
import ENV from 'sdg-promoter/config/environment';

export default Ember.Component.extend({

  actions: {
    showSettings: function () {
      // console.log('settings');
      this.get('showSettings')();
    }
  },

  tagName: 'li',

  isAuthenticated: Ember.computed.reads('session.isAuthenticated'),

  portal: Ember.computed.reads('session.portal'),

  currentUser: Ember.computed.reads('session.currentUser'),

  displayName: Ember.computed('currentUser', function () {
    let firstName = this.get('currentUser.firstName');
    return firstName || this.get('currentUser.username');
  }),

  profileUrl: Ember.computed('session.orgPortalUrl', function () {
    const portalBaseUrl = this.get('session.orgPortalUrl');
    return `//${portalBaseUrl}/home/user.html`;
  }),

  signoutUrl: Ember.computed('currentUrl', function () {
    let redirectUrl = this.get('currentUrl');
    if (!redirectUrl) {
      redirectUrl = `${location.protocol}//${location.host}${ENV.baseURL}`;
    }
    redirectUrl = encodeURIComponent(redirectUrl);
    let portalBase = ENV.APP.portalBaseUrl.replace(/^http:/gi, 'https:');
    return `${portalBase}/sharing/rest/oauth2/signout?redirect_uri=${redirectUrl}`;
  }),

  thumbnailUrl: Ember.computed('session.orgPortalUrl', 'session.currentUser.thumbnail', function () {
    var result = 'assets/images/no-user-thumb.jpg';
    var thumbnail = this.get('session.currentUser.thumbnail');
    if (thumbnail) {
      result = `//${this.get('session.orgPortalUrl')}/sharing/rest/community/users/${this.get('session.currentUser.username')}/info/${thumbnail}?token=${this.get('session.token')}`;
    }
    return result;
  }),

});