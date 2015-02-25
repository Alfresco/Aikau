define([], function() {

   /* Setup state variables */
   var counts = {
         total: 0,
         passed: 0,
         skipped: 0
      },
      collections = {
         failures: [],
         errors: [],
         deprecations: []
      },
      state = {},
      testCounter = 1,
      environments = {},
      lastSuite;

   /* Constants */
   var ANSI_COLORS = {
      Reset: "\x1b[0m",
      Bold: "\x1b[1m",
      Dim: "\x1b[2m",
      Underline: "\x1b[4m",
      Blink: "\x1b[5m",
      Reverse: "\x1b[7m",
      Hidden: "\x1b[8m",
      FgBlack: "\x1b[30m",
      FgRed: "\x1b[31m",
      FgGreen: "\x1b[32m",
      FgYellow: "\x1b[33m",
      FgBlue: "\x1b[34m",
      FgMagenta: "\x1b[35m",
      FgCyan: "\x1b[36m",
      FgWhite: "\x1b[37m",
      BgBlack: "\x1b[40m",
      BgRed: "\x1b[41m",
      BgGreen: "\x1b[42m",
      BgYellow: "\x1b[43m",
      BgBlue: "\x1b[44m",
      BgMagenta: "\x1b[45m",
      BgCyan: "\x1b[46m",
      BgWhite: "\x1b[47m"
   }; // From https://coderwall.com/p/yphywg/printing-colorful-text-in-terminal-when-run-node-js-script

   /* Helper functions */
   function addToCollection(collection, message) {
      collections[collection].push({
         state: JSON.parse(JSON.stringify(state)),
         message: message
      });
   }

   function augmentSuite(suite) {
      var setupFunc = suite.setup;
      if (setupFunc) {
         suite.setup = function() {
            var env = this.remote && this.remote.environmentType;
            if (env && env.browserName) {
               var safeBrowserString = env.browserName.replace(/[^a-zA-Z0-9]/g, /_/),
                  safeBrowserName = safeBrowserString.substr(0, 1).toUpperCase() + safeBrowserString.substr(1).toLowerCase(),
                  envString = env.platform + " - " + safeBrowserName + " v" + env.version;
               suite.env = envString;
               environments[envString] = true;
            }
            return setupFunc.apply(this, arguments);
         };
      } else {
         console.log(ANSI_COLORS.FgYellow + "\n[INFO] Suite '" + suite.name + "' does not have setup() method" + ANSI_COLORS.Reset);
      }
   }

   function logTest(message, color) {
      var totalLength = ("" + counts.total).length,
         padString = (new Array(totalLength)).join("0"),
         testCount = testCounter++,
         paddedCount = (padString + testCount).slice(0 - totalLength),
         logMessage = paddedCount + "/" + counts.total + ": " + message;
      if (color) {
         logMessage = color + logMessage + ANSI_COLORS.Reset;
      }
      console.log(logMessage);
   }

   /* Create and return the intern object */
   return {

      /* CORE FUNCTIONS */
      start: function() {
         console.log("");
         console.log("Running tests ...");
      },
      stop: function() {

         // Output completed message
         console.log("");
         console.log(ANSI_COLORS.Underline + "Test run complete" + ANSI_COLORS.Reset);

         // Give initial stats for the test-run
         var info = {
               Total: counts.total,
               Passed: counts.passed,
               Skipped: counts.skipped,
               Failed: collections.failures.length,
               Errors: collections.errors.length,
               Deprecated: collections.deprecations.length,
               Environments: Object.keys(environments).length
            },
            infoMessage = Object.keys(info).map(function(infoKey) {
               return infoKey + ": " + info[infoKey];
            }).join(", ");
         console.log("");
         console.log(infoMessage);

         // Run through the collections
         Object.keys(collections).forEach(function(collectionName) {

            // Check there are some items in the collection
            var collectionItems = collections[collectionName];
            if (!collectionItems.length) {
               return;
            }

            // Output title
            var title = collectionName.substr(0, 1).toUpperCase() + collectionName.substr(1).toLowerCase();
            console.log("\n" + ANSI_COLORS.Underline + title + ANSI_COLORS.Reset + "\n");

            // Run through collection
            var lastEnv,
               lastSuite;
            collectionItems.forEach(function(item) {

               // Output environment information if changed
               if (item.state.env !== lastEnv) {
                  lastEnv = item.state.env;
                  console.log(ANSI_COLORS.Bold + lastEnv + ANSI_COLORS.Reset);
               }

               // Output suite if changed
               if (item.state.suite !== lastSuite) {
                  lastSuite = item.state.suite;
                  console.log(lastSuite);
               }

               // Show test and message
               if (item.state.test) {
                  console.log("- " + item.state.test);
                  console.log("  " + item.message);
               } else {
                  // This should be a stacktrace
                  console.log("- " + item.message);
               }
            });
         });

         // End with empty line
         console.log("");
      },

      /* TOPIC HANDLERS */
      "/deprecated": function(oldCommand, newCommand, message) {
         var deprecationMessage = oldCommand + " has been deprecated and replaced by " + newCommand;
         if (message) {
            deprecationMessage += " (" + message + ")";
         }
         addToCollection("deprecations", deprecationMessage);
      },
      "/error": function(error) {
         addToCollection("errors", error.message);
      },
      "/suite/error": function(suite) {
         state.test = null;
         addToCollection("errors", suite.error.stack);
         console.log(ANSI_COLORS.FgRed + "   [ERROR]" + ANSI_COLORS.Reset);
      },
      "/suite/start": function(suite) {
         augmentSuite(suite);
         state.suite = suite.name;
         if (suite.name !== "main") {
            console.log("\n" + ANSI_COLORS.Bold + suite.name + ANSI_COLORS.Reset);
         }
      },
      "/test/fail": function(test) {
         var errorMessage = test.error.message,
            lineBreakIndex = errorMessage.indexOf("\n");
         if (lineBreakIndex !== -1) {
            errorMessage = errorMessage.substr(0, lineBreakIndex);
         }
         addToCollection("failures", errorMessage);
         logTest(test.name + " [FAILED]", ANSI_COLORS.FgRed);
      },
      "/test/new": function() {
         counts.total++;
      },
      "/test/pass": function(test) {
         counts.passed++;
         logTest(test.name + " [PASSED]");
      },
      "/test/skip": function(test) {
         counts.skipped++;
         logTest(test.name + " [SKIPPED]", ANSI_COLORS.FgYellow);
      },
      "/test/start": function(test) {
         state.env = test.parent.env;
         state.test = test.name;
         if (state.suite && lastSuite !== state.suite) {
            lastSuite = state.suite;
            console.log(state.env);
         }
      }
   };
});


// ================
// Unhandled topics
// ================
// 
// /client/end
// /coverage
// /runner/end
// /runner/start
// /suite/end
// /suite/new
// /test/end
// /tunnel/download/progress
// /tunnel/start
// /tunnel/status
// /tunnel/stop