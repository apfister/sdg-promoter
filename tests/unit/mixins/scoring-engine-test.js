import Ember from 'ember';
import ScoringEngineMixin from 'sdg-promoter/mixins/scoring-engine';
import { module, test } from 'qunit';

module('Unit | Mixin | scoring engine');

// Replace this with your real tests.
test('it works', function(assert) {
  let ScoringEngineObject = Ember.Object.extend(ScoringEngineMixin);
  let subject = ScoringEngineObject.create();
  assert.ok(subject);
});
