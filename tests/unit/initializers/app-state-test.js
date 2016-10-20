import Ember from 'ember';
import AppStateInitializer from 'sdg-promoter/initializers/app-state';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | app state', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  AppStateInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
