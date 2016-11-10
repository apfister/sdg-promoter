import Ember from 'ember';
import ENV from 'sdg-promoter/config/environment';

export default Ember.Service.extend({
  session: Ember.inject.service('session'),

  ajax: Ember.inject.service(),
  
  encodeForm (form = {}) {
    // Ember.merge(form, this.get('defaultParams'));
    return Object.keys(form).map((key) => {
      return [key, form[key]].map(encodeURI).join('=');
    }).join('&');
  },

  addAuditEntry(stringyFeatures) {
    const auditUrl = ENV.APP.promoter.auditServiceUrl;

    if (!Ember.isEmpty(stringyFeatures) && !Ember.isEmpty(auditUrl)) {

      let url = `${auditUrl}/addFeatures`;

      let opts = {
        method: 'POST',
        data: {
          f: 'json',
          features: stringyFeatures
        }
      };

      return this.get('ajax').request(url, opts);

    } else {
      return Ember.RSVP.resolve({error: 'unable to add to audit service. unable to get status and/or auditUrl'});
    }
  },

  getItemsAuditStatus(itemIds) {

    const where = `ITEM_ID IN ('${itemIds.join('\' , \'')}')`;
      
    const url = `${ENV.APP.promoter.auditServiceUrl}/query`;

    let opts = {
      method: 'GET',
      data: {
        f: 'json',
        where: where,
        orderByFields: 'CreationDate DESC',
        returnGeometry: false,
        outFields: '*'
      }
    };
     
    return this.get('ajax').request(url, opts);
  }

});
