import Ember from 'ember';

export default Ember.Route.extend({

  actions: {
    didTransition: function () {

      Ember.run.schedule('afterRender', this, function () {
        this.get('session').open('arcgis-oauth-bearer')
          .then((authorization) => {
            Ember.debug('AUTH SUCCESS: ', authorization);

            this.controller.transitionToRoute('groups.index');
          })
          .catch((err) => {
            Ember.debug('AUTH ERROR: ', JSON.stringify(err));
          })
      });

    }
  }
});
