import Ember from 'ember';

export default Ember.Route.extend({

  groupsService: Ember.inject.service(),
  
  userService: Ember.inject.service(),

  ajax: Ember.inject.service(),

  queryParams: {
    'start': {refreshModel: true},
    'num': {refreshModel: true},
    'q': {refreshModel: true},
    'owner': {refreshModel: true},
    'tags': {refreshModel: true},
  },

  model(params, transition) {
    const userService = this.get('userService');
    userService.__listGroups = this.__listGroups;

    let qQueryString = [];

    const orgId = this.get('session.portal.id');
    
    if (!Ember.isEmpty(orgId)) {
      qQueryString.push(`orgid:${orgId}`);
    }

    if (!Ember.isEmpty(params.q)) {
      qQueryString.push(`${params.q}`);
    } else {
      qQueryString.push('*')
    }

    // tag search is borked.
    // if (!Ember.isEmpty(params.tags)) {
    //   qQueryString.push(`tags:${params.tags}`);
    // }

    const groupSkips = [
      'ArcGIS Marketplace Content',
      'Crowdsource Reporter',
      'Default Templates Group',
      'Featured Content',
      'My BAO Group',
      'My CA Group',
      'My GeoPlanner Group',
      'PREP'
    ];

    qQueryString.push( 'NOT(title:"' + groupSkips.join('") AND NOT(title:"') + '")' );

    const agoParams = {
      method: 'GET',
      data: {
        q: qQueryString.join(' AND '),
        owner: params.owner || null,
        start: params.start,
        num: params.num,
        f: 'json',
        sortField: 'title',
        token: this.get('session.token')
      }
    };

    const portalUrl = userService.get('portalRestUrl');

    const url = `${portalUrl}/community/groups`;

    return this.get('ajax').request(url, agoParams)
      .then( (response) => {

        this._fixThumbnails(response, portalUrl, this.get('session.token'));

        // if (!Ember.isEmpty(params.tags)) {
        //   const tagFilteredResults = this._postProcessTags(response, params.tags.split(','));

        //   response.results = tagFilteredResults;
        //   response.total = tagFilteredResults.length;
        // }        

        return response;
      }, (error) => {
        Ember.debug(`error getting group list: ${JSON.stringify(error)}`);
      });
  },

  // _postProcessTags(response, tags) {
  //   return response.results.filter( (result) => {
  //     return result.tags.any((tag) => tags.indexOf(tag) > -1);
  //   });    
  // },

  _fixThumbnails(response, portalUrl, token) {
    response.results.forEach( (group) => {
          
      let url = '';

      if (!Ember.isEmpty(group.thumbnail)) {
        
        url = `${portalUrl}/community/groups/${group.id}/info/${group.thumbnail}`;
        
        if (token) {
          url += `?token=${token}`;
        }

      } else {
        url = 'http://cdn.arcgis.com/cdn/20093/images/group-no-image.png';
      }

      Ember.set(group, 'groupThumbnailUrl', url);         

    });
  }

});
