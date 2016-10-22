import Ember from 'ember';

export default Ember.Controller.extend({
  
  appState: Ember.inject.service(),

  actions: {
  
    showSettings() {
      console.log('showSettings modal goes here');
    },

    searchKeyDown(event) {
      if (event.which === 13) {
        const searchTerm = event.target.value;

        if (!Ember.isEmpty(searchTerm)) {
          Ember.debug(`enter key pressed, filtering items for : '${searchTerm}'`);

          this._filterGrid(searchTerm);

        } else {
          Ember.debug('enter key pressed but no value detected. clearing search filter');
        }
      }
    }
  },

  _filterGrid(searchTerm) {
    const appState = this.get('appState');

    const grid = appState.get('grid');
    const gridStore = appState.get('gridStore');

    if (grid && gridStore) {
      const filter = new gridStore.Filter();
      filter.contains('title', 'project');

      grid.set('collection', gridStore.filter(filter));
    }
  }

});
