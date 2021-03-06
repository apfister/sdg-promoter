import Ember from 'ember';
import ENV from 'sdg-promoter/config/environment';

export default Ember.Controller.extend({
  itemsService: Ember.inject.service('items-service'),
  session: Ember.inject.service(),

  queryParams: ['start', 'num', 'q', 'owner', 'tags'],
  start: 1,
  q: null,
  query: '',
  num: 10,
  owner: null,
  tags: null,

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

  itemThumbnail: Ember.computed('', function () {
    
  }),

  actions: {

    hideAllDetails() {
      this.get('model.results').forEach( (item) => { 
        Ember.set(item, 'showDetails', false); 
      });
    },

    filter () {
      this.set('q', this.get('query'));
      // reset the page
      this.set('start', 1);
      this.transitionToRoute('groups.index');
    }

  }
});