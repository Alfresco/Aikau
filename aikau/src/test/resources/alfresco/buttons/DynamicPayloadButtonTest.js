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
 *
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon"],
      function (registerSuite, assert, require, TestCommon) {

registerSuite(function(){
   var browser;

   return {
      name: "Dynamic Payload Button Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/dynamicPayloadButton#initial=test", "Dynamic Payload Button Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Check the original payload": function() {
         return browser.findByCssSelector("#DYNAMIC_BUTTON_label")
            .click()
         .end()
         .findByCssSelector(TestCommon.pubSubDataValueCssSelector("last", "value"))
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Original Value", "The original payload value has been changed unexpectedly");
            });
      },

      "Check the original hash based payload": function() {
         return browser.findByCssSelector("#DYNAMIC_BUTTON_2_label")
            .click()
         .end()
         .findByCssSelector(TestCommon.pubSubDataValueCssSelector("last", "initial"))
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "test", "The original payload value has been changed unexpectedly");
            });
      },

      "Override the complete payload": function() {
         return browser.findByCssSelector("#FULL_OVERRIDE_label")
            .click()
         .end()
         .findByCssSelector("#DYNAMIC_BUTTON_label")
            .click()
         .end()
         .findByCssSelector(TestCommon.pubSubDataValueCssSelector("last", "value"))
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Override 1", "The original payload value was not updated");
            });
      },

      "Mixin in values and override": function() {
         return browser.findByCssSelector("#MIXIN_WITH_OVERRIDES_label")
            .click()
         .end()
         .findByCssSelector("#DYNAMIC_BUTTON_label")
            .click()
         .end()
         .findByCssSelector(TestCommon.pubSubDataValueCssSelector("last", "value"))
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Override 2", "The original payload value was not updated");
            });
      },

      "Check additional data was included in payload": function() {
         return browser.findAllByCssSelector(TestCommon.pubDataNestedValueCssSelector("DYNAMIC_BUTTON_TOPIC", "additional", "data", "extra data"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Additional data was not found");
            });
      },

      "Mixin in values without an override": function() {
         return browser.findByCssSelector("#MIXIN_NO_OVERRIDES_label")
            .click()
         .end()
         .findByCssSelector("#DYNAMIC_BUTTON_label")
            .click()
         .end()
         .findByCssSelector(TestCommon.pubSubDataValueCssSelector("last", "value"))
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Override 2", "The previously updated payload value changed again unexpectedly");
            });
      },

      "Check additional data  performs override": function() {
         return browser.findAllByCssSelector(TestCommon.pubDataNestedValueCssSelector("DYNAMIC_BUTTON_TOPIC", "additional", "data", "bonus data"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Additional data was not found");
            });
      },

      "Override via has update": function() {
         return browser.findByCssSelector("#HASH_OVERRIDE_label")
            .click()
         .end()
         .findByCssSelector("#DYNAMIC_BUTTON_label")
            .click()
         .end()
         .findByCssSelector(TestCommon.pubSubDataValueCssSelector("last", "value"))
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Override3", "The previously updated payload value was not updated via hash change");
            });
      },

      "Add extra data via has update": function() {
         return browser.findByCssSelector("#HASH_OVERRIDE_EXTRA_label")
            .click()
         .end()
         .findByCssSelector("#DYNAMIC_BUTTON_label")
            .click()
         .end()
         .findAllByCssSelector(TestCommon.pubDataNestedValueCssSelector("DYNAMIC_BUTTON_TOPIC", "additional", "hash", "hashData"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Additional data provided via hash was not found");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});