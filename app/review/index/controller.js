import Ember from 'ember';
import ENV from 'sdg-promoter/config/environment';
import ajax from 'ic-ajax';

export default Ember.Controller.extend({
  itemsService: Ember.inject.service('items-service'),
  session: Ember.inject.service(),

  queryParams: ['start', 'num', 'q', 'owner', 'tags', 'type'],
  start: 1,
  q: null,
  query: '',
  num: 5,
  owner: null,
  tags: null,
  typeKeywords: null,
  type: null,

  totalCount: Ember.computed('model.total', function () {
    return this.get('model.total');
  }),

  queryChanged: Ember.observer('q', function () {
    this.set('query', this.get('q'));
  }),

  portalItemUrl: Ember.computed('session.portal', function () {
    let cbu = this.get('session.portal.customBaseUrl');
    let urlKey = this.get('session.portal.urlKey');
    return `https://${urlKey}.${cbu}/home/item.html?id=`;
  }),

  actions: {

    updateItemTypeQueryParam(options) {
      if (Ember.isEmpty(options)) {
        Ember.set(this, 'type', null);
      } else {
        Ember.set(this, 'type', options);
      }
    },

    hideAllDetails() {
      this.get('model.results').forEach( (item) => { 
        Ember.set(item, 'showDetails', false); 
      });
    },

    setItemStatus(inFeatures) {
      const auditUrl = ENV.APP.promoter.auditServiceUrl;

      if (!Ember.isEmpty(inFeatures) && !Ember.isEmpty(auditUrl)) {

        const features = JSON.stringify(inFeatures);

        return ajax({
          url: `${auditUrl}/addFeatures`,
          dataType: 'json',
          method: 'POST',
          data: {
            f: 'json',
            features: features,
            token: this.get('session.token')
          }
        });

      } else {
        return Ember.RSVP.resolve({error: 'unable to add to audit service. unable to get status and/or auditUrl'});
      }
    },

    filter () {
      this.set('q', this.get('query'));
      // reset the page
      this.set('start', 1);
      this.transitionToRoute('review.index');
    }

  }
});