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
        function(registerSuite, assert, require, TestCommon) {

   // Get the options labels using:
   //    #FIXED_INVALID_CHANGES_TO_CONTROL_dropdown .dijitMenuItemLabel

   // Get the drop-down arrow to option the menu using:
   //    #FIXED_INVALID_CHANGES_TO .dijitArrowButtonInner

   // Get the current label using the following:
   //    #FIXED_INVALID_CHANGES_TO span[role=option]

   // Get specific menu option:
   //    #FIXED_INVALID_CHANGES_TO_CONTROL_dropdown table tr:nth-child(1) td.dijitMenuItemLabel

registerSuite(function(){
   var browser;

   return {
      name: "Select Menu Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/Select", "Select Form Control Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Test Label Rendering": function() {
         return browser.findByCssSelector("#FIXED_INVALID_CHANGES_TO .label")
            .getVisibleText()
            .then(function(resultText) {
               assert.equal(resultText, "Fixed Options", "The label was not rendered correctly");
            });
      },

      "Test initial value of fixed config": function() {
         return browser.findByCssSelector("#FIXED_INVALID_CHANGES_TO span[role=option]")
            .getVisibleText()
            .then(function(resultText) {
               assert.equal(resultText, "Two", "The initial value was not represented correctly");
            });
      },

      "Test fixed options count": function() {
         return browser.findByCssSelector("#FIXED_INVALID_CHANGES_TO .dijitArrowButtonInner")
            .click()
            .end()

         .findAllByCssSelector("#FIXED_INVALID_CHANGES_TO_CONTROL_dropdown .dijitMenuItemLabel")
            .then(function(elements) {
               assert.lengthOf(elements, 3, "Incorrect number of fixed options found");
            });
      },

      "Test fixed option label rendering": function() {
         return browser.findByCssSelector("#FIXED_INVALID_CHANGES_TO_CONTROL_dropdown table tr:nth-child(1) td.dijitMenuItemLabel")
            .getVisibleText()
            .then(function(resultText) {
               assert.equal(resultText, "Priv\u00e9", "Fixed label not set correctly");
            });
      },

      "Test fixed option label set from value": function() {
         return browser.findByCssSelector("#FIXED_INVALID_CHANGES_TO_CONTROL_dropdown table tr:nth-child(3) td.dijitMenuItemLabel")
            .getVisibleText()
            .then(function(resultText) {
               assert.equal(resultText, "NO LABEL", "Fixed label not set correctly from value");
            });
      },

      "Test initial value of pub sub option": function() {
         return browser.findByCssSelector(".confirmationButton > span")
            .click()
            .end()

         .findAllByCssSelector(TestCommon.pubDataCssSelector("UNIT_TEST_FORM_POST", "updated1", "Value2_1"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "The value was not re-selected in the second set of options");
            });
      },

      "Test pub/sub options generated": function() {
         return browser.findByCssSelector("#FIXED_INVALID_CHANGES_TO .dijitArrowButtonInner")
            .click()
            .end()

         .findByCssSelector("#HAS_UPDATE_TOPICS .dijitArrowButtonInner")
            .click()
            .end()

         .findAllByCssSelector("#HAS_UPDATE_TOPICS_CONTROL_dropdown .dijitMenuItemLabel")
            .then(function(elements) {
               assert.lengthOf(elements, 3, "The wrong number of options were generated");
            });
      },

      "Test updated label set by pub/sub": function() {
         return browser.findByCssSelector("#HAS_UPDATE_TOPICS_CONTROL_dropdown table tr:nth-child(1) td.dijitMenuItemLabel")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Update1_1", "Updated label not set correctly by pub/sub");
            });
      },

      "Test options provided once": function() {
         // The options should have been provided once (the mock service increments the options)...
         return browser.findByCssSelector("#HAS_CHANGES_TO_CONTROL")
            .click()
            .end()

         .findByCssSelector("#HAS_CHANGES_TO_CONTROL_dropdown table tr:nth-child(1) td.dijitMenuItemLabel")
            .getVisibleText()
            .then(function(resultText) {
               assert.equal(resultText, "Update1_3", "Updated label not set correctly by pub/sub");
            });
      },

      "Test update topics processed": function() {
         return browser.findByCssSelector("#HAS_CHANGES_TO .dijitArrowButtonInner")
            .click()
            .end()

         .findByCssSelector("#REQUEST_GLOBAL_UPDATE_label")
            .click()
            .end()

         .findByCssSelector("#HAS_UPDATE_TOPICS .dijitArrowButtonInner")
            .click()
            .end()

         .findByCssSelector("#HAS_UPDATE_TOPICS_CONTROL_dropdown table tr:nth-child(1) td.dijitMenuItemLabel")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Update1_2", "Updated label not set correctly by external update");
            });
      },

      "Test value of pub sub option after options update": function() {
         return browser.findByCssSelector(".confirmationButton > span")
            .click()
            .end()

         .findAllByCssSelector(TestCommon.pubDataCssSelector("UNIT_TEST_FORM_POST", "updated1", "Value2_1"))
            .then(function(elements) {
               assert.lengthOf(elements, 2, "The value was not re-selected in the second set of options");
            });
      },

      "Test pub/sub options generated from field change": function() {
         // Check that pub/sub options generated from field changes are correct (should be on 3rd request based on values being set)...
         return browser.findByCssSelector("#HAS_UPDATE_TOPICS .dijitArrowButtonInner")
            .click()
            .end()

         .findByCssSelector("#HAS_CHANGES_TO .dijitArrowButtonInner")
            .click()
            .end()

         .findAllByCssSelector("#HAS_CHANGES_TO_CONTROL_dropdown .dijitMenuItemLabel")
            .then(function(elements) {
               assert.lengthOf(elements, 2, "Incorrect number of options found");
            });
      },

      "Test update topic scoping": function() {
         // Clicking the 2nd button should have no effect (as it's the scoped topic published globally)...
         return browser.findByCssSelector("#REQUEST_SCOPED_UPDATE_GLOBALLY_label")
            .click()
            .end()

         .findByCssSelector("#HAS_UPDATE_TOPICS .dijitArrowButtonInner")
            .click()
            .end()

         .findByCssSelector("#HAS_UPDATE_TOPICS_CONTROL_dropdown table tr:nth-child(1) td.dijitMenuItemLabel")
            .getVisibleText()
            .then(function(resultText) {
               assert.equal(resultText, "Update1_2", "Updated label not unexpectedly updated");
            });
      },

      "Test label updated  from external publication": function() {
         // Clicking the 3rd button should perform an update...
         return browser.findByCssSelector("#REQUEST_SCOPED_UPDATE_label")
            .click()
            .end()

         .findByCssSelector("#HAS_UPDATE_TOPICS .dijitArrowButtonInner")
            .click()
            .end()

         .findByCssSelector("#HAS_UPDATE_TOPICS_CONTROL_dropdown table tr:nth-child(1) td.dijitMenuItemLabel")
            .getVisibleText()
            .then(function(resultText) {
               assert.equal(resultText, "Update1_3", "Updated label not set correctly by external update");
            });
      },

      "Test changing field triggers update": function() {
         // Change a field to check an update is made...
         return browser.findByCssSelector("#FIXED_INVALID_CHANGES_TO .dijitArrowButtonInner")
            .click()
            .end()

         .findByCssSelector("#FIXED_INVALID_CHANGES_TO_CONTROL_dropdown table tr:nth-child(1) td.dijitMenuItemLabel")
            .click()
            .end()

         .findByCssSelector("#HAS_CHANGES_TO .dijitArrowButtonInner")
            .click()
            .end()

         .findByCssSelector("#HAS_CHANGES_TO_CONTROL_dropdown table tr:nth-child(1) td.dijitMenuItemLabel")
            .getVisibleText()
            .then(function(resultText) {
               assert.equal(resultText, "Update1_4", "Updated label not set correctly by pub/sub");
            });
      },

      "Test XSS attack fails": function() {
         // Change a field to check an update is made...
         return browser.then(function() {
            var notHacked = browser.execute("!window.hackedLabel && !window.hackedValue");
            assert(notHacked, "XSS prevention failed - script executed in label or value of option");
         });
      },

      "Test pub/sub options in dialog": function() {
         // See https://issues.alfresco.com/jira/browse/AKU-131
         // Create the form dialog...
         return browser.findByCssSelector("#CREATE_FORM_DIALOG_label")
            .click()
            .end()

         // Open the opens...
         .findByCssSelector("#SELECT_IN_DIALOG .dijitArrowButtonInner")
            .click()
            .end()

         // Count that there are some...
         .findAllByCssSelector("#SELECT_IN_DIALOG_CONTROL_dropdown .dijitMenuItemLabel")
            .then(function(elements) {
               assert.lengthOf(elements, 2, "No pub sub options provided for select in a dialog");
            });
      },

      "Test pub/sub options value": function() {
         return browser.findByCssSelector("#DIALOG_WITH_SELECT .confirmationButton > span")
            .click()
            .end()

         .findAllByCssSelector(TestCommon.pubDataCssSelector("DIALOG_POST", "selected", "DO2"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Options value was not initialized correctly");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});