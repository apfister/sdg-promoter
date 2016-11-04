/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'sdg-promoter',
    environment: environment,
    rootURL: '/sdg-promoter/',
    locationType: 'auto',

    torii: {
      sessionServiceName: 'session',
      providers: {
        'arcgis-oauth-bearer': {
          apiKey: 'arcgisonline',
          portalUrl: 'https://www.arcgis.com',
          remoteServiceName: 'iframe',
          display: 'iframe',
          showSocialLogins: false
        }
      }
    },

    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
      portalBaseUrl: 'https://www.arcgis.com',
      arcgisPortal: {
        domain: 'arcgis.com',
        env: '',
        maps: 'maps'
      },

      promoter: {
        auditServiceUrl: '//services3.arcgis.com/7pxWboj3YvCWYdcm/arcgis/rest/services/SDG_PROMOTER_AUDIT/FeatureServer/0'
      }
    },

    contentSecurityPolicy: {
      'default-src': "'none'",
      'script-src': "* 'unsafe-inline' 'unsafe-eval' use.typekit.net connect.facebook.net maps.googleapis.com maps.gstatic.com",
      'font-src': "* data: use.typekit.net",
      'connect-src': "*",
      'img-src': "*",
      'style-src': "* 'unsafe-inline' use.typekit.net",
      'frame-src': "*",
    }
  };

  // console.log('environment is : ' + environment);

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.rootURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.rootURL = '/sdg-promoter/';
    ENV.locationType = 'hash';
  }


  ENV.torii.providers['arcgis-oauth-bearer'].portalUrl = 'https://www.arcgis.com';

  return ENV;
};
