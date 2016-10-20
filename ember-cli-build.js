/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var Funnel = require('broccoli-funnel');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // Add options here
    sassOptions: {
      includePaths: [
        'node_modules/bootstrap-sass/assets/stylesheets',
        'node_modules/calcite-bootstrap/dist/sass'
      ]
    },

    amd: {
      loader: '//js.arcgis.com/4.0/',
      packages: [
        'esri', 'dojo', 'dgrid', 'dstore'
      ],
      inline: true,
      configPath: 'config/dojo-config.js'
    }

  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  app.import('./bower_components/bootstrap-sass/assets/javascripts/bootstrap/collapse.js');
  app.import('./bower_components/bootstrap-sass/assets/javascripts/bootstrap/dropdown.js');
  app.import('./bower_components/bootstrap-sass/assets/javascripts/bootstrap/modal.js');
  app.import('./bower_components/bootstrap-sass/assets/javascripts/bootstrap/tooltip.js');
  app.import('./bower_components/bootstrap-sass/assets/javascripts/bootstrap/transition.js');

  // although app.import can't pull from node_modules, Funnel can
  var extraAssets = new Funnel('./node_modules/bootstrap-sass/assets/fonts/bootstrap', {
    srcDir: '/',
    include: ['**.*'],
    destDir: '/assets/fonts',
  });

  return app.toTree( extraAssets );
};
