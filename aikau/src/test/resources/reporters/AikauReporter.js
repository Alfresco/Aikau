define([], function() {

   /* Constants */
   var CONFIG = {
         ShowUnused: false
      },
      UNUSED_TOPICS = [
         "/client/end",
         "/coverage",
         "/runner/end",
         "/runner/start",
         "/suite/new",
         "/tunnel/download/progress",
         "/tunnel/start",
         "/tunnel/status",
         "/tunnel/stop"
      ],
      ANSI_COLORS = {
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

   /* Setup state variables */
   var counts = {
         total: 0,
         passed: 0,
         skipped: 0,
         run: 0
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
      unusedTopicsCounter = {},
      lastSuite,
      lastEnv;

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
            if (suite.name !== "main") {
               var env = this.remote && this.remote.environmentType;
               if (env && env.browserName) {
                  var browserName = env.browserName.split(" ").map(function(namePart) {
                        return capitalise(namePart);
                     }).join(" "),
                     platformName = env.platform.split(" ").map(function(nextPlatform) {
                        var capitalised = nextPlatform && capitalise(nextPlatform);
                        return capitalised || "";
                     }).join(" "),
                     envString = browserName + " v" + env.version + " (" + platformName + ")";
                  suite.env = envString;
                  environments[envString] = true;
               } else {
                  console.log(ANSI_COLORS.FgYellow + "\n[INFO] Suite '" + suite.name + "' does not have browserName in its environment: ", env, ANSI_COLORS.Reset);
               }
            }
            return setupFunc.apply(this, arguments);
         };
      } else {
         console.log(ANSI_COLORS.FgYellow + "\n[INFO] Suite '" + suite.name + "' does not have setup() method" + ANSI_COLORS.Reset);
      }
   }

   function capitalise(input) {
      if (!input) {
         return input;
      }
      return input.substr(0, 1).toUpperCase() + input.substr(1).toLowerCase();
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

   function msToMinsAndSecs(ms) {
      var wholeMins = Math.floor(ms / 1000 / 60),
         roundedSecs,
         minText,
         secText,
         timeInMinsAndSecs;
      if (wholeMins) {
         roundedSecs = Math.round(ms / 1000) % (wholeMins * 60);
         minText = wholeMins === 1 ? "minute" : "minutes";
         secText = roundedSecs === 1 ? "second" : "seconds";
         if(roundedSecs) {
            timeInMinsAndSecs = wholeMins + " " + minText + " " + roundedSecs + " " + secText;
         } else {
            timeInMinsAndSecs = wholeMins + " " + minText;
         }
      } else {
         roundedSecs = Math.round(ms / 100) / 10;
         secText = roundedSecs === 1 ? "second" : "seconds";
         timeInMinsAndSecs = roundedSecs + " " + secText;
      }
      return timeInMinsAndSecs;
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
   var reporter = {

      /* CORE FUNCTIONS */
      start: function() {

         // Record start time
         timers.beforeAll = Date.now();

         // Output starting message
         logTitle("Starting tests");

      },
      stop: function() {

         // Output completed message and test run information
         var timeTaken = msToMinsAndSecs(Date.now() - timers.beforeAll),
            environmentNames = Object.keys(environments);
         logTitle("Testing complete");
         console.log("");
         console.log("Took " + timeTaken + " to run " + counts.total + " tests in " + environmentNames.length + " environments: \"" + environmentNames.join("\", \"") + "\"");

         // Calculate total success percent (but don't let it be 100% if there are any errors/failures)
         var totalSuccesses = counts.passed + counts.skipped;
            successPercent = Math.round(totalSuccesses / counts.total * 1000) / 10;
         successPercent = successPercent === 100 ? (totalSuccesses === counts.total ? 100 : 99.9) : successPercent;

         // Calculate stats for the test-run
         var stats = {
               "Success rate": successPercent + "%",
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

         // Any unused topics?
         var unusedTopicNames = Object.keys(unusedTopicsCounter);
         if (unusedTopicNames.length && CONFIG.ShowUnused) {

            // Construct an info string
            var unusedTopicsMessage = unusedTopicNames.filter(function(nextTopicName) {
               return !!unusedTopicsCounter[nextTopicName];
            }).map(function(nextTopicName) {
               return "\"" + nextTopicName + "\": " + unusedTopicsCounter[nextTopicName];
            }).join(", ");

            // Output a title
            logTitle("Calls to unhandled topics");
            console.log("");
            console.log(unusedTopicsMessage);
         }

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
               if (!item.state.env) {
                  lastEnv = null;
                  lastSuite = null;
                  console.log("");
               } else if (item.state.env !== lastEnv) {
                  lastEnv = item.state.env;
                  lastSuite = null;
                  console.log("");
                  console.log("\"" + lastEnv + "\"");
                  console.log("");
               }

               // Output suite if changed
               if (item.state.suite && item.state.suite !== lastSuite) {
                  lastSuite = item.state.suite;
                  console.log(ANSI_COLORS.Bold + lastSuite + ANSI_COLORS.Reset);
               }

               // Show test and message
               if (item.state.test) {
                  console.log("- " + item.state.test);
                  console.log("  \"" + item.message + "\"");
               } else {
                  // This should be a stacktrace ... if it is, format specially
                  var alfrescoTestPath = "test/resources/alfresco",
                     resultMessage = item.message,
                     isStacktrace = resultMessage.indexOf(alfrescoTestPath) !== -1,
                     stacktraceLines;
                  if (isStacktrace) {
                     stacktraceLines = resultMessage.split("\n");
                     resultMessage = stacktraceLines.map(function(line, lineIndex) {
                        if (lineIndex && line.indexOf(alfrescoTestPath) === -1) {
                           return ANSI_COLORS.Dim + line + ANSI_COLORS.Reset;
                        } else {
                           return line;
                        }
                     }).join("\n");
                  }
                  console.log("- " + resultMessage);
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
         console.log("");
         console.log(ANSI_COLORS.FgRed + "[UNEXPECTED ERROR]" + ANSI_COLORS.Reset);
      },
      "/suite/end": function(suite) {
         if (suite.name === "main") {
            return;
         }
         var timeTaken = Date.now() - timers.beforeSuite,
            totalTimeTaken = Date.now() - timers.beforeAll,
            percentCompleteDecimal = (counts.run / counts.total),
            percentComplete = Math.round(percentCompleteDecimal * 1000) / 10,
            estimatedTimeLeft = (totalTimeTaken / percentCompleteDecimal) - totalTimeTaken,
            timeLeftString = msToMinsAndSecs(estimatedTimeLeft),
            progressString = percentComplete + "% complete";
         if (totalTimeTaken > 1000 * 30) {
            if (percentComplete > 10) {
               progressString += ", approx " + timeLeftString + " remaining";
            } else {
               progressString += ", calculating remaining time...";
            }
         }
         state.suite = null;
         state.env = null;
         console.log(ANSI_COLORS.Dim + "Suite took " + timeTaken + "ms to complete (" + progressString + ")" + ANSI_COLORS.Reset);
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
      "/test/end": function() {
         state.test = null;
         counts.run++;
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
         var parentSuite = test.parent;
         if (parentSuite.name === "main") {
            return;
         }
         timers.beforeTest = Date.now();
         state.env = parentSuite.env;
         state.test = test.name;
         if ((state.suite && lastSuite !== state.suite) || (state.env && lastEnv !== state.env)) {
            lastSuite = state.suite;
            lastEnv = state.env;
            if (state.env) {
               console.log(state.env);
            }
         }
      }
   };

   // Decorate the reporter with "unused" topics, to make sure we're
   // told if they're called unexpectedly
   UNUSED_TOPICS.forEach(function(topicName) {
      reporter[topicName] = function() {
         var count = unusedTopicsCounter[topicName] || 0;
         unusedTopicsCounter[topicName] = count + 1;
      };
   });

   // Pass back the reporter object
   return reporter;
});