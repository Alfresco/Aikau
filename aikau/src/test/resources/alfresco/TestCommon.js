/**
 * Copyright (C) 2005-2014 Alfresco Software Limited.
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
        "config/Config",
        "intern/dojo/node!leadfoot/helpers/pollUntil",
        "intern/lib/args",
        "intern/chai!assert"], 
       function(fs, Config, pollUntil, args, assert) {
   return {

      /**
       * Path configurations.
       */
      paths: {
         bootstrapPath: "/share/page/tp/ws/unit-test-bootstrap",
         moduleDeploymentPath: "/share/page/modules/deploy"
      },

      /**
       * This is the URL to use to bootstrap tests. It is composed of the paths.bootstrapPath and the 
       * Config.urls.bootstrapBaseUrl which is provided in the config package.
       *
       * @instance
       * @type {string}
       * @default Config.url.bootstrapBaseUrl + this.paths.bootstrapPath
       */
      bootstrapUrl: function bootstrapUrl(){
         return Config.urls.bootstrapBaseUrl + this.paths.bootstrapPath;
      },

      /**
       * Generates the URL to use for loading unit test WebScripts
       *
       * @instance
       * @param {string} webScriptURL The WebScript URL
       */
      testWebScriptURL: function (webScriptURL) {
         return Config.urls.unitTestAppBaseUrl + "/aikau/page/tp/ws" + webScriptURL;
      },

      /**
       * This is the URL to use to access the module deployment screen. It is composed of the 
       * paths.moduleDeploymentPath and the Config.urls.bootstrapBaseUrl which is provided in the config package.
       *
       * @instance
       * @type {string}
       * @default Config.url.bootstrapBaseUrl + this.paths.moduleDeploymentPath
       */
      moduleDeploymentUrl: function moduleDeploymentUrl(){
         return Config.urls.moduleDeploymentBaseUrl + this.paths.moduleDeploymentPath;
      },

      /**
       * Loads and returns a page mode. This uses the Node provided readFileSync function which
       * is a synchronous call to load the requested resource into a variable. 
       *
       * @instance
       * @param {string} fileName The path to the file containing the page model to be loaded.
       */
      loadPageModel: function(fileName) {
         var fileContent;
         try
         {
            fileContent = fs.readFileSync(fileName, 'utf-8');
         }
         catch (e)
         {
            console.log("############################################");
            console.log("#                                          #");
            console.log("# AN ERROR OCCURRED READING THE PAGE MODEL #");
            console.log("#                                          #");
            console.log("############################################");
            console.log(e);
         }
         return fileContent;
      },

      /**
       *
       *
       * @instance
       * @param {object} browser The browser context to use
       * @param {string} testWebScriptURL The URL of the test WebScript
       * @param {string} testName The name of the test to run
       */
      loadTestWebScript: function (browser, testWebScriptURL, testName) {
         this._applyTimeouts(browser);
         this._maxWindow(browser);
         this._cancelModifierKeys(browser);
         if(testName && browser.environmentType.browserName)
         {
            console.log(">> Starting '" + testName + "' on " + browser.environmentType.browserName);
         }
         var command = browser.get(this.testWebScriptURL(testWebScriptURL))
            .then(pollUntil(
               function() {
                  var elements = document.getElementsByClassName("aikau-reveal");
                  return elements.length > 0 ? true : null;
               }, [], 10000, 1000))
            .then(
               function (element) {
               }, 
               function (error) {
                  console.log(">> Test page for '" + testName + "'  failed to load, trying again...");
                  browser.refresh();
               })
            .then(pollUntil(
               function() {
                  var elements = document.getElementsByClassName("aikau-reveal");
                  return elements.length > 0 ? true : null;
               }, [], 10000, 1000))
            .then(
               function (element) {
                  console.log(">> Test page for '" + testName + "' loaded successfully");
               }, 
               function (error) {
                  console.log(">> Test page for '" + testName + "'  failed to load after two attempts");
                  assert(false, "Test page could not be loaded");
               })
            .end();

         // Add in a custom command for posting code coverage...
         command.session.alfPostCoverageResults = function (browser) {
            if(args.doCoverage === "true")
            {
               return browser
                  .findByCssSelector('.alfresco-testing-TestCoverageResults button')
                     .click()
                     .sleep(5000)
                  .end()
                  .findByCssSelector('.alfresco-testing-TestCoverageResults input[type=submit]')
                     .click()
                  .end()
                  .then(pollUntil(
                     function() {
                        var result = (document && document.body && document.body.firstChild.innerHTML === "OK");
                        return result ? true : null;
                     }, [], 5000))
                  .then(
                     function (element) {
                        console.log(">> Converage successfully posted");
                     }, 
                     function (error) {
                        console.log(">> Coverage post failed");
                     }
                  )
               .end();
            }
            else
            {
               return browser;
            }
         };
         return command;
      },

      /**
       * This function should be called at the start of each unit test. It calls the bootstrap test page
       * and enters the test data into the textarea and clicks the "Test" button which will load the 
       * test model in a new page. The unit test can then run against that page.
       *
       * @instance
       * @param {object} browser This should be the the "remote" attribute from the unit test
       * @param {string} testPageDefinitionFile This should be the path to the resource that contains
       * the JSON definition of the page to test.
       * @returns {promise} The promise for continuing the unit test.
       */
      bootstrapTest: function(browser, testPageDefinitionFile, testname) {

         this._applyTimeouts(browser);
         this._maxWindow(browser);
         this._cancelModifierKeys(browser);

         if(testname && browser.environmentType.browserName)
         {
            console.log(">> Starting '" + testname + "' on " + browser.environmentType.browserName);
         }

         // Load the model definition file
         // It's necessary to remove any carriage returns and new line characters from the page model otherwise the eval statement will cause an error...
         var pageModel;
         try
         {
            pageModel = (this.loadPageModel(testPageDefinitionFile)).replace(/[\n\r]/g, "");
         }
         catch (e)
         {
            console.log("###############################################");
            console.log("#                                             #");
            console.log("# AN ERROR OCCURRED PROCESSING THE PAGE MODEL #");
            console.log("#                                             #");
            console.log("###############################################");
            console.log(e);
         }

         return browser

         .get(this.bootstrapUrl())
            .then(pollUntil('return document.getElementsByClassName("allWidgetsProcessed");'))
            .then(function (element) {}, function (error) {})
            .end()

         .execute("dijit.registry.byId('UNIT_TEST_MODEL_FIELD').setValue('" + pageModel + "');'set';")
            .findByCssSelector('#UNIT_TEST_MODEL_FIELD TEXTAREA')
            .type(" ")
            .end()

         .findById("LOAD_TEST_BUTTON")
            .click()
            .end()

         .then(pollUntil('return document.getElementsByClassName("aikau-reveal");'))
            .then(function (element) {}, function (error) {})
            .end();
      },

      /**
       * This function enables the debug module on the server to make sure debug logging is available for
       * use in functional test.
       *
       * @instance
       * @param {object} browser This should be the the "remote" attribute from the unit test
       * @returns {promise} The promise for continuing the unit test.
       */
      enableDebugModule: function(browser) {

         this._applyTimeouts(browser);
         this._cancelModifierKeys(browser);

         console.log(">> Enabling debug via Debug Enabler Extension");

         return browser.get(this.moduleDeploymentUrl())
            .end()

         .findByCssSelector("select[name='undeployedModules'] > option[value*='Debug Enabler Extension']")
            .click()
            .end()

         .findByCssSelector("td > input[value='Add']")
            .click()
            .end()

         .findByCssSelector("input[value='Apply Changes']")
            .click()
            .end();
         
//       this._applyTimeouts(browser);
//       this._maxWindow(browser);
//       console.log(">> Enabling debug via Debug Enabler Extension");
//
//       browser.get(this.moduleDeploymentUrl()).end();
//
//       var hasEnabler = true;
//       browser.hasElementByCssSelector("select[name='undeployedModules'] > option[value*='Debug Enabler Extension']")
//       .then(function(has){
//          console.log(has);
//       })
//       .end();
//
//       if(hasEnabler)
//       {
//          browser.findByCssSelector("select[name='undeployedModules'] > option[value*='Debug Enabler Extension']").click().end();
//          browser.findByCssSelector("td > input[value='Add']").click().end();
//          browser.findByCssSelector("input[value='Apply Changes']").click().end();
//       }
//
//       return browser;

      },

      /**
       * This function disables the debug module on the server.
       *
       * @instance
       * @param {object} browser This should be the the "remote" attribute from the unit test
       * @returns {promise} The promise for continuing the unit test.
       */
      disableDebugModule: function(browser) {

         this._applyTimeouts(browser);
         this._cancelModifierKeys(browser);

         console.log(">> Disabling debug via Debug Enabler Extension");

         return browser.get(this.moduleDeploymentUrl())
            .end()

         .findByCssSelector("select[name='deployedModules'] > option[value*='Debug Enabler Extension']")
            .click()
            .end()

         .findByCssSelector("td > input[value='Remove']")
            .click()
            .end()

         .findByCssSelector("input[value='Apply Changes']")
            .click()
            .end();
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
         if (expectedRow != "last")
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
            "td.sl-data tr.sl-object-row " +
            "td[data-pubsub-object-key=" + key + 
            "]+td[data-pubsub-object-value='" + value + "']";
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
         if (expectedRow == "any")
         {
            // Don't specify a row
         }
         else if (expectedRow == "last")
         {
            row = ":last-child";
         }
         else if (expectedRow != "last")
         {
            row = ":nth-child(" + expectedRow + ")";
         }

         var selector = "" +
            ".alfresco-testing-SubscriptionLog tr.sl-row" + row +
            " td[data-pubsub-object-key=" + key + 
            "]+td[data-pubsub-object-value='" + value + "']";
         // console.log("Topic selector: " + selector);

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

         if (type == null)
         {
            type = "subscribe";
         }

         var row = "";
         if (expectedRow == "any")
         {
            // Don't specify a row
         }
         else if (expectedRow == "last")
         {
            row = ":last-child";
         }
         else if (expectedRow != null)
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
       * This function searches for the button to post test coverage results to the "node-coverage"
       * server. It should be called at the end of each unit test
       *
       * @instance
       * @param {object} browser This should be set to a reference to "this.remote" from the unit test
       * @param {boolean} loadCoverageForm Choose to optionally navigate to the JustCoverage model before posting coverage data
       */
      postCoverageResults: function(browser, loadCoverageForm) {
         if(args.doCoverage === "true")
         {
            
            if(loadCoverageForm)
            {
               this.bootstrapCoverageForm(browser);
               console.log(">> Coverage form loaded");
            }

            return browser.end()

            .findByCssSelector('.alfresco-testing-TestCoverageResults button')
               .click()
               .sleep(5000)
            .end()

            .findByCssSelector('.alfresco-testing-TestCoverageResults input[type=submit]')
               .click()
            .end()
            
            .then(function() {
               console.log(">> Waiting for coverage submission to complete...");
            });
         }
         else
         {
            return browser.end();
         }
      },

      /**
       * This function loads the JustCoverage model to provide a code coverage submission form. This can be 
       * used when a test navigates away from the test framework and an already rendered coverage form is 
       * now missing.
       *
       * @instance
       * @param {object} browser This should be the the "remote" attribute from the unit test
       * @returns {promise} The promise for continuing the unit test.
       */
      bootstrapCoverageForm: function(browser) {
         return this.bootstrapTest(browser, "./tests/alfresco/page_models/JustCoverage.json", "JustCoverage")
            .sleep(1000)
            .end();
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