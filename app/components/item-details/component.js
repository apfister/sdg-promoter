import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['container'],

  scoreGraphicClass: Ember.computed('model.scoring', function () {
    return this.get('model.scoring');
  }),

  currentReceipient: Ember.computed('model.userDetail', function () {
    const userDetail = this.get('model.userDetail');

    if (Ember.isEmpty(userDetail.email)) {
      return 'cbrigham@esri.com';
    } else {
      return userDetail.email;
    }
    
  }),

  didInsertElement() {
    const scoring = this.get('model.scoring');

    this._organizeScoringElements(scoring);
  },

  _organizeScoringElements(scoring) {
    const items = scoring.items;

    let detailsGroup = [];
    let useGroup = [];
    let tagsGroup = [];
    let settingsGroup = [];
    let profileGroup = [];

    items.forEach( (item) => {
      if (item.label === 'Thumbnails' 
          || item.label === 'Title'
          || item.label === 'Summary'
          || item.label === 'Description') {

        detailsGroup.push(item);
      } else if (item.label === 'Credits'
          || item.label === 'Access/Use') {

        useGroup.push(item);
      } else if (item.label === 'Tags') {

        tagsGroup.push(item);
      } else if (item.label === 'Sharing'
          || item.label === 'Layer Count'
          || item.label === 'SSL') {

        settingsGroup.push(item);
      } else if (item.label === 'Profile Name'
          || item.label === 'Profile Description'
          || item.label === 'Profile Thumbnail') {

        profileGroup.push(item);
      }
    });

    Ember.setProperties(this, {
      detailsGroup: detailsGroup,
      useGroup: useGroup,
      tagsGroup: tagsGroup,
      settingsGroup: settingsGroup,
      profileGroup: profileGroup
    });
  },

  actions: {
    
    showNotesModal() {
      $('#exampleModal').modal({});
    }
    
  }
});
