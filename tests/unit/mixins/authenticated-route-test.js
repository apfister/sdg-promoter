import Ember from 'ember';
import AuthenticatedRouteMixin from 'sdg-promoter/mixins/authenticated-route';
import { module, test } from 'qunit';

module('Unit | Mixin | authenticated route');

// Replace this with your real tests.
test('it works', function(assert) {
  let AuthenticatedRouteObject = Ember.Object.extend(AuthenticatedRouteMixin);
  let subject = AuthenticatedRouteObject.create();
  assert.ok(subject);
});
