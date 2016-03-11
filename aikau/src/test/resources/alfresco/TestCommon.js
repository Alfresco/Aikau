/*jshint unused:false,devel:true*/

/**
 * Copyright (C) 2005-2016 Alfresco Software Limited.
 *
 * This file is part of Alfresco
 *
 * Alfresco is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Alfresco is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * This provides the common capabilities for widget unit tests.
 *
 * @author Dave Draper
 */
define(["intern/dojo/node!fs",
        "intern/dojo/node!http",
        "intern/dojo/node!os",
        "intern/dojo/node!properties-reader",
        "intern/dojo/node!process",
        "intern/dojo/lang",
        "intern",
        "config/Config",
        "intern/dojo/Promise",
        "intern/dojo/node!leadfoot/helpers/pollUntil",
        "intern/chai!assert",
        "intern/dojo/node!leadfoot/keys",
        "lodash",
        "safe-json-serialiser"], 
        function(fs, http, os, propertiesReader, process, lang, intern, Config, Promise, pollUntil, assert, keys, _, safeJson) {

   var logFilename = process.cwd() + "/test_reports/TestCommon.log";
   function logToFile(message) {
      var timestamp = "[" + (new Date()).toISOString() + "] ";
      fs.appendFileSync(logFilename, timestamp + message + os.EOL, "utf8");
   }

   return {

      /**
       * Generates the URL to use for loading unit test WebScripts
       *
       * @instance
       * @param {string} webScriptURL The WebScript URL
       * @param {string} webScriptPrefix Optional prefix to the test page.
       */
      testWebScriptURL: function(webScriptURL, webScriptPrefix) {
         var prefix = webScriptPrefix || "/tp/ws";
         return "http://" + intern.args.serverIP + ":8089/aikau/page" + prefix + webScriptURL;
      },

      /**
       * This function can be called to post coverage results.
       *
       * @param {object} test The test object that allows access to the async() function
       * @param {object} browser The browser object to work on
       */
      alfPostCoverageResults: function(test, browser) {
         if(intern.args.doCoverage === true)
         {
            console.log("Attempting to collect and skip converage results");
            var dfd = test.async(30000);
            var js = "var coverageData = {" +
               "name : name || ''," +
               "lines : $$_l.lines," +
               "runLines : $$_l.runLines," +
               "code : $$_l.code," +
               "allConditions : $$_l.allConditions," +
               "conditions : $$_l.conditions," +
               "allFunctions : $$_l.allFunctions," +
               "runFunctions : $$_l.runFunctions" +
            "};" +
            "return JSON.stringify(coverageData);";
            browser.execute(js)
               .then(function(data) {
                  console.log("Retrieved coverage data from browser...");
                  try {
                     var post_options = {
                        host: "localhost",
                        port: "8082",
                        path: "/node-coverage-store",
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json;charset=UTF-8"
                        }
                     };
                     console.log("Posting coverage data...");
                  
                     // Set up the request
                     var post_req = http.request(post_options, function(res) {
                        res.setEncoding("utf8");
                        res.on("data", function (data) {
                            console.log("Coverage data posted successfully");
                            dfd.resolve();
                        });
                     });
                     post_req.on("socket", function (socket) {
                         socket.setTimeout(30000);
                         socket.on("timeout", function() {
                             console.log("Timeout Abort!");
                             post_req.abort();
                         });
                     });
                     post_req.on("error", function(e) {
                        if (e.code === "ECONNRESET") {
                             console.log("Timeout occurred waiting for coverage post response");
                        }
                        else {
                           console.log("Coverage data post failed", e.code);
                        }
                        dfd.reject(e);
                     });
                     post_req.write(data);
                     post_req.end();
                  }
                  catch (e) {
                     console.log("An error occurred handling coverage data", e);
                     dfd.reject(e);
                  }
               },
               function(e) {
                  console.log("Couldn't collect coverage data from browser", e);
                  dfd.reject(e);
               });
         }
      },

      /**
       * This function returns the test selectors for a given widget. The wiget should be the passed
       * as the full AMD module name, e.g. "alfresco/forms/controls/MultiInputSelect". The value
       * returned can then be passed to the getTestSelector function to retrieve individual selectors
       * for that widget.
       * 
       * @param  {string} widget The AMD module name for the widget to return selectors for.
       * @return {object} The selectors object.
       */
      getTestSelectors: function(widget) {
         var properties = propertiesReader("./src/test/resources/test-selectors/" + widget + ".properties");
         return properties;
      },

      /**
       * This function can be used to retrieve an individual test selector for a given key. It is possible to
       * provide tokens to substitute into the selector as an array. Each entry in the token substitution array
       * will try to be replaced against a substitution point in the selector matching the index, for example 
       * in the selector "#{0} span:nth-child({1})" it would be expected to pass in an array of ["WIDGET_ID", "1"]
       * in order to get the 1st span element in a widget with the id "WIDGET_ID".
       * 
       * @param  {object} selectors   The selectors object returned by calling getTestSelectors for a particular widget
       * @param  {string} selectorKey The key that identifiers the particular selector to load
       * @param  {string[]} tokens    An array of substitution tokens to apply to any selector string.
       * @return {string}             The selector that can be used in a test.
       */
      getTestSelector: function(selectors, selectorKey, tokens) {
         var selector = selectors.get(selectorKey);
         if (tokens)
         {
            tokens.forEach(function(token, index) {
               var re = new RegExp("\\{" + index + "\\}", "g");
               selector = selector.replace(re, token);
            });
         }
         return selector;
      },

      /**
       * This function should be used to load the test pages.
       *
       * @instance
       * @param {object} browser The browser context to use
       * @param {string} testWebScriptURL The URL of the test WebScript
       * @param {string} testName The name of the test to run
       * @param {string} testWebScriptPrefix Optional prefix to use before the WebScript URL
       * @param {boolean} noPageLoadError Optional boolean to suppress page load failure errors
       */
      loadTestWebScript: function(browser, testWebScriptURL, testName, testWebScriptPrefix, noPageLoadError) {
         this._applyTimeouts(browser);
         this._maxWindow(browser);
         this._cancelModifierKeys(browser);
         var command = browser.get(this.testWebScriptURL(testWebScriptURL, testWebScriptPrefix))
            .then(pollUntil(
               function() {
                  /*jshint browser:true*/
                  var elements = document.getElementsByClassName("aikau-reveal");
                  return elements.length > 0 ? true : null;
               }, null, 10000))
            .then(
               function (element) {
               },
               function(error) {
                  // Failed to load, trying again...
                  browser.refresh();
            })
            .then(pollUntil(
               function() {
                  /*jshint browser:true*/
                  var elements = document.getElementsByClassName("aikau-reveal");
                  return elements.length > 0 ? true : null;
               }, null, 10000))
            .then(
               function(element) {
                  // Loaded successfully
               },
               function(error) {
                  // Failed to load after two attempts
                  if (noPageLoadError === true)
                  {
                     // Don't output an error message
                  }
                  else
                  {
                     assert.fail(null, null, "Test page could not be loaded");
                  }
            })
            .end();
         command.session.alfPostCoverageResults = function(newBrowser) {
            return newBrowser;
         };
         command.session.screenieIndex = 0;
         command.session.screenie = function() {

            // Parse arguments
            var argsArray = Array.prototype.slice.call(arguments),
               description,
               logFocusedElement,
               thisTestName;
            argsArray.forEach(function(arg) {
               if (typeof arg === "string") {
                  description = arg;
               } else if (typeof arg === "boolean") {
                  logFocusedElement = arg;
               } else if (typeof arg === "object") {
                  description = arg.desc || undefined;
                  logFocusedElement = arg.logFocused || false;
                  thisTestName = arg.testName || undefined;
               }
            });

            // Setup function variables
            var safeBrowserName = browser.environmentType.browserName.replace(/\W+/g, "_")
               .split("_")
               .map(function(namePart) {
                  return namePart.length > 1 ? namePart.substr(0, 1)
                     .toUpperCase() + namePart.substr(1)
                     .toLowerCase() : namePart.toUpperCase();
               })
               .join("_"),
               nonWordRegex = /[^a-z0-9]+/gi,
               suiteName = testName.replace(nonWordRegex, "_") + "--", // Don't ask
               thisTestName = (thisTestName && thisTestName.replace(nonWordRegex, "_") + "--") || "",
               screenshotName = safeBrowserName + "--" + suiteName + thisTestName + command.session.screenieIndex++ + ".png",
               screenshotPath = "src/test/screenshots/" + screenshotName,
               infoId = "TestCommon__webpage-info",
               dfd = new Promise.Deferred();

            // Take and store the screenshot
            browser.executeAsync(function(id, desc, logFocused, asyncComplete) {

                  // Cleanup old info block
                  var oldInfo = document.getElementById(id);
                  oldInfo && document.body.removeChild(oldInfo);

                  // Get details of the active (focused) element
                  var focused = document.activeElement,
                     focusedTag = focused.tagName,
                     focusedId = focused.id ? "#" + focused.id : "",
                     focusedClasses = focused.className ? "." + focused.className.split(" ").join(".") : "",
                     focusedText = focusedTag + focusedId + focusedClasses;

                  // Create new info block
                  var urlDisplay = document.createElement("DIV");
                  urlDisplay.id = id;
                  urlDisplay.style.background = "#666";
                  urlDisplay.style.borderRadius = "5px 0 0 5px";
                  urlDisplay.style.color = "#fff";
                  urlDisplay.style.fontFamily = "Open Sans Bold, sans-serif";
                  urlDisplay.style.fontSize = "12px";
                  urlDisplay.style.lineHeight = "18px";
                  urlDisplay.style.maxWidth = "400px";
                  urlDisplay.style.opacity = ".85";
                  urlDisplay.style.padding = "10px";
                  urlDisplay.style.position = "fixed";
                  urlDisplay.style.right = "0";
                  urlDisplay.style.bottom = "10px";
                  urlDisplay.appendChild(document.createTextNode("User Agent: " + navigator.userAgent));
                  urlDisplay.appendChild(document.createElement("BR"));
                  urlDisplay.appendChild(document.createTextNode("Time: " + (new Date()).toISOString()));
                  urlDisplay.appendChild(document.createElement("BR"));
                  urlDisplay.appendChild(document.createTextNode("URL: " + location.href));
                  if (desc) {
                     urlDisplay.appendChild(document.createElement("BR"));
                     urlDisplay.appendChild(document.createTextNode("Description: \"" + desc + "\""));
                  }
                  if (logFocused) {
                     urlDisplay.appendChild(document.createElement("BR"));
                     urlDisplay.appendChild(document.createTextNode("Focused elem: " + focusedText));
                  }

                  // Add info block to page and complete async
                  document.body.appendChild(urlDisplay);
                  setTimeout(asyncComplete, 0);

               }, [infoId, description, logFocusedElement])
               .takeScreenshot()
               .then(function(screenshot) {
                  fs.writeFile(screenshotPath, screenshot.toString("binary"), "binary", function(err) {
                     if (err) {
                        dfd.reject(err);
                     } else {
                        dfd.resolve();
                     }
                  });
               });

            // Pass back a promise
            return dfd.promise;
         };
         command.session.clearLog = function() {
            return browser.execute(function(){
               var clearButton = document.querySelector(".alfresco_logging_DebugLog__clear-button");
               clearButton && clearButton.click();
            });
         };
         command.session.getLastPublish = function(topicName) {
            var isGlobal,
               messageIfError,
               queryTimeout;
            Array.prototype.slice.call(arguments, 1).forEach(function(arg, index) {
               if (typeof arg === "boolean") {
                  isGlobal = arg;
               } else if (typeof arg === "number") {
                  queryTimeout = arg;
               } else {
                  messageIfError = arg;
               }
            });
            return this.getLogEntries({
               type: "PUBLISH",
               topic: topicName,
               pos: "last"
            }, isGlobal, messageIfError, queryTimeout);
         };
         command.session.getAllPublishes = function(topicName) {
            var isGlobal,
               messageIfError,
               queryTimeout;
            Array.prototype.slice.call(arguments, 1).forEach(function(arg) {
               if (typeof arg === "boolean") {
                  isGlobal = arg;
               } else if (typeof arg === "number") {
                  queryTimeout = arg;
               } else {
                  messageIfError = arg;
               }
            });
            return this.getLogEntries({
               type: "PUBLISH",
               topic: topicName,
               pos: "all"
            }, isGlobal, messageIfError, queryTimeout);
         };
         command.session.getLogEntries = function(filter, isGlobal, messageIfError, queryTimeout) {

            // Normalise arguments to single object
            var opts = lang.mixin({
               pos: "all",
               isGlobal: !!isGlobal,
               queryTimeout: queryTimeout || 2000
            }, filter || {});

            // Build the selector
            var selectorBits = [".alfresco_logging_DebugLog__log__entry"];
            opts.type && selectorBits.push("[data-aikau-log-type=\"" + opts.type + "\"]"); // Type is "..."
            if (opts.isGlobal) {
               opts.topic && selectorBits.push("[data-aikau-log-topic=\"" + opts.topic + "\"]"); // Topic is "..."
            } else {
               opts.topic && selectorBits.push("[data-aikau-log-topic$=\"" + opts.topic + "\"]"); // Topic ends with "..."
            }
            opts.object && selectorBits.push("[data-aikau-log-object=\"" + opts.object + "\"]"); // Object is "..."

            // Declare variable to hold the existing async timeout
            var existingTimeout;

            // Store the async timeout and then perform the search and reset the timeout
            return browser.getExecuteAsyncTimeout()
               .then(function(timeout) {
                  existingTimeout = timeout;
               })
               .setExecuteAsyncTimeout(opts.queryTimeout + 2000)
               .executeAsync(function(entriesSelector, timeout, asyncComplete) {

                  // Store the start-time and start the interval
                  var before = Date.now(),
                     intervalPointer = setInterval(function() {

                        // Perform the search and grab the payloads
                        var entries = document.querySelectorAll(entriesSelector),
                           dataObjs = Array.prototype.map.call(entries, function(entry) {
                              return JSON.parse(entry.getAttribute("data-aikau-log-data"));
                           });

                        // Finish if we have data or if timeout exceeded
                        if (dataObjs.length || (Date.now() - before > timeout)) {
                           clearInterval(intervalPointer);
                           asyncComplete(dataObjs);
                        }

                     }, 50);

               }, [selectorBits.join(""), opts.queryTimeout])
               .then(function(entries) {

                  // Return value depends upon "pos" attribute
                  if (entries.length || opts.pos === "all") {

                     // Entries found, or empty collection acceptable
                     var returnValue = entries;
                     if (opts.pos === "first") {
                        returnValue = entries.pop();
                     } else if (opts.pos === "last") {
                        returnValue = entries.shift();
                     }
                     return returnValue;

                  } else {

                     // Construct the error message
                     var customMessage = messageIfError ? messageIfError + ": " : "",
                        entryType = opts.type || "PUBorSUB",
                        topic = opts.isGlobal ? opts.topic + " (global)" : "*" + opts.topic,
                        errorMessage = "Unable to find a " + entryType + " of " + topic + " with timeout of " + opts.queryTimeout + "ms";

                     // Throw the error
                     throw new Error(customMessage + errorMessage);
                  }
               })
               .then(function(entries) {
                  browser.setExecuteAsyncTimeout(existingTimeout);
                  return entries;
               }, function(error) {
                  browser.setExecuteAsyncTimeout(existingTimeout);
                  throw error;
               });
         };
         command.session.clearXhrLog = function() {
            return browser.execute(function(){
               var clearButton = document.getElementById("mockXhr_clearLog");
               clearButton && clearButton.click();
            });
         };
         command.session.getLastXhr = function(url) {
            var messageIfError,
               queryTimeout;
            Array.prototype.slice.call(arguments, 1).forEach(function(arg, index) {
               if (typeof arg === "number") {
                  queryTimeout = arg;
               } else {
                  messageIfError = arg;
               }
            });
            return this.getXhrEntries({
               url: url,
               pos: "last"
            }, messageIfError, queryTimeout);
         };
         command.session.getXhrEntries = function(opts, messageIfError, queryTimeout) {

            // Normalise arguments to single object
            opts = lang.mixin({
               queryTimeout: 2000,
               pos: "all",
               url: "", // Searches for this string inside URL
               method: "", // Directly compares this string to the method (will be automatically upper-cased)
               headers: {}, // Checks for all header name/value pairs
               body: "", // Searches for this string inside request body
            }, opts || {});

            // Build the selector
            var selectorBits = [".mx-row"];
            opts.url && selectorBits.push("[data-aikau-xhr-url*=\"" + opts.url + "\"]");
            opts.method && selectorBits.push("[data-aikau-xhr-method=\"" + opts.method.toUpperCase() + "\"]");
            Object.keys(opts.headers).forEach(function(key) {
               var value = opts.headers[key],
                  quotedName = "\"" + key + "\"",
                  quotedValue = "\"" + value + "\"";
               if (value.constructor === Array) {
                  quotedValue = "[\"" + value.join("\",\"") + "\"]";
               }
               var attributeValue = _.unescape(quotedName + ":" + quotedValue);
               selectorBits.push("[data-aikau-xhr-headers*=\"" + attributeValue + "\"]");
            });
            opts.body && selectorBits.push("[data-aikau-xhr-request-body*=\"" + opts.body + "\"]");

            // Declare variable to hold the existing async timeout
            var existingTimeout;

            // Store the async timeout and then perform the search and reset the timeout
            return browser.getExecuteAsyncTimeout()
               .then(function(timeout) {
                  existingTimeout = timeout;
               })
               .setExecuteAsyncTimeout(opts.queryTimeout + 2000)
               .executeAsync(function(entriesSelector, timeout, asyncComplete) {

                  // Create helper function outside of loop
                  var jsonify = function(data) {
                     try {
                        return JSON.parse(data);
                     } catch (e) {
                        // Ignore
                     }
                     return data;
                  };

                  // Store the start-time and start the interval
                  var before = Date.now(),
                     intervalPointer = setInterval(function() {

                        // Perform the search and grab the payloads
                        var entries = document.querySelectorAll(entriesSelector),
                           dataObjs = Array.prototype.map.call(entries, function(entry) {

                              // Get raw attribute values
                              var method = entry.getAttribute("data-aikau-xhr-method"),
                                 url = entry.getAttribute("data-aikau-xhr-url"),
                                 requestHeaders = entry.getAttribute("data-aikau-xhr-request-headers"),
                                 requestBody = entry.getAttribute("data-aikau-xhr-request-body"),
                                 responseHeaders = entry.getAttribute("data-aikau-xhr-response-headers"),
                                 responseBody = entry.getAttribute("data-aikau-xhr-response-body");

                              return {
                                 request: {
                                    method: method,
                                    url: url,
                                    headers: jsonify(requestHeaders),
                                    body: jsonify(requestBody)
                                 },
                                 response: {
                                    headers: jsonify(responseHeaders),
                                    body: jsonify(responseBody)
                                 }
                              };
                           });

                        // Finish if we have data or if timeout exceeded
                        if (dataObjs.length || (Date.now() - before > timeout)) {
                           clearInterval(intervalPointer);
                           asyncComplete(dataObjs);
                        }

                     }, 50);

               }, [selectorBits.join(""), opts.queryTimeout])
               .then(function(entries) {

                  // Return value depends upon "pos" attribute
                  if (entries.length || opts.pos === "all") {

                     // Entries found, or empty collection acceptable
                     var returnValue = entries;
                     if (opts.pos === "first") {
                        returnValue = entries.pop();
                     } else if (opts.pos === "last") {
                        returnValue = entries.shift();
                     }
                     return returnValue;

                  } else {

                     // Construct the error message
                     var customMessage = messageIfError ? messageIfError + ": " : "",
                        url = opts.url || "ANY",
                        method = opts.method || "ANY",
                        errorMessage = "Unable to find a " + method + " to \"" + url + "\" with specified headers/body filter and timeout of " + opts.queryTimeout + "ms";

                     // Throw the error
                     throw new Error(customMessage + errorMessage);
                  }
               })
               .then(function(entries) {
                  browser.setExecuteAsyncTimeout(existingTimeout);
                  return entries;
               }, function(error) {
                  browser.setExecuteAsyncTimeout(existingTimeout);
                  throw error;
               });
         };
         command.session.tabToElement = function(selector, collectionIndex, maxTabs) {

            // Setup variables
            var tabbedToElement = false,
               numTabs = 0,
               dfd = new Promise.Deferred();

            // Sanitise arguments
            collectionIndex = collectionIndex || 0;
            maxTabs = maxTabs || 10;
            if (!selector) {
               throw new Error("No valid selector provided in tabToElement()");
            }

            // Define tabAndCheck function
            function tabAndCheck() {
               return browser.pressKeys(keys.TAB)
                  .execute(function(targetElemSelector, index) {
                     var targetElem = document.querySelectorAll(targetElemSelector)[index];
                     return targetElem && targetElem === document.activeElement;
                  }, [selector, collectionIndex])
                  .then(function(foundElem) {
                     if (typeof foundElem === "undefined") {
                        throw new Error("Unable to find target element with selector \"" + selector + "\" and index " + collectionIndex);
                     } else if (!foundElem && numTabs++ < maxTabs) {
                        return tabAndCheck();
                     } else if (!foundElem) {
                        throw new Error("Unable to tab to element with selector \"" + selector + "\" after " + maxTabs + " attempts");
                     } else {
                        return true;
                     }
                  });
            }

            // Tab until found
            tabAndCheck().then(function(foundElem) {
               dfd.resolve();
            }, function(err) {
               dfd.reject(err);
            });

            // Pass back the base promise
            return dfd.promise;
         };
         command.session.hasScrollbars = function(selector) {
            return browser.execute(function(cssSelector) {
               var elem = document.querySelectorAll(cssSelector)[0],
                  contentIsTaller = false,
                  contentIsWider = false,
                  canScrollVertically = false,
                  canScrollHorizontally = false,
                  computedStyle = elem && getComputedStyle(elem),
                  validOverflows = ["auto", "scroll"];
               if (computedStyle) {
                  contentIsTaller = elem.scrollHeight > elem.clientHeight;
                  contentIsWider = elem.scrollWidth > elem.clientWidth;
                  canScrollVertically = validOverflows.indexOf(computedStyle.overflowY) !== -1;
                  canScrollHorizontally = validOverflows.indexOf(computedStyle.overflowX) !== -1;
               }
               return {
                  vertical: contentIsTaller && canScrollVertically,
                  horizontal: contentIsWider && canScrollHorizontally
               };
            }, [selector]);
         };

         return command;
      },

      /**
       * Skip the supplied test if all the search strings are found in the environment
       *
       * @instance
       * @param {Object} testObj The test object (normally passed as "this")
       * @param {string} conditionType The condition type (only supported one atm is "environment")
       * @param {string|string[]} searchString The search strings, normalised to an array
       *                                       if just a single-string, which all must
       *                                       match for the test to skip
       */
      skipIf: function(testObj, conditionType, searchString) {
         if (conditionType !== "environment") {
            throw new Error("Unknown condition type in skipIf(): \"" + conditionType + "\"");
         }
         var parentTest = testObj,
            searchRegex = new RegExp(searchString, "i"),
            maxLoops = 5,
            loopIndex = 0,
            envName;
         do {
            envName = parentTest.name;
            if (loopIndex++ >= maxLoops) {
               throw new Error("Error finding root suite (too many loops)");
            }
         } while ((parentTest = parentTest.parent));
         if (searchRegex.test(envName)) {
            testObj.skip("Test skipped because test environment is \"" + envName + "\"");
         }
      },

      /**
       * Set browser timeouts - refer to Config files
       *
       * @instance
       * @param {browser}
       */
      _applyTimeouts: function(browser) {
         browser.setTimeout("script", Config.timeout.base);
         browser.setTimeout("implicit", Config.timeout.base);
         browser.setFindTimeout(Config.timeout.find);
         browser.setPageLoadTimeout(Config.timeout.pageLoad);
         browser.setExecuteAsyncTimeout(Config.timeout.executeAsync);
      },

      /**
       * Maximises the browser window if not already maximised
       *
       * @instance
       * @param {browser}
       */
      _maxWindow: function(browser) {
         // browser.maximizeWindow();
         browser.setWindowSize(null, 1024, 768);
      },

      /**
       * Cancels modifier keys
       *
       * @instance
       * @param {browser}
       */
      _cancelModifierKeys: function(browser) {
         browser.pressKeys(null);
      },

      /**
       * Internal function used to determine whether to use nth-child or last-child pseudo selector
       *
       * @instance
       * @param {number} expectedRow
       * @returns {string} The pseudo selector to use
       */
      _determineRow: function(expectedRow) {
         var row = "last-child";
         if (expectedRow !== "last")
         {
            row = "nth-child(" + expectedRow + ")";
         }
         return row;
      },

      /**
       * This generates a CSS selector that attempts to select a publication payload entry from the SubscriptionLog
       * widget. It's looking for a specific publish topic so could return multiple results.
       *
       * @instance
       * @param {string} publishTopic The topic published on
       * @param {string} key The key for the data
       * @param {string} value The value for the data
       * @returns {string} The CSS selector
       */
      pubDataCssSelector: function(publishTopic, key, value) {
         var selector = "" +
         "td[data-publish-topic='" + publishTopic + "'] + " +
         "td.sl-data > table > tr.sl-object-row > " +
         "td[data-pubsub-object-key=" + key + "] + " +
         "td[data-pubsub-object-value=\"" + value + "\"]";
         return selector;
      },

      pubDataRowsCssSelector: function(publishTopic, key) {
         var selector = "" +
            "tr.sl-row:last-child td[data-publish-topic='" + publishTopic + "'] + " +
            "td.sl-data tr.sl-object-row " +
            "td[data-pubsub-object-key=" + key + 
            "]+td > table > tr";
         return selector;
      },

      /**
       * This generates a CSS selector that attempts to select a publication payload entry from the SubscriptionLOg
       * widget where the payload contains a nested key/value pair that is the value of a key
       *
       * @instance
       * @param {string} publishTopic The topic published on
       * @param {string} key The key for the data
       * @param {string} nestedKey The key nested as the value for the data
       * @param {string} nestedValue The value of the nested data.
       * @returns {string} The CSS selector
       */
      pubDataNestedValueCssSelector: function(publishTopic, key, nestedKey, nestedValue) {
         var selector = "" +
            "td[data-publish-topic='" + publishTopic + "'] + " +
            "td.sl-data tr.sl-object-row " +
            "td[data-pubsub-object-key=" + key +
            "]+ td td[data-pubsub-object-key='" + nestedKey + "'] " +
            "+ td[data-pubsub-object-value='" + nestedValue + "']";
         return selector;
      },

      /**
       * This generates a CSS selector that attempts to select a publication payload entry from the SubscriptionLOg
       * widget where the payload contains a nested array that is the value of a key
       *
       * @instance
       * @param {string} publishTopic The topic published on
       * @param {string} key The key for the data
       * @param {string} arrayIndex The index of the nested array
       * @param {string} value The expected value of the nested data.
       * @returns {string} The CSS selector
       */
      pubDataNestedArrayValueCssSelector: function(publishTopic, key, arrayIndex, value) {
         var selector = "" +
            "td[data-publish-topic='" + publishTopic + "'] + " +
            "td.sl-data tr.sl-object-row " +
            "td[data-pubsub-object-key=" + key +
            "]+ td td[data-pubsub-object-value='" + value + "']:nth-child(" + arrayIndex + ")";
         return selector;
      },

      /**
       * This generates a CSS selector that attempts to select a publication payload entry from the SubscriptionLog
       * widget. It looks on a specific row of the table for an entry with a specific key/value pair. It's important to
       * remember that the first generated row will be 3 (!! THREE !!) because the index starts at 1 NOT 0 and the first
       * row is the header and the second row will be the publication indicating that the page has loaded.
       *
       * @instance
       * @param {number} expectedRow The row that the data is expected to be found in (can be set to "last")
       * @param {string} key The key for the data
       * @param {string} value The value for the data
       * @returns {string} The CSS selector
       */
      pubSubDataCssSelector: function(expectedRow, key, value) {
         var row = "";
         if (expectedRow === "any")
         {
            // Don't specify a row
         }
         else if (expectedRow === "last")
         {
            row = ":last-child";
         }
         else if (expectedRow !== "last")
         {
            row = ":nth-child(" + expectedRow + ")";
         }
         var selector = "" +
            ".alfresco-testing-SubscriptionLog tr.sl-row" + row +
            " td[data-pubsub-object-key=" + key +
            "]+td[data-pubsub-object-value='" + value + "']";
         return selector;
      },

      /**
       * Selects the data value element for a specific key in a specific row.
       * 
       * @instance
       * @param {number} expectedRow The row that the data is expected to be found in (can be set to "last")
       * @param {string} key The key for the data
       * @returns {string} The CSS selector
       */
      pubSubDataValueCssSelector: function(expectedRow, key) {
         var row = "";
         if (expectedRow === "any")
         {
            // Don't specify a row
         }
         else if (expectedRow === "last")
         {
            row = ":last-child";
         }
         else if (expectedRow !== "last")
         {
            row = ":nth-child(" + expectedRow + ")";
         }
         var selector = "" +
            ".alfresco-testing-SubscriptionLog tr.sl-row" + row +
            " td[data-pubsub-object-key=" + key +
            "]+td";
         return selector;
      },

      /**
       * This generates a CSS selector that gets the topic cell for a specific row
       *
       * @instance
       * @param {number} expectedRow The row to get the topic for
       */
      nthTopicSelector: function(expectedRow) {
         var row = this._determineRow(expectedRow);
         var selector = ".alfresco-testing-SubscriptionLog tr.sl-row:" + row + " td.sl-topic";
         // console.log("Selector: " + selector);
         return selector;
      },

      /**
       * This generates a CSS selector that attempts to find all elements that match a subscription topic entry from the
       * SubscriptionLog widget.
       *
       * @instance
       * @param {string} topic The topic to search
       * @param {string} type (optional) The topic action (e.g. "publish" or "subscribe") defaults to "subscribe"
       * @param {string} expectedRow (optional) A specific row to check for ("last" is an accepted option). Negative numbers trigger a backwards count.
       * @param {string} [matchType="exact"] Choose between a partial, prefix, suffix or exact match on topic.
       * @returns {string} The CSS selector
       */
      topicSelector: function(topic, type, expectedRow, matchType) {
         type = type || "subscribe";
         var row = "";
         if (expectedRow === "any")
         {
            // Don't specify a row
         }
         else if (expectedRow === "last")
         {
            row = ":last-child";
         }
         else if (expectedRow !== null && expectedRow !== undefined)
         {
            var rowSelector = "nth-child";
            if (expectedRow.indexOf("-") !== -1)
            {
               // If the expected row contains a negative number, count backwards. -1 is last, -2 is penultimate, etc.
               rowSelector = "nth-last-child";
               expectedRow = expectedRow.slice(1, expectedRow.length);
            }
            row = ":" + rowSelector + "(" + expectedRow + ")";
         }

         // Allow partial matching, match prefix or suffix.
         matchType = matchType || "exact";
         var comparison = "=";

         switch (matchType) {
            case "partial":
               comparison = "*=";
               break;
            case "prefix":
               comparison = "$=";
               break;
            case "suffix":
               comparison = "^=";
               break;
            default:
               comparison = "=";
         }

         var selector = ".alfresco-testing-SubscriptionLog tr.sl-row" + row + " td[data-" + type + "-topic" + comparison + topic + "]";
         // console.log("Topic selector: " + selector);
         return selector;
      },

      /**
       * This generates a CSS selector that attempts to find all elements that match a subscription topic entry from the
       * SubscriptionLog widget, and returns the associated data column.
       *
       * @instance
       * @param {string} topic The topic to search
       * @param {string} type (optional) The topic action (e.g. "publish" or "subscribe") defaults to "subscribe"
       * @param {string} expectedRow (optional) A specific row to check for ("last" is an accepted option). Negative numbers trigger a backwards count.
       * @param {string} [matchType="exact"] Choose between a partial, prefix, suffix or exact match on topic.
       * @returns {string} The CSS selector
       */
      topicDataSelector: function(topic, type, expectedRow, matchType) {
         return this.topicSelector(topic, type, expectedRow, matchType) + " + td.sl-data";
      },

      /**
       * This generates an xpath selector that matches the supplied value in the console log.
       *
       * @instance
       * @param {string} value The value to search for
       * @returns {string} The XPATH selector
       */
      consoleXpathSelector: function(value) {
         return "//table[@class=\"log\"]/tbody/tr[@class=\"cl-row\"]/td[contains(.,'" + value + "')]";
      },

      /**
       * This function provides common logging for tests
       *
       * @instance
       * @param {string} test The name of the test running
       * @param {string} desc The test description
       */
      log: function(test, desc) {
         console.log(">> " + test + ": " + desc);
      }
   };
});