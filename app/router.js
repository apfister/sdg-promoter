import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  // this.route('index', { path: '/'} );
  this.route('signin');
  this.route('unauthorized');

  // this.authenticatedRoute('review', { path: ':groupId' }, function () {
  //   this.route('index', { path: '/'});
  // });

  this.authenticatedRoute('groups', {path: '/'},  function () {
    this.route('group', { path: '/:id' }, function () {
      this.route('details', { path: '/' });
    });
  });

  this.route('groups', function() {
    this.route('index-loading');
  });
});

export default Router;
