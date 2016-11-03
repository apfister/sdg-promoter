import Ember from 'ember';

export default Ember.Component.extend({
  
  classNames: ['search-select'],

  didInsertElement() {
    this.$('.selectpicker').selectpicker();

    this.$('.selectpicker').on('changed.bs.select', (selectedIndex, newValue, oldValue) => {
      // console.log(selectedIndex, newValue, oldValue);
      let options = this.$('.selectpicker').find(':selected').map( (index, option) => {
        return option.label;
      });
      
      if (options.length === 0) {
        options = null;
      } else {
        options = '("' + options.toArray().join('" OR "') + '")';
      }

      this.sendAction('updateItemTypeQueryParam', options);
    });
  },

  willDestroyElement() {
    this.$('.selectpicker').off('changed.bs.select');
    this.$('.selectpicker').selectpicker('destroy');
  }
});
