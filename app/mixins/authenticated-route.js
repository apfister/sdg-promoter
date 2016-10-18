import Ember from 'ember';

// based on the authenticated route mixin from torii

export default Ember.Mixin.create({

  beforeModel () {
    const superBefore = this._super.apply(this, arguments);
    if (superBefore && superBefore.then) {
      return superBefore.then(function () {
        return this.authenticate();
      });
    } else {
      return this.authenticate();
    }
  },

  authenticate () {
    const isAuthenticated = this.get('isAuthenticated');
    const hasAttemptedAuth = isAuthenticated !== undefined;

    if (isAuthenticated) {
      if (this.get('isPublic')) {
        return this.notSupported();
      }

      if (!this.get('isEnabled')) {
        return this.notEnabled();
      }

      if (!this.get('isAuthorized')) {
        return this.notAuthorized();
      }

      // all good
      return Ember.RSVP.resolve();
    } else {
      if (hasAttemptedAuth) {
        return this.notAuthenticated();
      } else {
        return this.get('session').fetch()
          .finally(() => { return this.authenticate(); });
      }
    }
  },

  isAuthenticated: Ember.computed.reads('session.isAuthenticated'),

  isPublic: Ember.computed.not('session.portal.portalProperties'),

  isEnabled: Ember.computed.reads('session.portal.portalProperties.openData.enabled'),

  isOrgAdmin: Ember.computed('session.currentUser.role', function () {
    return this.get('session.currentUser.role') === 'org_admin';
  }),

  thumbnailUrl: Ember.computed('session.currentUser', function () {
    if (this.get('session.currentUser.thumbnail') === null) {
      return 'https://www.arcgis.com/sharing/files/no-user-thumb.jpg';
    } else {
      return this.get('session.currentUser.thumbnail');
    }
  }),

  isBetaOrg: Ember.computed('session.portal.id', function(){
    let betaOrgs = ['LjjARY1mkhxulWPq','97KLIFOSt5CxbiRI', 'bkrWlSKcjUDFDtgw', 'VjKJdBIEYrE5kSOl'];
    return this.get('session').isInAnyOrg(betaOrgs);
  }),

  isOpenDataAdmin: Ember.computed('session', function () {
    const session = this.get('session');
    const hasCustomRole = !Ember.isBlank(session.get('currentUser.roleId'));
    const hasOpenDataPrivilege = session.hasPrivilege('opendata:user:openDataAdmin');
    return hasCustomRole && hasOpenDataPrivilege;
  }),

  isAuthorized: Ember.computed('isOrgAdmin', 'isOpenDataAdmin', function () {
    return this.get('isOrgAdmin') || this.get('isOpenDataAdmin');
  }),

  notAuthenticated () {
    this.transitionTo('signin');
  },

  notAuthorized () {
    this.transitionTo('unauthorized');
  },

  notEnabled () {
    this.transitionTo('not-enabled');
  },

  notSupported () {
    this.transitionTo('not-supported');
  }

});