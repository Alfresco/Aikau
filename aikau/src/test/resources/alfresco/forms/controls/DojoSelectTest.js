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
 * 
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"], 
        function (registerSuite, assert, require, TestCommon, keys) {

   registerSuite({
      name: 'Select Menu Test',
      'alfresco/forms/controls/DojoSelect': function () {

         var browser = this.remote;
         var testName = "Select Menu Test";
         return TestCommon.loadTestWebScript(this.remote, "/DojoSelect", testName)

            // Get the options labels using:
            //    #FIXED_INVALID_CHANGES_TO_CONTROL_dropdown .dijitMenuItemLabel

            // Get the drop-down arrow to option the menu using:
            //    #FIXED_INVALID_CHANGES_TO .dijitArrowButtonInner

            // Get the current label using the following:
            //    #FIXED_INVALID_CHANGES_TO span[role=option]

            // Get specific menu option:
            //    #FIXED_INVALID_CHANGES_TO_CONTROL_dropdown table tr:nth-child(1) td.dijitMenuItemLabel

            // Test #1
            // Check labels
            .end()
            .findByCssSelector("#FIXED_INVALID_CHANGES_TO .label")
               .getVisibleText()
               .then(function(resultText) {
                  assert(resultText == "Fixed 1", "Test #1a - The label was not rendered correctly: " + resultText);
               })
               .end()

            // Test #2
            // Check initial value of fixed option...
            .findByCssSelector("#FIXED_INVALID_CHANGES_TO span[role=option]")
               .getVisibleText()
               .then(function(resultText) {
                  assert(resultText == "Two", "Test #2a - The initial value was not represented correctly: " + resultText);
               })
               .end()

            // Test #3
            // Check fixed options...
            // It is necessary to open the drop-down menu first to find the options...
            .findByCssSelector("#FIXED_INVALID_CHANGES_TO .dijitArrowButtonInner")
               .click()
               .end()

            // Count the number of fixed options (there should be 3)...
            .findAllByCssSelector("#FIXED_INVALID_CHANGES_TO_CONTROL_dropdown .dijitMenuItemLabel")
               .then(function(elements) {
                  assert(elements.length == 3, "Test 3a - Three fixed options were expected, found: " + elements.length);
               })
               .end()

            // Check that a fixed option label is set from the label attribute...
            .findByCssSelector("#FIXED_INVALID_CHANGES_TO_CONTROL_dropdown table tr:nth-child(1) td.dijitMenuItemLabel")
               .getVisibleText()
               .then(function(resultText) {
                  assert(resultText == "One", "Test #3b - Fixed label not set correctly: " + resultText);
               })
               .end()

            // Check that a fixed option label is set from the value attribute when no label attribute is provided...
            .findByCssSelector("#FIXED_INVALID_CHANGES_TO_CONTROL_dropdown table tr:nth-child(3) td.dijitMenuItemLabel")
               .getVisibleText()
               .then(function(resultText) {
                  assert(resultText == "NO LABEL", "Test #3c - Fixed label not set correctly from value: " + resultText);
               })
               .end()

            .findByCssSelector("#FIXED_INVALID_CHANGES_TO .dijitArrowButtonInner")
               .click()
               .end()

            // Test #4
            // Check initial pub/sub options generated...
            .findByCssSelector("#HAS_UPDATE_TOPICS .dijitArrowButtonInner")
               .click()
               .end()

            // There should be 2 options...
            .findAllByCssSelector("#HAS_UPDATE_TOPICS_CONTROL_dropdown .dijitMenuItemLabel")
               .then(function(elements) {
                  assert(elements.length == 2, "Test 4a - Two options were expected, found: " + elements.length);
               })
               .end()

            // The options should have been provided once (the mock service increments the options)...
            .findByCssSelector("#HAS_UPDATE_TOPICS_CONTROL_dropdown table tr:nth-child(1) td.dijitMenuItemLabel")
               .getVisibleText()
               .then(function(resultText) {
                  assert(resultText == "Update1_1", "Test #4b - Updated label not set correctly by pub/sub: " + resultText);
               })
               .end()

            .findByCssSelector("#HAS_UPDATE_TOPICS .dijitArrowButtonInner")
               .click()
               .end()

            // Test #5
            // Check that pub/sub options generated from field changes are correct (should be on 3rd request based on values being set)...
            .findByCssSelector("#HAS_CHANGES_TO .dijitArrowButtonInner")
               .click()
               .end()

            .findAllByCssSelector("#HAS_CHANGES_TO_CONTROL_dropdown .dijitMenuItemLabel")
               .then(function(elements) {
                  assert(elements.length == 2, "Test 5a - Two options were expected, found: " + elements.length);
               })
               .end()

            // The options should have been provided once (the mock service increments the options)...
            .findByCssSelector("#HAS_CHANGES_TO_CONTROL_dropdown table tr:nth-child(1) td.dijitMenuItemLabel")
               .getVisibleText()
               .then(function(resultText) {
                  assert(resultText == "Update1_3", "Test #5b - Updated label not set correctly by pub/sub: " + resultText);
               })
               .end()

            .findByCssSelector("#HAS_CHANGES_TO .dijitArrowButtonInner")
               .click()
               .end()

            // Test #6
            // Check that the update topics are processed...
            // Click the buttons to publish the topics...
            .findByCssSelector("#REQUEST_GLOBAL_UPDATE_label")
               .click()
               .end()

            // Open the drop-down and check the update...
            .findByCssSelector("#HAS_UPDATE_TOPICS .dijitArrowButtonInner")
               .click()
               .end()
            .findByCssSelector("#HAS_UPDATE_TOPICS_CONTROL_dropdown table tr:nth-child(1) td.dijitMenuItemLabel")
               .getVisibleText()
               .then(function(resultText) {
                  assert(resultText == "Update1_2", "Test #6a - Updated label not set correctly by external update: " + resultText);
               })
               .end()

            // Clicking the 2nd button should have no effect (as it's the scoped topic published globally)...
            .findByCssSelector("#REQUEST_SCOPED_UPDATE_GLOBALLY_label")
               .click()
               .end()
            .findByCssSelector("#HAS_UPDATE_TOPICS .dijitArrowButtonInner")
               .click()
               .end()
            .findByCssSelector("#HAS_UPDATE_TOPICS_CONTROL_dropdown table tr:nth-child(1) td.dijitMenuItemLabel")
               .getVisibleText()
               .then(function(resultText) {
                  assert(resultText == "Update1_2", "Test #6b - Updated label not unexpectedly updated: " + resultText);
               })
               .end()

            // Clicking the 3rd button should perform an update...
            .findByCssSelector("#REQUEST_SCOPED_UPDATE_label")
               .click()
               .end()
            .findByCssSelector("#HAS_UPDATE_TOPICS .dijitArrowButtonInner")
               .click()
               .end()
            .findByCssSelector("#HAS_UPDATE_TOPICS_CONTROL_dropdown table tr:nth-child(1) td.dijitMenuItemLabel")
               .getVisibleText()
               .then(function(resultText) {
                  assert(resultText == "Update1_3", "Test #6c - Updated label not set correctly by external update: " + resultText);
               })
               .end()

            // Test #7
            // Change a field to check an update is made...
            .findByCssSelector("#FIXED_INVALID_CHANGES_TO .dijitArrowButtonInner")
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
                  assert(resultText == "Update1_4", "Test #7a - Updated label not set correctly by pub/sub: " + resultText);
               })
               .end()

            .alfPostCoverageResults(browser);
      }
   });
});