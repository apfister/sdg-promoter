import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'form',
  
  classNames: [ 'form-inline' ],

  itemTagsDisplay: Ember.computed('itemTagsHidden', function () {
    if (this.get('itemTagsHidden')) {
      return 'hidden';
    }
    return 'form-control';
  }),

  submit () {
    if (this.get('query') === '') {
      this.set('query', null);
    }
    this.get('onFilter')();
    return false;
  },
  actions: {
    filter () {
      if (this.get('query') === '') {
        this.set('query', null);
      }
      this.get('onFilter')();
    }
  }
});