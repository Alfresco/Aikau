/*globals process*/

// Learn more about configuring this file at <https://github.com/theintern/intern/wiki/Configuring-Intern>.
// These default settings work OK for most people. The options that *must* be changed below are the
// packages, suites, excludeInstrumentation, and (if you want functional tests) functionalSuites.
define(["./config/Suites"],
   function(Suites) {

      // Extract the rows and columns from the command-line arguments
      var rowsColsRegex = /rowsCols=(\d+)\|(\d+)/,
         rows,
         cols;
      process.argv.forEach(function(arg) {
         var match = rowsColsRegex.exec(arg);
         if (match) {
            rows = parseInt(match[1], 10);
            cols = parseInt(match[2], 10);
         }
      });

      // Define "constants"
      var PROJECT_NAME = "Aikau",
         SESSION_NAME = "[AKU] BrowserStack Tests @ " + (new Date()).toISOString(),
         MAC = "OS X",
         MAC_VERSION = "Yosemite",
         WINDOWS = "Windows",
         WINDOWS_VERSION = "7",
         BS_DEBUG = false;

      return {

         // The port on which the instrumenting proxy will listen
         proxyPort: 9000,

         // A fully qualified URL to the Intern proxy
         proxyUrl: "http://localhost:9000/",

         // Default desired capabilities for all environments. Individual capabilities can be overridden by any of the
         // specified browser environments in the `environments` array below as well. See
         // https://code.google.com/p/selenium/wiki/DesiredCapabilities for standard Selenium capabilities and
         // https://saucelabs.com/docs/additional-config#desired-capabilities for Sauce Labs capabilities.
         // Note that the `build` capability will be filled in with the current commit ID from the Travis CI environment
         // automatically
         capabilities: {
            "selenium-version": "2.45.0"
         },

         // Browsers to run integration testing against. Note that version numbers must be strings if used with Sauce
         // OnDemand. Options that will be permutated are browserName, version, platform, and platformVersion; any other
         // capabilities options specified for an environment will be copied as-is
         environments: [{
            browserName: "Chrome",
            chromeOptions: {
               excludeSwitches: ["ignore-certificate-errors"]
            },
            os: MAC,
            os_version: MAC_VERSION,
            platform: MAC,
            platformVersion: MAC_VERSION,
            project: PROJECT_NAME,
            name: SESSION_NAME,
            "browserstack.debug": BS_DEBUG
         }, {
            browserName: "Firefox",
            os: MAC,
            os_version: MAC_VERSION,
            platform: MAC,
            platformVersion: MAC_VERSION,
            project: PROJECT_NAME,
            name: SESSION_NAME,
            "browserstack.debug": BS_DEBUG
         }, {
            browserName: "Internet Explorer",
            version: ["11", "10", "9"],
            os: WINDOWS,
            os_version: WINDOWS_VERSION,
            platform: WINDOWS,
            platformVersion: WINDOWS_VERSION,
            project: PROJECT_NAME,
            name: SESSION_NAME,
            "browserstack.debug": BS_DEBUG
         }],

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
            }]
         },

         // Non-functional test suite(s) to run in each browser
         suites: Suites.nonFunctionalSuites,

         // Functional test suite(s) to run in each browser once non-functional tests are completed
         functionalSuites: Suites.vmFunctionalSuites(),

         // A regular expression matching URLs to files that should not be included in code coverage analysis
         excludeInstrumentation: /^(?:tests|node_modules)\//,

         // An array of code coverage reporters to invoke
         reporters: [
            // "Console"
            // "Runner"
            // "reporters/TestSummary"
            // "reporters/AikauReporter"
            "reporters/AikauConcurrentReporter"
            // "Pretty"
         ]

      };
   });