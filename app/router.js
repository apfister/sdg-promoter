import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('signin');
  this.route('unauthorized');

  this.authenticatedRoute('review', { path: ':groupId' }, function () {
    this.route('index', { path: '/'});
  });
});

export default Router;
