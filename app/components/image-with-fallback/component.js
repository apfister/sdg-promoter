import Ember from 'ember';
import ENV from 'sdg-promoter/config/environment';

export default Ember.Component.extend({
  
  classNames: ['center-block', 'item-thumbnail'],

  didInsertElement() {
    this.$().on('error', Ember.run.bind(this, this.onImageError));
  },

  willDestroyElement() {
    this.$().off();
  },

  tagName: 'img',

  attributeBindings: [ 'src', 'title', 'alt' ],

  thumbnailIsBroken: false,

  src: Ember.computed('imgSrc', 'fallbackSrc', 'thumbnailIsBroken', function() {
    const imgSrc = this.get('imgSrc');
    let src = this.get('fallbackSrc');
    if (imgSrc && !this.get('thumbnailIsBroken')) {
      src = imgSrc;
    }
    return src;
  }),

  onImageError() {
    Ember.run(this, function () {
      if (!this.get('isDestroyed') && !this.get('isDestroying')) {
        this.set('thumbnailIsBroken', true);
      }
    });
  },

});