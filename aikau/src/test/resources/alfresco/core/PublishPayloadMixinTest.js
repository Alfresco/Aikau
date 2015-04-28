/**
 * Copyright (C) 2005-2015 Alfresco Software Limited.
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
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon"],
        function (registerSuite, assert, require, TestCommon) {

   var browser;
   registerSuite({
      name: "PublishPayloadMixin Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/PublishPayloadMixin", "PublishPayloadMixin Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Check that no search request is used when 'useHash' is enabled": function () {
         // Check that with minimal configuration we still get a payload published
         return browser.findByCssSelector("#PA_NO_TYPE")
            .click()
         .end()

         .findAllByCssSelector(TestCommon.topicSelector("TOPIC1", "publish", "last"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Minimal configuration publish failure");
            });
      },

      "Check that minimal configuration works": function() {
         return browser.findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "data1", "value1"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Minimal config payload failure");
            });
      },

      "Check that CONFIGURED type payload is published (currentItem not mixed)": function() {
         // Check that setting the CONFIGURED type works and that the current item is NOT mixed into the payload...
         return browser.findByCssSelector("#PA_CONFIGURED")
            .click()
         .end()

         .findAllByCssSelector(TestCommon.topicSelector("TOPIC2", "publish", "last"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "CONFIGURED type publish failure");
            });
      },

      "Check that minimal configuration works (CONFIGURED)": function() {
         return browser.findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "data2", "value2"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "CONFIGURED type payload failure");
            });
      },

      "Check that CONFIGURED type doesn't mixin current item without explicit config": function() {
         return browser.findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "mixinData1", "mixinValue1"))
            .then(function(elements) {
               assert.lengthOf(elements, 0, "CONFIGURED type payload failure mixed in current item unexpectedly");
            });
      },

      "Check that CONFIGURED type payload is published (currentItem mixed)": function() {
         // Check that setting the CONFIGURED type works and that the current item IS mixed into the payload...
         return browser.findByCssSelector("#PA_CONFIGURED_WITH_ITEM_MIXIN")
            .click()
         .end()

         .findAllByCssSelector(TestCommon.topicSelector("TOPIC3", "publish", "last"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "CONFIGURED type publish failure");
            });
      },

      "Check minimal configuration publication payload (CONFIGURED)": function() {
         return browser.findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "data3", "value3"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "CONFIGURED type payload failure");
            });
      },

      "Check that CONFIGURED type doesn't mixin current item without explicit config (mixin data 2)": function() {
         return browser.findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "mixinData2", "mixinValue2"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "CONFIGURED type payload didn't mixin in current item");
            });
      },

      "Check that CURRENT_ITEM type payload is published": function() {
         // Check that setting the CURRENT_ITEM type works...
         return browser.findByCssSelector("#PA_CURRENT_ITEM")
            .click()
         .end()

         .findAllByCssSelector(TestCommon.topicSelector("TOPIC4", "publish", "last"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "CURRENT_ITEM type publish failure");
            });
      },

      "Check that CURRENT_ITEM type doesn't include configured payload": function() {
         return browser.findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "data4", "value4"))
            .then(function(elements) {
               assert.lengthOf(elements, 0, "CURRENT_ITEM type payload failure");
            });
      },

      "Check that CURRENT_ITEM type payload is correct": function() {
         return browser.findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "mixinData3", "mixinValue3"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "CURRENT_ITEM type was not correct");
            });
      },

      "Check that PROCESS type payload is published": function() {
         // Check that setting the PROCESS type works...
         return browser.findByCssSelector("#PA_PROCESS")
            .click()
         .end()

         .findAllByCssSelector(TestCommon.topicSelector("TOPIC5", "publish", "last"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "PROCESS type publish failure");
            });
      },

      "Check that PROCESS is generated correctly": function() {
         return browser.findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "data5", "prefix_mixinValue4_postfix"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "PROCESS type payload failure");
            });
      },

      // Check that single token payloads are processed correctly for Current Item tokens
      "Check that PROCESS CI type payload is published": function () {
         // Check that setting the PROCESS type works...
         return browser.findByCssSelector("#PA_PROCESS_CI_NOT_FOUND")
            .click()
            .end()

            .findAllByCssSelector(TestCommon.topicSelector("TOPIC_CI_NOT_FOUND", "publish", "last"))
            .then(function (elements) {
               assert.lengthOf(elements, 1, "processCurrentItem type publish failure");
            });
      },

      "Check that PROCESS CI is generated correctly": function () {
         return browser.findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "data", "{NOTFOUND}"))
            .then(function (elements) {
               assert.lengthOf(elements, 1, "processCurrentItem type payload failure");
            });
      },

      // Check that single token payloads are processed correctly for instance tokens
      "Check that PROCESS INSTANCE type payload is published": function () {
         // Check that setting the PROCESS type works...
         return browser.findByCssSelector("#PA_PROCESS_INSTANCE_NOT_FOUND")
            .click()
            .end()

            .findAllByCssSelector(TestCommon.topicSelector("TOPIC_INSTANCE_NOT_FOUND", "publish", "last"))
            .then(function (elements) {
               assert.lengthOf(elements, 1, "processInstance type publish failure");
            });
      },

      "Check that PROCESS INSTANCE missing item is generated correctly": function () {
         return browser.findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "data", "{DOESNOTEXIST}"))
            .then(function (elements) {
               assert.lengthOf(elements, 1, "processInstance type payload failure");
            });
      },

      "Check that PROCESS INSTANCE found item is generated correctly": function () {
         return browser.findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "dataReplaced", "mixinValue4"))
            .then(function (elements) {
               assert.lengthOf(elements, 1, "processInstance type payload failure");
            });
      },

      "Check that BUILD type payload is published": function() {
         // Check that setting the BUILD type works...
         return browser.findByCssSelector("#PA_BUILD")
            .click()
         .end()

         .findAllByCssSelector(TestCommon.topicSelector("TOPIC6", "publish", "last"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "BUILD type publish failure");
            });
      },

      "Check that BUILD type payload was correct": function() {
         return browser.findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "itemData", "mixinValue5"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "BUILD type payload failure");
            });
      },

      "Check that PROPERTYLINK payload is published": function() {
         // Check the PropertyLink widget implements the mixin correctly
         return browser.findByCssSelector("#PROPERTYLINK span.inner")
            .click()
         .end()

         .findAllByCssSelector(TestCommon.topicSelector("PROPERTY_LINK", "publish", "last"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "PROPERTYLINK publish failure");
            });
      },

      "Check that PROPERTYLINK type payload was correct": function() {
         return browser.findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "type", "SHARE_PAGE_RELATIVE"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "PROPERTYLINK type payload failure");
            });
      },

      "Check that PROPERTYLINK url payload was correct": function() {
         return browser.findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "url", "site/abcdefg/dashboard"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "PROPERTYLINK url payload failure");
            });
      },

      "Check that DATELINK payload is published": function() {
         // Check the DateLink widget implements the mixin correctly
         return browser.findByCssSelector("#DATELINK span.inner")
            .click()
         .end()

         .findAllByCssSelector(TestCommon.topicSelector("DATE_LINK", "publish", "last"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "DATELINK publish failure");
            });
      },

      "Check that DATELINK type payload was correct": function() {
         return browser.findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "type", "SHARE_PAGE_RELATIVE"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "DATELINK type payload failure");
            });
      },

      "Check that DATELINK url payload was correct": function() {
         return browser.findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "url", "user/bgriffin/profile"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "DATELINK url payload failure");
            });
      },



      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });
});