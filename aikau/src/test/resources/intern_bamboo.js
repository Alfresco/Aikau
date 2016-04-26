define(["./config/Suites"], function(Suites) {

   // Define "constants"
   var settings = {
         project: "Aikau",
         name: "[AKU] Bamboo Tests @ " + (new Date()).toISOString(),
         "browserstack.debug": true
      },
      envData = [{
         browserName: "chrome",
         platform: "MAC"
      }, {
         browserName: "firefox",
         platform: "MAC"
      }],
      environments = envData.map(function(env) {
         return Object.assign(env, settings);
      });

   return {

      // Environments to run against
      environments: environments,

      // Maximum number of simultaneous integration tests that should be executed on the remote WebDriver service
      maxConcurrency: Infinity,

      // Dig Dug tunnel handler
      tunnel: "BrowserStackTunnel",

      // Dig dug tunnel options
      tunnelOptions: {
         hostname: "hub.browserstack.com",
         protocol: "https",
         port: 443
      },

      // Configuration options for the module loader; any AMD configuration options supported by the Dojo loader can be
      // used here
      loaderOptions: {
         // Packages that should be registered with the loader in each testing environment
         // Note: the config package is specifically for virtual machine (vm)
         packages: [{
            name: "alfresco",
            location: "./src/test/resources/alfresco"
         }, {
            name: "config",
            location: "./src/test/resources/config/bamboo"
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

      // No coverage required against BS
      excludeInstrumentation: true,

      // An array of code coverage reporters to invoke
      reporters: [{
         id: "JUnit",
         filename: "test_reports/junit_" + (new Date()).toISOString().replace(/\D/g, "") + ".xml"
      }]
   };
});