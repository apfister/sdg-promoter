import Ember from 'ember';

/**
 * loading-indicator component
 *
 * Default Usage
 * {{loading-indicator}} - will pull in a default translated message
 *
 * Passing a custom message
 * {{loading-indicator message=(t 'some.translation.key')}}
 *
 * No Message - no message is shown
 * {{loading-indicator noMessage=true}}
 */

export default Ember.Component.extend({

  intl: Ember.inject.service(),

  tagName: 'div',

  classNames: [ 'loader' ],

  isActive: true,

  classNameBindings: [ 'isActive' ],

});