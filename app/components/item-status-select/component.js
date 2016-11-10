import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['search-select'],

  auditLogService: Ember.inject.service(),

  didInsertElement() {
    this.$('.selectpicker').selectpicker({
      width: 160
    });

    this.$('.selectpicker').on('changed.bs.select', (selectedIndex, newValue, oldValue) => {
      console.log(selectedIndex, newValue, oldValue);
      
      const newStatus = this.$('.selectpicker').selectpicker('val');

      const itemId = this.get('model.id');

      const auditLogService = this.get('auditLogService');

      const stringyFeatures = JSON.stringify([
        {  
          attributes: {
            ITEM_ID: itemId,
            STATUS: newStatus
          }
        }
      ]);

      auditLogService.addAuditEntry(stringyFeatures)
        .then( (response) => {
          if (!Ember.isEmpty(response) 
            && response.addResults[0]
            && response.addResults[0].success) {

            Ember.set(this.get('model'), 'auditDetail.STATUS', newStatus);

          }
        }, (error) => {
          Ember.debug(`Error setting item status: ${JSON.stringify(error)}`);
        });
    });

    const detail = this.get('model.auditDetail');

    if (detail && detail.STATUS) {
      this.$('.selectpicker').selectpicker('val', detail.STATUS);
    } else {
      this.$('.selectpicker').selectpicker('val', 'Not Reviewed');
    }
  },

  willDestroyElement() {
    this.$('.selectpicker').off('changed.bs.select');
    this.$('.selectpicker').selectpicker('destroy');
  }
});
