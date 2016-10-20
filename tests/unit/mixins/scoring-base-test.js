import Ember from 'ember';
import ScoringBaseMixin from 'sdg-promoter/mixins/scoring-base';
import { module, test } from 'qunit';

module('Unit | Mixin | scoring base');

// Replace this with your real tests.
test('it works', function(assert) {
  let ScoringBaseObject = Ember.Object.extend(ScoringBaseMixin);
  let subject = ScoringBaseObject.create();
  assert.ok(subject);
});
