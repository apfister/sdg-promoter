import Ember from 'ember';

export default Ember.Component.extend({
  
  intl: Ember.inject.service(),

  itemsService: Ember.inject.service(),

  itemCacheService: Ember.inject.service(),

  userCacheService: Ember.inject.service(),
  
  userService: Ember.inject.service(),

  arcgisValidatorConfig: Ember.inject.service(),

  arcgisValidatorEngine: Ember.inject.service(),

  _iconTypeURLs: {
    'Web Mapping Application': '//js.arcgis.com/3.18/esri/css/images/item_type_icons/apps16.png',
    'Web Map': '//js.arcgis.com/3.18/esri/css/images/item_type_icons/maps16.png',
    'Feature Service': '//js.arcgis.com/3.18/esri/css/images/item_type_icons/featureshosted16.png',
    'Map Service': '//js.arcgis.com/3.18/esri/css/images/item_type_icons/mapimages16.png',
    'Vector Tile Service': '//js.arcgis.com/3.18/esri/css/images/item_type_icons/vectortile16.png',
    'Image Service': '//js.arcgis.com/3.18/esri/css/images/item_type_icons/imagery16.png',
    'Web Scene': '//js.arcgis.com/3.18/esri/css/images/item_type_icons/websceneglobal16.png',
    'CSV': '//js.arcgis.com/3.18/esri/css/images/item_type_icons/datafiles16.png',
    'Code Attachment': '//js.arcgis.com/3.18/esri/css/images/item_type_icons/datafiles16.png',
    'PDF' : '//js.arcgis.com/3.18/esri/css/images/item_type_icons/datafilesgray16.png'
  },

  thumbnailUrl: Ember.computed('model.id', 'model.thumbnail', function () {
    if (!window.location.origin) {
      window.location.origin = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
    }

    let url = window.location.origin + window.location.pathname;
    
    const itemThumbnail = this.get('model.thumbnail');

    if (!Ember.isNone(itemThumbnail)) {
      const token = this.get('session.token');
      const itemId = this.get('model.id');
      
      url = `https://www.arcgis.com/sharing/rest/content/items/${itemId}/info/${itemThumbnail}?token=${token}`;

    } else {
      url = 'assets/images/nullThumbnail.png';
    }

    return url;
  }),

  itemTypeIconUrl: Ember.computed('model.type', function () {
    const iconType = this.get('model.type');

    return this._iconTypeURLs[iconType];
  }),

  sharing: Ember.computed('model.access', function () {
    return this.get('model.access') === 'public' ? 'Public' : 'Not Shared';
  }),

  lastModified: Ember.computed('model.modified', function () {
    const dte = new Date(this.get('model.modified'));

    return this.get('intl').formatDate(dte, {month: 'short', day: '2-digit', year: 'numeric'});
  }),

  itemScoreClass: Ember.computed('model.scoring.totalScore', function () {
    const score = this.get('model.scoring.totalScore');

    let scoreClass = 'text-muted';
    
    if (score <= 10) {
      scoreClass = 'text-danger';
    } else if (score > 10 && score <= 35) {
      scoreClass = 'text-warning';
    } else if (score >= 80) {
      scoreClass = 'text-success';
    }
    return scoreClass;
  }),

  currentItemStatusClass: Ember.computed('model.auditDetail.STATUS', function () {
    const status = this.get('model.auditDetail.STATUS') || 'Not Reviewed';

    switch (status) {
      case 'Rejected':
        return 'text-muted';
        break;
      case 'Reviewing':
        return 'text-info';
        break;
      case 'Accepted':
        return 'text-success';
        break;
      case 'Pending':
        return 'text-primary';
        break;
      default:
        return '';
    }
  }),

  currentItemStatus: Ember.computed('model.auditDetail.STATUS', function() {
    const status = this.get('model.auditDetail.STATUS') || 'Not Reviewed';
    return status.toUpperCase();
  }),

  scoring: {}, 

  didInsertElement() {

    const itemCacheService = this.get('itemCacheService');

    const userCacheService = this.get('userCacheService');

    const itemType = this.get('model.type');

    if (Ember.isEmpty(this.get('model.url'))) {
      this.set('model.url', this.get('itemsService').getItemPageUrl(this.get('model.id')));
    }

    const arcgisValidatorConfig = this.get('arcgisValidatorConfig');

    if ( itemType === arcgisValidatorConfig.supportedTypes.WEB_MAP ||
        itemType === arcgisValidatorConfig.supportedTypes.WEB_MAPPING_APPLICATION ||
        itemType === arcgisValidatorConfig.supportedTypes.FEATURE_SERVICE ||
        itemType === arcgisValidatorConfig.supportedTypes.FEATURE_COLLECTION ||
        itemType === arcgisValidatorConfig.supportedTypes.IMAGE_SERVICE ||
        itemType === arcgisValidatorConfig.supportedTypes.MAP_SERVICE ||
        itemType === arcgisValidatorConfig.supportedTypes.WEB_SCENE ||
        itemType === arcgisValidatorConfig.supportedTypes.CSV ||
        itemType === arcgisValidatorConfig.supportedTypes.PDF ) {

        const itemId = this.get('model.id');

        let itemData = itemCacheService.getItem(itemId);
        
        let shouldAddItemToCache = false;
        let shouldAddUserToCache = false;

        let promises = {};

        if (Ember.isEmpty(itemData)) {
          const itemsService = this.get('itemsService');

          promises.itemData = itemsService.getDataById(itemId);

          shouldAddItemToCache = true;

        } else {
          promises.itemData = Ember.RSVP.Promise.resolve(itemData, itemId);
        }

        const userOwner = this.get('model.owner');

        let userDetail = userCacheService.getUser(userOwner);

        if (Ember.isEmpty(userDetail)) {
          const userService = this.get('userService');

          promises.userDetail = userService.getByName(userOwner);

          shouldAddUserToCache = true;

        } else {
          promises.userDetail = Ember.RSVP.Promise.resolve(userDetail, userOwner);
        }

        Ember.RSVP.hashSettled(promises)
          .then( (hash) => {

            // console.log(hash);

            if (hash.itemData.state === 'rejected') {
              this.set('model.data', '');
            } else if (hash.itemData.state === 'fulfilled') {
              this.set('model.data', hash.itemData.value);

              if (shouldAddItemToCache) {
                itemCacheService.add(itemId, hash.itemData.value);
              }

            }

            if (hash.userDetail.state === 'rejected') {
              this.set('model.userDetail', {});
            } else if (hash.userDetail.state === 'fulfilled') {
              this.set('model.userDetail', hash.userDetail.value);

              if (shouldAddUserToCache) {
                userCacheService.add(userOwner, hash.userDetail.value);
              }

            }            

            this._scoreItem();

            this._setClickHandler();

          }, (error) => {
            throw new Error(`error collecting userDetail and itemData: ${error.message}`);
          });
    }
  },

  _scoreItem() {

    if (this.get('isDestroyed') || this.get('isDestroying')) {
      Ember.debug('attempting to score a destroyed model/item so we are bailing! figure this out!');
      return;
    }

    // this.set('model.scoring', {});

    const arcgisValidatorEngine = this.get('arcgisValidatorEngine');

    const validatedItem = arcgisValidatorEngine.validateItem(this.get('model'));

    const scoring = validatedItem.scoring;

    Ember.set(this, 'model.scoring', scoring);

  },

  _setClickHandler() {
    this.$('.item-thumbnail, .item-title').on('click', this.showDetailsHandler.bind(this));
  },

  showDetailsHandler() {

    // are the details showing? stash it.
    const isShowing = this.get('model.showDetails');

    // hide everybody!
    this.get('hideAllDetails')();

    // toggle the state for the item that was clicked
    this.set('model.showDetails', !isShowing);
   
  },

  willDestroyElement() {
    this._super(...arguments);

    this.$('.item-thumbnail, .item-title').off('click');
  }

});