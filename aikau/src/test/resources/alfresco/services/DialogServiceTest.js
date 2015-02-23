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
        function(registerSuite, assert, require, TestCommon) {

   var pause = 200;
   var browser;
   registerSuite({
      name: "Dialog Service Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/DialogService", "Dialog Service Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      teardown: function() {
         browser.end().alfPostCoverageResults(browser);
      },

      "Test that dialog with no ID can be created": function() {
         return browser.findByCssSelector("#CREATE_FORM_DIALOG_NO_ID")
            .click()
         .end()
         .findByCssSelector(".alfresco-dialog-AlfDialog")
            .then(null, function() {
               assert(false, "The Dialog did not appear");
            });
      },

      "Test publication on dialog show": function() {
         return browser.findAllByCssSelector(TestCommon.topicSelector("DISPLAYED_FD1", "publish", "any"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Could not find topic published when displayed dialog");
            });
      },

      "Test recreating dialog with no ID": function() {
         // Cancel the open dialog...
         return browser.findByCssSelector("#FD1 .cancellationButton")
            .click()
         .end()
         .sleep(pause) // TODO: Need a better way to wait for dialog to be hidden
         // Create a new one...
         .findByCssSelector("#CREATE_FORM_DIALOG_NO_ID")
            .click()
         .end()
         .findAllByCssSelector(".alfresco-dialog-AlfDialog")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "The previous dialog without an ID was not destroyed");
            });
      },

      "Test creating dialog with an ID": function() {
         // Close the open dialog...
         return browser.findByCssSelector("#FD1 .cancellationButton")
            .click()
         .end()
         .sleep(pause) // TODO: Need a better way to wait for dialog to be hidden
         .findByCssSelector("#CREATE_FORM_DIALOG")
            .click()
         .end()
         .findAllByCssSelector(".alfresco-dialog-AlfDialog")
            .then(function(elements) {
               assert.lengthOf(elements, 2, "The previous dialog (without an ID) was destroyed");
            });
      },

      "Test recreating dialig with an ID": function() {
         return browser.findByCssSelector("#FD2 .cancellationButton")
            .click()
         .end()
         .sleep(pause) // TODO: Need a better way to wait for dialog to be hidden
         .findByCssSelector("#CREATE_FORM_DIALOG")
            .click()
         .end()
         .findAllByCssSelector(".alfresco-dialog-AlfDialog")
            .then(function(elements) {
               assert.lengthOf(elements, 2, "The previous dialog (without an ID) was destroyed");
            });
      },

      "Test that updated value is included in post": function() {
         // Type a value into the field...
         return browser.findByCssSelector("#TB2 .dijitInputContainer input")
            .clearValue()
            .type("Some value")
         .end()

         // Post the form...
         .findByCssSelector("#FD2 .confirmationButton > span")
            .click()
         .end()

         // Check the values have been set
         .findAllByCssSelector(TestCommon.pubDataCssSelector("POST_DIALOG_2", "text", "Some value"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Textbox value was not posted");
            });
      },

      "Test that additional data is included in post": function() {
         // Type a value into the field...
         return browser.findAllByCssSelector(TestCommon.pubDataCssSelector("POST_DIALOG_2", "bonusData", "test"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Additional data was not posted");
            });
      }
   });
});