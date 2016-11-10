import Ember from 'ember';
import ENV from 'sdg-promoter/config/environment';

export default Ember.Route.extend({
  itemsService: Ember.inject.service('items-service'),
  
  groupsService: Ember.inject.service('groups-service'),

  auditLogService: Ember.inject.service(),

  appState: Ember.inject.service(),

  queryParams: {
    'start': {refreshModel: true},
    'num': {refreshModel: true},
    'q': {refreshModel: true},
    'owner': {refreshModel: true},
    'tags': {refreshModel: true},
    'typeKeywords': {refreshModel: true},
    'type': {refreshModel: true}
  },

  lastAgoQuery: '',

  createAgoQuery: function (query, owner, tags, type, typeKeywords, groupId) {
    console.log(`Query ${query} owner ${owner} tags ${tags} type ${type} typeKeywords ${typeKeywords}`);
    let parts = [];
    if (query) {
      parts.push(query);
    }

    if (owner) {
      parts.push('owner:' + owner);
    }

    if (tags) {
      if (tags.indexOf(',')) {
        let ta = tags.split(',');
        ta.map(function (t) {
          parts.push('tags:' + t);
        });
      } else {
        parts.push('tags:' + tags);
      }
    }

    if (typeKeywords) {
      if (typeKeywords.indexOf(',')) {
        let ta = typeKeywords.split(',');
        ta.map(function (t) {
          parts.push('typekeywords:' + t);
        });
      } else {
        parts.push('typekeywords:' + typeKeywords);
      }
    }

    // type:("Web Map" OR "Web Mapping Application")
    if (type) {
      // parts.push('type:"' + type + '"');
      parts.push('type:' + type );
    }

    if (groupId) {
      parts.push(`group:${groupId}`);
    }

    console.log('parts: ' + JSON.stringify(parts));
    let agoQuery = parts.join(' AND ');
    console.log('AGO Query: ' + agoQuery);
    return agoQuery;
  },

  model (params, transition) {

    let agoQuery = this.createAgoQuery(params.q, params.owner, params.tags, params.type, params.typeKeywords, params.id);
    let agoParams = {
      q: agoQuery,
      start: params.start,
      num: params.num,
      sortField: 'title'
    };
    // only if there is no query string, add the bbox
    if (!agoQuery) {
      agoParams.bbox = '-180,-90,180,90';
    }
    // if the query changes, reset the paging
    if (this.get('lastAgoQuery') !== agoQuery) {
      this.set('lastAgoQuery', agoQuery);
      // reset paging
      agoParams.start = 1;
    }

    return this.get('itemsService').search(agoParams);
  },

  afterModel(model, transition) {

    // get group name. maybe there is a better way to do this.
    // how do i bring over the group name from the index route when the user clicks on it?
    const groupId = transition.params['groups.group'].id;

    const groupsService = this.get('groupsService');

    groupsService.getById(groupId)
      .then( (response) => {
        if (response) {
          this.get('appState').set('groupName', response.title);
        }
      }, (error) => {
        Ember.debug(`unable to get group info : ${JSON.stringify(error)}`);
      });


    if (model.results && model.results.length > 0) {
      
      // set auditDetail default
      model.results.forEach( (item) => {
        Ember.set(item, 'auditDetail', {STATUS: 'Not Reviewed'});
      });

      const itemIds = model.results.map( (item) => item.id );

      const auditLogService = this.get('auditLogService');

      auditLogService.getItemsAuditStatus(itemIds)
        .then( (response) => {

          const sorted = response.features.uniqBy('attributes.ITEM_ID');

          sorted.forEach( (feature) => { 

            model.results.forEach( (item) => {
              if (item.id === feature.attributes.ITEM_ID) {
                Ember.set(item, 'auditDetail', Ember.copy(feature.attributes));
              }
            });

          });

        }, (error) => {
          Ember.debug(`error querying audit feature service : ${JSON.stringify(error)}`);
        });
      
    }
  }
});