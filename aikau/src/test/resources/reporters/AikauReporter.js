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
      timers = {
         beforeAll: 0,
         beforeTest: 0,
         beforeSuite: 0
      },
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
                  platformName = env.platform.split(" ").map(function(platformName) {
                     var capitalised = platformName && platformName.substr(0, 1).toUpperCase() + platformName.substr(1).toLowerCase();
                     return capitalised || "";
                  }).join(" "),
                  envString = safeBrowserName + " v" + env.version + " (" + platformName + ")";
               suite.env = envString;
               environments[envString] = true;
            }
            return setupFunc.apply(this, arguments);
         };
      } else {
         console.log(ANSI_COLORS.FgYellow + "\n[INFO] Suite '" + suite.name + "' does not have setup() method" + ANSI_COLORS.Reset);
      }
   }

   function logTest(name, duration, result, color) {
      var totalLength = ("" + counts.total).length,
         count = pad("" + testCounter++, totalLength, "0") + "/" + counts.total,
         message = count + ": " + name + " (" + duration + "ms)",
         formattedResult = ANSI_COLORS.Bold + " [" + result + "]",
         controlCode = color || ANSI_COLORS.Dim,
         output = controlCode + message + formattedResult + ANSI_COLORS.Reset;
      console.log(output);
   }

   function logTitle(title) {
      var underOverLine = new Array(title.length + 1).join("="),
         output = ["", underOverLine, title, underOverLine].join("\n");
      console.log(ANSI_COLORS.Bold + output + ANSI_COLORS.Reset);
   }

   function pad(str, paddedLength, padChar, padRight) {
      str = str || "";
      paddedLength = paddedLength || str.length;
      padChar = padChar || " ";
      var padding = new Array(paddedLength).join(padChar),
         preTrim = padRight ? str + padding : padding + str;
      return padRight ? preTrim.slice(0, paddedLength) : preTrim.slice(0 - paddedLength);
   }

   /* Create and return the intern object */
   return {

      /* CORE FUNCTIONS */
      start: function() {

         // Record start time
         timers.beforeAll = Date.now();

         // Output starting message
         logTitle("Starting tests");

      },
      stop: function() {

         // Calculate and log time taken
         var timeTakenMs = Date.now() - timers.beforeAll,
            timeTakenMins = Math.floor(timeTakenMs / 1000 / 60),
            timeTakenSecs,
            minText,
            secText,
            timeTaken;
         if (timeTakenMins) {
            timeTakenSecs = Math.round(timeTakenMs / 1000) % (timeTakenMins * 60);
            minText = timeTakenMins === 1 ? "minute" : "minutes";
            secText = timeTakenSecs === 1 ? "second" : "seconds";
            timeTaken = timeTakenMins + " " + minText + " " + timeTakenSecs + " " + secText;
         } else {
            timeTakenSecs = Math.round(timeTakenMs / 100) / 10;
            secText = timeTakenSecs === 1 ? "second" : "seconds";
            timeTaken = timeTakenSecs + " " + secText;
         }

         // Output completed message and test run information
         var environmentNames = Object.keys(environments);
         logTitle("Testing complete");
         console.log("");
         console.log("Took " + timeTaken + " to run " + counts.total + " tests in " + environmentNames.length + " environments: \"" + environmentNames.join("\", \"") + "\"");

         // Calculate stats for the test-run
         var stats = {
               "Success rate": Math.round((counts.passed + counts.skipped) / counts.total) * 100 + "%",
               "Total passed": counts.passed,
               "Total skipped": counts.skipped,
               "Total failed": collections.failures.length,
               "Unexpected errors": collections.errors.length,
               "Deprecated code calls": collections.deprecations.length
            },
            maxStatLabelLength,
            maxStatValueLength;

         // Check longest name and value in stats
         Object.keys(stats).forEach(function(statLabel) {
            var statValue = stats[statLabel] + "",
               statLabelLength = statLabel.length,
               statValueLength = statValue.length;
            if (!maxStatLabelLength || statLabelLength > maxStatLabelLength) {
               maxStatLabelLength = statLabelLength;
            }
            if (!maxStatValueLength || statValueLength > maxStatValueLength) {
               maxStatValueLength = statValueLength;
            }
         });

         var statMessages = Object.keys(stats).map(function(statLabel) {
            var statValue = stats[statLabel],
               paddedLabel = pad(statLabel, maxStatLabelLength + 5, ".", true),
               paddedValue = pad(statValue + "", maxStatValueLength, "."),
               message = paddedLabel + paddedValue;
            return statValue ? message : ANSI_COLORS.Dim + message + ANSI_COLORS.Reset;
         }).join("\n");

         // Log test-run stats
         logTitle("Results");
         console.log("");
         console.log(statMessages);

         // Run through the collections
         Object.keys(collections).forEach(function(collectionName) {

            // Check there are some items in the collection
            var collectionItems = collections[collectionName];
            if (!collectionItems.length) {
               return;
            }

            // Output title
            var collectionTitle = collectionName.substr(0, 1).toUpperCase() + collectionName.substr(1).toLowerCase();
            logTitle(collectionTitle);

            // Run through collection
            var lastEnv,
               lastSuite;
            collectionItems.forEach(function(item) {

               // Output environment information if changed
               if (item.state.env !== lastEnv) {
                  lastEnv = item.state.env;
                  lastSuite = null;
                  console.log("\n" + ANSI_COLORS.Bold + lastEnv + ANSI_COLORS.Reset);
               }

               // Output suite if changed
               if (item.state.suite !== lastSuite) {
                  lastSuite = item.state.suite;
                  console.log(lastSuite);
               }

               // Show test and message
               if (item.state.test) {
                  console.log("- " + item.state.test);
                  console.log("  \"" + item.message + "\"");
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
      "/suite/end": function(suite) {
         if (suite.name === "main") {
            return;
         }
         var timeTaken = Date.now() - timers.beforeSuite;
         console.log(ANSI_COLORS.Dim + "Suite took " + timeTaken + "ms to complete" + ANSI_COLORS.Reset);
      },
      "/suite/error": function(suite) {
         if (suite.name === "main") {
            return;
         }
         state.test = null;
         addToCollection("errors", suite.error.stack);
         console.log(ANSI_COLORS.FgRed + "   [ERROR]" + ANSI_COLORS.Reset);
      },
      "/suite/start": function(suite) {
         if (suite.name === "main") {
            return;
         }
         augmentSuite(suite);
         timers.beforeSuite = Date.now();
         state.suite = suite.name;
         console.log("\n" + ANSI_COLORS.Bold + suite.name + ANSI_COLORS.Reset);
      },
      "/test/fail": function(test) {
         var errorMessage = test.error.message,
            lineBreakIndex = errorMessage.indexOf("\n"),
            timeTaken = Date.now() - timers.beforeTest;
         if (lineBreakIndex !== -1) {
            errorMessage = errorMessage.substr(0, lineBreakIndex);
         }
         addToCollection("failures", errorMessage);
         logTest(test.name, timeTaken, "Failed", ANSI_COLORS.FgRed);
      },
      "/test/new": function() {
         counts.total++;
      },
      "/test/pass": function(test) {
         var timeTaken = Date.now() - timers.beforeTest;
         counts.passed++;
         logTest(test.name, timeTaken, "Passed");
      },
      "/test/skip": function(test) {
         var timeTaken = Date.now() - timers.beforeTest;
         counts.skipped++;
         logTest(test.name, timeTaken, "Skipped", ANSI_COLORS.FgYellow);
      },
      "/test/start": function(test) {
         timers.beforeTest = Date.now();
         state.env = test.parent.env;
         state.test = test.name;
         if (state.suite && lastSuite !== state.suite) {
            lastSuite = state.suite;
            if (state.env) {
               console.log(state.env);
            }
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
// /suite/new
// /test/end
// /tunnel/download/progress
// /tunnel/start
// /tunnel/status
// /tunnel/stop