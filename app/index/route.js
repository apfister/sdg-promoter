import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Route.extend({

  groupsService: Ember.inject.service(),
  
  userService: Ember.inject.service(),

  model(params, transition) {
    const userService = this.get('userService');
    userService.__listGroups = this.__listGroups;

    let agoParams = {
      q: '*',
      start: 1,
      num: 10
    };

    const portalUrl = userService.get('portalRestUrl');

    return userService.__listGroups(agoParams, portalUrl, this);
  },

  __listGroups(agoParams, portalUrl, model) {
    const url = `${portalUrl}/community/self`;
    
    agoParams.f = 'json';
    agoParams.token = this.get('session.token');

    return ajax({
      url: url,
      data: agoParams,
      dataType: 'json'
    })
      .then( (response) => { 
        
        const userService = model.get('userService');

        const portalUrl = userService.get('portalRestUrl');

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
        const groups = response.groups.filter( (group) => {
          
          if ( groupSkips.contains( group.title ) ) {
            return false;
          }

          let url = '';

          if (!Ember.isEmpty(group.thumbnail)) {
            
            url = `${portalUrl}/community/groups/${group.id}/info/${group.thumbnail}`;
            
            const token = model.get('session.token');

            if (token) {
              url += `?token=${token}`;
            }

          } else {
            url = 'http://cdn.arcgis.com/cdn/20093/images/group-no-image.png';
          }

          Ember.set(group, 'groupThumbnailUrl', url);

          return group;

        });

        return { results: groups.sortBy('title') }; 
      })
      .catch( (error) => { 
        Ember.debug(`error getting group list: ${JSON.stringify(error)}`);

        model.transitionTo('signin');

        // const userName = this.get('session.currentUser.username');
        
        // const errorDetails = `Error Details: ${error.message}`;

        // return { error: `Unable to Retrieve Groups for [${userName}] -- Try Signing Out and Signing In again.`, details: errorDetails || '' };
      });
  }

});
