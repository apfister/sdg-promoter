export function initialize(app) {
  app.inject('route', 'session', 'service:session');
  app.inject('controller', 'session', 'service:session');
  app.inject('component', 'session', 'service:session');
}

export default {
  name: 'session',
  initialize
};
