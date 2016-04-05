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
 * This test generates some variations on AlfSearchResult to test the various if statements in the rendering widgets involved
 *
 * @author Dave Draper
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"],
        function(module, defineSuite, assert, TestCommon, keys) {

   var actionsSelectors = TestCommon.getTestSelectors("alfresco/renderers/Actions");
   defineSuite(module, {
      name: "AlfSearchResult Tests",
      testPage: "/AlfSearchResult",

      "Correct number of rows is shown": function() {
         return this.remote.findAllByCssSelector(".alfresco-search-AlfSearchResult")
            .then(function(elements) {
               assert.lengthOf(elements, 12, "Wrong number of results rendered");
            });
      },

      "Clicked result becomes focused": function() {
         var activeElementId;
         return this.remote.findByCssSelector(".alfresco-search-AlfSearchResult:last-child")
            .click()
            .end()

         .getActiveElement()
            .then(function(element) {
               activeElementId = element.elementId;
            })
            .end()

         .findByCssSelector(".alfresco-search-AlfSearchResult:last-child")

         .then(function(element) {
            assert.equal(element.elementId, activeElementId, "The clicked element has not become focused");
         });
      },

      "Event result opens correct date in calendar": function() {
         return this.remote.findByCssSelector(".alfresco-search-AlfSearchResult:last-child .nameAndTitleCell .alfresco-renderers-PropertyLink > .inner")
            .click()
            .end()

         .getLastPublish("ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "url", "site/eventResult/calendar?date=2015-04-01", "Did not navigate to correct page");
            });
      },

      "Click on folder link container ampersand": function() {
         return this.remote.findByCssSelector(".alfresco-search-AlfSearchResult:first-child .nameAndTitleCell .alfresco-renderers-PropertyLink > .inner")
            .click()
            .end()

         .getLastPublish("ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "url", "site/normalResult/documentlibrary?path=%2Fone%2Ftwo%2Fthree%2Ffour%2Ftest1%20%26%20test2", "Special characters were not encoded");
            });
      },

      "Click on 'In folder' link": function() {
         return this.remote.findByCssSelector(".alfresco-search-AlfSearchResult:first-child .pathCell .alfresco-renderers-PropertyLink > .inner")
            .click()
            .end()

         .getLastPublish("ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "url", "site/normalResult/documentlibrary?path=%2F%2Fone%2Ftwo%2Fthree%2Ffour", "In folder link goes to the correct path");
            });
      },

      "Site link uses correct landing page URL": function() {
         return this.remote.findByCssSelector("#SEARCH_RESULTS_ITEMS .alfresco-search-AlfSearchResult:last-child .siteCell .alfresco-renderers-PropertyLink .inner")
            .clearLog()
            .click()
            .end()

         .getLastPublish("ALF_NAVIGATE_TO_PAGE", true)
            .then(function(payload) {
               assert.propertyVal(payload, "url", "site/eventResult/landing");
            });
      },

      "Check merged actions": function() {
         var actionSelector = TestCommon.getTestSelector(actionsSelectors, "label", ["SR_ACTIONS"]);
         return this.remote.findByCssSelector(actionSelector)
            .moveMouseTo(1, 1)
            .click()
            .end()

         .findById("SR_ACTIONS_CUSTOM3")
            .end()

         .findById("SR_ACTIONS_MANAGE_ASPECTS");
      },

      // See AKU-769 - Need to check left mouse clicks and left mouse clicks with control key depressed...
      // Middle button clicks SHOULD be tested but Leadfoot API is failing to generate correct event (manually
      // verified testing shows it working though)...

      "Left click name goes to current target": function() {
         return this.remote.findByCssSelector("#SR_DISPLAY_NAME .value")
            .click()
            .end()
            .getLastPublish("ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "target", "CURRENT", "Name link should use CURRENT target");
            })
            .clearLog();
      },

      "Left click site goes to current target": function() {
         return this.remote.findByCssSelector("#SR_SITE .value")
            .click()
            .end()
            .getLastPublish("ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "target", "CURRENT", "Site link should use CURRENT target");
            })
            .clearLog();
      },

      "Left click path goes to current target": function() {
         return this.remote.findByCssSelector("#SR_PATH .value")
            .click()
            .end()
            .getLastPublish("ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "target", "CURRENT", "Path link should use CURRENT target");
            })
            .clearLog();
      },

      "Left click date goes to current target": function() {
         return this.remote.findByCssSelector("#SR_DATE .value")
            .click()
            .end()
            .getLastPublish("ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "target", "CURRENT", "Date link should use CURRENT target");
            })
            .clearLog();
      },

      "Control click name goes to new target": function() {
         return this.remote.findByCssSelector("#SR_DISPLAY_NAME .value")
            .pressKeys([keys.CONTROL])
            .click()
            .pressKeys(keys.NULL)
            .end()
            .getLastPublish("ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "target", "NEW", "Control click name link should use NEW target");
            })
            .clearLog();
      },

      "Control click site goes to new target": function() {
         return this.remote.findByCssSelector("#SR_SITE .value")
            .pressKeys([keys.CONTROL])
            .click()
            .pressKeys(keys.NULL)
            .end()
            .getLastPublish("ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "target", "NEW", "Control click site link should use NEW target");
            })
            .clearLog();
      },

      "Control click path goes to new target": function() {
         return this.remote.findByCssSelector("#SR_PATH .value")
            .pressKeys([keys.CONTROL])
            .click()
            .pressKeys(keys.NULL)
            .end()
            .getLastPublish("ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "target", "NEW", "Control click path link should use NEW target");
            })
            .clearLog();
      },

      "Control click date goes to new target": function() {
         return this.remote.findByCssSelector("#SR_DATE .value")
            .pressKeys([keys.CONTROL])
            .click()
            .pressKeys(keys.NULL)
            .end()
            .getLastPublish("ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "target", "NEW", "Control click date link should use NEW target");
            })
            .clearLog();
      }
   });

   defineSuite(module, {
      name: "AlfSearchResult Tests (navigation overrides)",
      testPage: "/AlfSearchResult?override=navigation",

      "Name goes to new target": function() {
         return this.remote.findByCssSelector("#SR_DISPLAY_NAME .value")
            .click()
            .end()
            .getLastPublish("ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "target", "NEW", "Name link should use NEW target");
            })
            .clearLog();
      },

      "Site goes to new target": function() {
         return this.remote.findByCssSelector("#SR_SITE .value")
            .click()
            .end()
            .getLastPublish("ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "target", "NEW", "Name link should use NEW target");
            })
            .clearLog();
      },

      "Path goes to new target": function() {
         return this.remote.findByCssSelector("#SR_PATH .value")
            .click()
            .end()
            .getLastPublish("ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "target", "NEW", "Name link should use NEW target");
            })
            .clearLog();
      },

      "Date goes to new target": function() {
         return this.remote.findByCssSelector("#SR_DATE .value")
            .click()
            .end()
            .getLastPublish("ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "target", "NEW", "Name link should use NEW target");
            })
            .clearLog();
      }
   });
});