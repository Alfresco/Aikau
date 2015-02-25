// Learn more about configuring this file at <https://github.com/theintern/intern/wiki/Configuring-Intern>.
// These default settings work OK for most people. The options that *must* be changed below are the
// packages, suites, excludeInstrumentation, and (if you want functional tests) functionalSuites.
define(["./config/Suites"],
       function (Suites) {
   return {

      // The port on which the instrumenting proxy will listen
      proxyPort: 9000,

      // A fully qualified URL to the Intern proxy
      proxyUrl: "http://192.168.56.1:9000/",

      // Default desired capabilities for all environments. Individual capabilities can be overridden by any of the
      // specified browser environments in the `environments` array below as well. See
      // https://code.google.com/p/selenium/wiki/DesiredCapabilities for standard Selenium capabilities and
      // https://saucelabs.com/docs/additional-config#desired-capabilities for Sauce Labs capabilities.
      // Note that the `build` capability will be filled in with the current commit ID from the Travis CI environment
      // automatically
      capabilities: {
         "selenium-version": "2.44.0"
      },

      // Browsers to run integration testing against. Note that version numbers must be strings if used with Sauce
      // OnDemand. Options that will be permutated are browserName, version, platform, and platformVersion; any other
      // capabilities options specified for an environment will be copied as-is
      environments: [
         {
            browserName: "chrome",
            chromeOptions: {
               excludeSwitches: ["ignore-certificate-errors"]
            }
         },
         { browserName: "firefox" }
      ],

      // Maximum number of simultaneous integration tests that should be executed on the remote WebDriver service
      maxConcurrency: 1,

      // Dig Dug tunnel handler
      tunnel: "NullTunnel",

      // Dig Dug tunnel options
      tunnelOptions: {
         hostname: "192.168.56.4",
         port: 4444
      },

      // Configuration options for the module loader; any AMD configuration options supported by the Dojo loader can be
      // used here
      loader: {
         // Packages that should be registered with the loader in each testing environment
         // Note: the config package is specifically for virtual machine (vm)
         packages: [
            { name: "alfresco", location: "./src/test/resources/alfresco" },
            { name: "config", location: "./src/test/resources/config/vm" },
            { name: "reporters", location: "./src/test/resources/reporters" }
         ]
      },

      // Non-functional test suite(s) to run in each browser
      suites: Suites.nonFunctionalSuites,

      // Functional test suite(s) to run in each browser once non-functional tests are completed
      functionalSuites: Suites.vmFunctionalSuites(),

      // A regular expression matching URLs to files that should not be included in code coverage analysis
      excludeInstrumentation: /^(?:tests|node_modules)\//,

      // An array of code coverage reporters to invoke
      reporters: [
         // "console"
         // "runner"
         // "reporters/TestSummary"
         "reporters/AikauReporter"
         // "pretty"
      ]

   };
});