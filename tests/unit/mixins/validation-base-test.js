import Ember from 'ember';
import ValidationBaseMixin from 'sdg-promoter/mixins/validation-base';
import { module, test } from 'qunit';

module('Unit | Mixin | validation base');

// Replace this with your real tests.
test('it works', function(assert) {
  let ValidationBaseObject = Ember.Object.extend(ValidationBaseMixin);
  let subject = ValidationBaseObject.create();
  assert.ok(subject);
});
