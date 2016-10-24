import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['container'],

  scoreGraphicClass: Ember.computed('model.scoring', function () {
    return this.get('model.scoring');
  }),

  didInsertElement() {
    const model = this.get('model');
  }

  // ,didReceiveAttrs() {
  //   this._super(...arguments);

  //   const model = this.get('model');
  //   console.log(model.scoring);
  // }
});
