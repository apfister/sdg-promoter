import Ember from 'ember';
import $ from 'jquery';

export default Ember.Component.extend({
  tagName: 'img',

  attributeBindings: ['placeholderSource:src'],

  classNames: ['fade-in-image', 'item-thumbnail'],

  placeholderSource: 'assets/images/thumbnail_placeholder.png',

  sourceImage: '',

  fadeInClass: 'fade-in',

  onload() {
    console.log('img load!');
  },

  didInsertElement() {
    this._super(...arguments);

    this.$()[0].onload = function () {
      console.log('img load callback!');
    };
    // this.$().attr('src', this.get('sourceImage'));

    // For demonstration purposes only, otherwise just call this._setupImage();
    Ember.run.later(this, this._setupImage, 5000);
    // this._setupImage();
  },

  _setupImage() {
    var img = new Image();

    img.onload = () => {
      // Image is loaded, so let's set our background-image and fade class
      this.$('#fade-in-image-placeholder').addClass(this.get('fadeInClass'));
      this.$().css('background-image', `url(${this.get('sourceImage')})`);
    };

    img.src = this.get('sourceImage');
  }

});