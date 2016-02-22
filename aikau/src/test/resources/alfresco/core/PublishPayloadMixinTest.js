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
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!assert",
        "alfresco/TestCommon"],
        function (registerSuite, assert, TestCommon) {

   registerSuite(function(){
      var browser;

      return {
         name: "PublishPayloadMixin Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/PublishPayloadMixin", "PublishPayloadMixin Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Label is visible": function() {
            return browser.findByCssSelector("#PA_NO_TYPE .alfresco-renderers-PublishAction__label")
               .getVisibleText()
               .then(function(text) {
                  assert.equal(text, "Label");
               });
         },

         "Check that no search request is used when 'useHash' is enabled": function () {
            // Check that with minimal configuration we still get a payload published
            return browser.findByCssSelector("#PA_NO_TYPE")
               .click()
            .end()

            .getLastPublish("TOPIC1")
               .then(function(payload) {
                  assert.propertyVal(payload, "data1", "value1");
               });
         },

         "Check that CONFIGURED type payload is published (currentItem not mixed)": function() {
            // Check that setting the CONFIGURED type works and that the current item is NOT mixed into the payload...
            return browser.findByCssSelector("#PA_CONFIGURED")
               .click()
            .end()

            .getLastPublish("TOPIC2")
               .then(function(payload) {
                  assert.propertyVal(payload, "data2", "value2");
                  assert.notProperty(payload, "mixinData1", "CONFIGURED type payload failure mixed in current item unexpectedly");
               });
         },

         "Check that CONFIGURED type payload is published (currentItem mixed)": function() {
            // Check that setting the CONFIGURED type works and that the current item IS mixed into the payload...
            return browser.findByCssSelector("#PA_CONFIGURED_WITH_ITEM_MIXIN")
               .click()
            .end()

            .getLastPublish("TOPIC3")
               .then(function(payload) {
                  assert.propertyVal(payload, "data3", "value3");
                  assert.propertyVal(payload, "mixinData2", "mixinValue2", "CONFIGURED type payload didn't mixin in current item");
               });
         },

         "Check that CURRENT_ITEM type payload is published": function() {
            // Check that setting the CURRENT_ITEM type works...
            return browser.findByCssSelector("#PA_CURRENT_ITEM")
               .click()
            .end()

            .getLastPublish("TOPIC4")
               .then(function(payload) {
                  assert.notProperty(payload, "data4", "Configured payload should not be present");
                  assert.propertyVal(payload, "mixinData3", "mixinValue3", "CURRENT_ITEM type was not correct");
               });
         },

         "Check that PROCESS type payload is published": function() {
            // Check that setting the PROCESS type works...
            return browser.findByCssSelector("#PA_PROCESS")
               .click()
            .end()

            .getLastPublish("TOPIC5")
               .then(function(payload) {
                  assert.propertyVal(payload, "data5", "prefix_mixinValue4_postfix");
               });
         },

         // Check that single token payloads are processed correctly for Current Item tokens
         "Check that PROCESS CI type payload is published": function () {
            // Check that setting the PROCESS type works...
            return browser.findByCssSelector("#PA_PROCESS_CI_NOT_FOUND")
               .click()
            .end()

            .getLastPublish("TOPIC_CI_NOT_FOUND")
               .then(function(payload) {
                  assert.propertyVal(payload, "data", "{NOTFOUND}");
               });
         },
         
         // Check that single token payloads are processed correctly for instance tokens
         "Check that PROCESS INSTANCE type payload is published": function () {
            // Check that setting the PROCESS type works...
            return browser.findByCssSelector("#PA_PROCESS_INSTANCE_NOT_FOUND")
               .click()
            .end()

            .getLastPublish("TOPIC_INSTANCE_NOT_FOUND")
               .then(function(payload) {
                  assert.propertyVal(payload, "data", "{DOESNOTEXIST}");
                  assert.propertyVal(payload, "dataReplaced", "mixinValue4");
               });
         },

         "Check that BUILD type payload is published": function() {
            // Check that setting the BUILD type works...
            return browser.findByCssSelector("#PA_BUILD")
               .click()
            .end()

            .getLastPublish("TOPIC6")
               .then(function(payload) {
                  assert.propertyVal(payload, "itemData", "mixinValue5");
               });
         },

         "Check that PROPERTYLINK payload is published": function() {
            // Check the PropertyLink widget implements the mixin correctly
            return browser.findByCssSelector("#PROPERTYLINK span.inner")
               .click()
            .end()

            .getLastPublish("PROPERTY_LINK")
               .then(function(payload) {
                  assert.propertyVal(payload, "url", "site/abcdefg/dashboard");
               });
         },

         "Check that DATELINK payload is published": function() {
            // Check the DateLink widget implements the mixin correctly
            return browser.findByCssSelector("#DATELINK span.inner")
               .click()
            .end()

            .getLastPublish("DATE_LINK")
               .then(function(payload) {
                  assert.propertyVal(payload, "type", "PAGE_RELATIVE");
                  assert.propertyVal(payload, "url", "user/bgriffin/profile");
               });
         },
         
         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});