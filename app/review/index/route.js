import Ember from 'ember';

export default Ember.Route.extend({
  itemsService: Ember.inject.service('items-service'),
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

    if (type) {
      parts.push('type:"' + type + '"');
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
    let agoQuery = this.createAgoQuery(params.q, params.owner, params.tags, params.type, params.typeKeywords, transition.params.review.groupId);
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

  afterModel(response) {
    if (response.results) {
      
      // need to query a feature service/table to get latest notes & status per Item to show in UI
      // stuff all itemIds into a where clause in query to send to Status Feature Service
      // stuff the results onto the model .. somehow ?
      Ember.debug('getting status for items from Feature Service ..');
    }
  },

  actions: {
    destroy (item) {
      this.get('itemsService').destroy(item.id, item.owner)
        .then(() => {
          // need to transition to the route so we pick up new entries
          Ember.debug('Item Deleted... transitioning route to get new results...');
          Ember.run.later(this, function () {
            this.refresh();
          }, 100);
        });
    }
  }
});