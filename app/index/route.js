import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Route.extend({

  groupsService: Ember.inject.service(),
  
  userService: Ember.inject.service(),

  model() {
    const userService = this.get('userService');
    userService.__listGroups = this.__listGroups;

    let agoParams = {
      q: '*',
      start: 1,
      num: 10
    };

    return userService.__listGroups(agoParams);
  },

  __listGroups() {
    const url = 'https://sdgs.maps.arcgis.com/sharing/rest/community/self';

    return ajax({
      url: url,
      data: { f: 'json', token: this.get('session.token') },
      dataType: 'json'
    })
      .then( (response) => { return { results: response.groups.sort() }; });
  }

});
