/*globals process*/

// Learn more about configuring this file at <https://github.com/theintern/intern/wiki/Configuring-Intern>.
// These default settings work OK for most people. The options that *must* be changed below are the
// packages, suites, excludeInstrumentation, and (if you want functional tests) functionalSuites.
define(["./config/Suites"],
   function(Suites) {

      // Extract command-line arguments
      var rowsColsRegex = /rowsCols=(\d+)\|(\d+)/,
         serverIPRegex = /serverIP=([.0-9]+)/,
         serverIP,
         rows,
         cols;
      process.argv.forEach(function(arg) {
         var match;
         if ((match = rowsColsRegex.exec(arg))) {
            rows = parseInt(match[1], 10);
            cols = parseInt(match[2], 10);
         } else if ((match = serverIPRegex.exec(arg))) {
            serverIP = match[1];
         }
      });

      // Define "constants"
      var isoTimestamp = (new Date()).toISOString(),
         settings = {
            project: "Aikau",
            name: "[AKU] BrowserStack Tests @ " + isoTimestamp,
            "browserstack.debug": false
         },
         envData = [{
            browserName: "chrome",
            platform: "WINDOWS"
         }, {
            browserName: "firefox",
            platform: "WINDOWS"
         }],
         environments = envData.map(function(env) {
            return Object.assign(env, settings);
         });

      return {

         // The IP address of the test server
         serverIP: serverIP,

         // The port on which the instrumenting proxy will listen
         proxyPort: 9000,

         // A fully qualified URL to the Intern proxy
         proxyUrl: "http://" + serverIP + ":9000/",

         // Environments to run against
         environments: environments,

         // Maximum number of simultaneous integration tests that should be executed on the remote WebDriver service
         // maxConcurrency: 1,
         maxConcurrency: Infinity,

         // Terminal information
         terminalInfo: {
            rows: rows,
            cols: cols
         },

         // Dig Dug tunnel handler
         tunnel: "BrowserStackTunnel",

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
               location: "./src/test/resources/config/vm"
            }, {
               name: "reporters",
               location: "./src/test/resources/reporters"
            }, {
               name: "dojo",
               location: "./node_modules/intern/node_modules/dojo"
            }, {
               name: "lodash",
               location: "./src/test/resources/lib/lodash",
               main: "lodash.compat"
            }]
         },

         // Non-functional test suite(s) to run in each browser
         suites: Suites.nonFunctionalSuites,

         // Functional test suite(s) to run in each browser once non-functional tests are completed
         functionalSuites: Suites.vmFunctionalSuites(),

         // A regular expression matching URLs to files that should not be included in code coverage analysis
         excludeInstrumentation: /^(?:tests|node_modules)\//,

         // An array of code coverage reporters to invoke
         reporters: [{
            id: "JUnit",
            filename: "test_reports/junit_" + isoTimestamp + ".xml"
         }]

      };
   });