import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('placeholder-image', 'Integration | Component | placeholder image', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{placeholder-image}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#placeholder-image}}
      template block text
    {{/placeholder-image}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
