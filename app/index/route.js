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
        return { results: response.groups.sort() }; 
      })
      .catch( (error) => { 
        Ember.debug(`error getting group list: ${JSON.stringify(error)}`);

        const userName = this.get('session.currentUser.username');
        
        const errorDetails = `Error Details: ${error.message}`;

        return { error: `Unable to Retrieve Groups for [${userName}] -- Try Signing Out and Signing In again.`, details: errorDetails || '' };
      });
  }

});
