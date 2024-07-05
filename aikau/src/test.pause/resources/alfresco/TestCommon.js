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
      "safe-json-serialiser",
      "alfresco/_SubscriptionLogMixin",

      // This just needs to be loaded, not referenced
      "alfresco/CustomCommand"
   ],
   function(fs, http, os, propertiesReader, process, lang, intern, Config, Promise, pollUntil, assert, keys, _, safeJson, _SubscriptionLogMixin) {

      // This file-logging function can be used during debugging testing
      var logFilename = process.cwd() + "/test_reports/TestCommon.log",
         logToFile = function(message) {
            var timestamp = "[" + (new Date()).toISOString() + "] ";
            fs.appendFileSync(logFilename, timestamp + message + os.EOL, "utf8");
         };

      // Calculate this machine's (i.e. the server's) best IP address. Preference is given to
      // VM tunnel (which will work everywhere) and then an ethernet interface.
      var serverIP = (function() {

         // Setup variables
         var networkInterfaces = os.networkInterfaces(),
            interfaceNames = Object.keys(networkInterfaces),
            vmInterface,
            localInterface,
            fallbackInterface;

         // Analyse all interfaces
         interfaceNames.forEach(function(interfaceName) {
            var lowerName = interfaceName && interfaceName.toLowerCase();
            networkInterfaces[interfaceName].forEach(function(nextInterface) {
               /*jshint noempty:false*/
               if (nextInterface.family === "IPv4" && !nextInterface.internal) {
                  if (!lowerName) {
                     // Ignore unnamed interfaces
                  } else if (lowerName.indexOf("vbox") === 0) {
                     vmInterface = nextInterface;
                     vmInterface.name = interfaceName;
                  } else if (lowerName.indexOf("virtual") === 0) {
                     vmInterface = nextInterface;
                     vmInterface.name = interfaceName;
                  } else if (lowerName.indexOf("eth") === 0) {
                     localInterface = nextInterface;
                     localInterface.name = interfaceName;
                  } else if (lowerName.indexOf("en") === 0) {
                     localInterface = nextInterface;
                     localInterface.name = interfaceName;
                  } else {
                     fallbackInterface = nextInterface;
                     fallbackInterface.name = interfaceName;
                  }
               }
            });
         });

         // Choose prioritised interface
         var chosenInterface = vmInterface || localInterface || fallbackInterface;

         // Pass back the IP
         return chosenInterface.address;
      })();

      // Define main object and apply mixins (at bottom of file)
      return lang.mixin({

         /**
          * Generates the URL to use for loading unit test WebScripts
          *
          * @instance
          * @param {string} webScriptURL The WebScript URL
          * @param {string} webScriptPrefix Optional prefix to the test page.
          */
         generateWebscriptUrl: function(webScriptURL, webScriptPrefix) {
            var prefix = webScriptPrefix || "/tp/ws";
            return "http://" + serverIP + ":8089/aikau/page" + prefix + webScriptURL;
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
            if (tokens) {
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
          * @param {string} webScriptURL The URL of the test WebScript
          * @param {string} suiteName The name of the suite we're loading in
          * @param {string} webScriptPrefix Optional prefix to use before the WebScript URL
          * @param {boolean} noPageLoadError Optional boolean to suppress page load failure errors
          */
         loadTestWebScript: function(browser, webScriptURL, suiteName, webScriptPrefix, noPageLoadError) {

            // Apply config
            this._applyTimeouts(browser);
            this._maxWindow(browser);

            // Load the webpage
            var pageUrl = this.generateWebscriptUrl(webScriptURL, webScriptPrefix),
               command = browser.get(pageUrl)
               .then(pollUntil(
                  function() {
                     /*jshint browser:true*/
                     var elements = document.getElementsByClassName("aikau-reveal");
                     return elements.length > 0 ? true : null;
                  }, null, 10000))
               .then(
                  function(element) {},
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
                     if (noPageLoadError === true) {
                        // Don't output an error message
                     } else {
                        assert.fail(null, null, "Test page could not be loaded");
                     }
                  })
               .end();

            // Set session-specific variables
            command.session.screenieIndex = 0;
            command.session.suiteName = suiteName;

            // Pass back the browser/command variable
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
          * This function provides common logging for tests
          *
          * @instance
          * @param {string} test The name of the test running
          * @param {string} desc The test description
          */
         log: function(test, desc) {
            console.log(">> " + test + ": " + desc);
         }

         // Add mixins
      }, _SubscriptionLogMixin);
   });