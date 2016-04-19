define(["./config/Suites"], function(Suites) {

   return {

      // Environments to run integration testing against
      environments: [{
         browserName: "chrome"
      }, {
         browserName: "firefox"
      }],

      // Maximum number of simultaneous tests
      maxConcurrency: 1,

      // Dig Dug tunnel handler
      tunnel: "NullTunnel",

      // Dig Dug tunnel options
      tunnelOptions: {
         hostname: "localhost",
         port: 4444
      },

      // Configuration options for the module loader; any AMD configuration options supported by the Dojo loader can be
      // used here
      loaderOptions: {
         // Packages that should be registered with the loader in each testing environment
         // Note: the config package is specifically for local (loc)
         packages: [{
            name: "alfresco",
            location: "./src/test/resources/alfresco"
         }, {
            name: "config",
            location: "./src/test/resources/config/loc"
         }, {
            name: "reporters",
            location: "./src/test/resources/reporters"
         }, {
            name: "dojo",
            location: "./node_modules/intern/browser_modules/dojo"
         }, {
            name: "lodash",
            location: "./src/test/resources/lib/lodash",
            main: "lodash.compat"
         }, {
            name: "properties",
            location: "./node_modules/properties/lib"
         }, {
            name: "safe-json-serialiser",
            location: "./node_modules/safe-json-serialiser"
         }]
      },

      // Functional test suite(s) to run in each browser once non-functional tests are completed
      functionalSuites: Suites,

      // A regular expression matching URLs to files that should not be included in code coverage analysis
      excludeInstrumentation: /./,

      // Coverage variable is the standard istanbul one
      coverageVariable: "__coverage__",

      // An array of code coverage reporters to invoke
      reporters: [
         "reporters/ConcurrentReporter"
      ]
   };
});