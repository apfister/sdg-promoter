import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['container'],

  scoreGraphicClass: Ember.computed('model.scoring', function () {
    return this.get('model.scoring');
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

  _updateUI(status) {
    // remove all
    this.$('.item-status-dd li a span').removeClass('glyphicon glyphicon-ok');

    // add selected
    this.$(`.item-status-${status.toLowerCase()}`).addClass('glyphicon glyphicon-ok');
  },

  actions: {
    sendSetStatus(status) {
      const itemId = this.get('model.id');

      if (Ember.isEmpty(itemId)) {
        throw new Error('unable to get itemId');
        return;
      }

      const features = [
        {  
          attributes: {
            ITEM_ID: itemId,
            STATUS: status
          }
        }
      ];

      this.get('setItemStatus')(features)
        .then( (response) => {
          if (!Ember.isEmpty(response) 
            && response.addResults[0]
            && response.addResults[0].success) {

            Ember.set(this.get('model'), 'auditDetail.STATUS', status);

            this._updateUI(status);

          }
        })
        .catch( (error) => {
          Ember.debug(`Error setting item status: ${JSON.stringify(error)}`);
        });
    }
  }
});
