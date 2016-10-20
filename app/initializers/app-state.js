export function initialize(app) {
  app.inject('route', 'appState', 'service:appState');
  app.inject('controller', 'appState', 'service:appState');
  app.inject('component', 'appState', 'service:appState');
}

export default {
  name: 'app-state',
  initialize
};
