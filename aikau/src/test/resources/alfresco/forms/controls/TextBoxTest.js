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
      name: 'Validation Text Box Test',
      'alfresco/forms/controls/DojoValidationTextBox': function () {

         var browser = this.remote;
         var testName = "Validation TextBox Test";
         return TestCommon.loadTestWebScript(this.remote, "/DojoValidationTextBox", testName)
            // Test #1 
            // Check initial rendering...
            .end()
            .findByCssSelector("#BASIC .label")
               .getVisibleText()
               .then(function(resultText) {
                  TestCommon.log(testName, "Check that label is rendered correctly...");
                  assert(resultText == "Basic", "Test #1a - The label was not rendered correctly: " + resultText);
               })
               .end()

            .findByCssSelector("#UNITS_AND_DESCRIPTION .units")
               .getVisibleText()
               .then(function(resultText) {
                  TestCommon.log(testName, "Check that units are rendered correctly...");
                  assert(resultText == "Some unit", "Test #1b - The units was not rendered correctly: " + resultText);
               })
               .end()

            // TODO: Not sure how to test description tooltip rendering - it might not be worth it, as I suspect a re-design will be required

            // Test #2
            // Check initial value that is set...
            .findByCssSelector("#INITIAL_VALUE1 .dijitInputContainer input")
               .getProperty('value')
               .then(function(resultText) {
                  TestCommon.log(testName, "Check that initial value is set correctly...");
                  assert(resultText == "Val1", "Test #2a - The initial value was not set correctly: " + resultText);
               })
               .end()

            // Test #3
            // Check behaviour rules
            // Based on the initial value of "Field1" it is expected that SINGLE_POSITIVE_RULES should be
            // shown and SINGLE_NEGATIVE_RULES should be hidden
            .findByCssSelector("#SINGLE_POSITIVE_RULES")
               .then(
                  function() {
                     TestCommon.log(testName, "SINGLE_POSITIVE_RULES was displayed");
                  }, 
                  function() {
                     TestCommon.log(testName, "Check that SINGLE_POSITIVE_RULES widget is displayed");
                     assert(false, "Test #3a - Widget not displayed as expected");
                  }
               )
               .end()
            .findByCssSelector("#SINGLE_NEGATIVE_RULES")
               .getComputedStyle("display")
               .then(function(result) {
                  TestCommon.log(testName, "Check that SINGLE_NEGATIVE_RULES widget is hidden, display is:" + result);
                  assert(result == "none", "Test #3b - Widget displayed unexpectedly");
               })
               .end()

            // ...and the requirement indicator should be displayed for POSITIVE and hidden for NEGATIVE
            .findByCssSelector("#SINGLE_POSITIVE_RULES span.requirementIndicator")
               .getComputedStyle("display")
               .then(function(result) {
                  TestCommon.log(testName, "Check that SINGLE_POSITIVE_RULES widget requirement indicator is shown:" + result);
                  assert(result == "inline-block", "Test #3c - Requirement indicator not displayed as expected");
               })
               .end()
            .findByCssSelector("#SINGLE_NEGATIVE_RULES span.requirementIndicator")
               .getComputedStyle("display")
               .then(function(result) {
                  assert(result == "none", "Test #3d - Requirement indicator displayed unexpectedly");
               })
               .end()

            // ...and the field should be enabled for POSITIVE and disabled for NEGATIVE...
            .findByCssSelector("#SINGLE_POSITIVE_RULES .dijitInputContainer input")
               .isEnabled()
               .then(function(result) {
                  assert(result === false, "Test #3e - Field should have been disabled");
               })
               .end()

            .findByCssSelector("#SINGLE_NEGATIVE_RULES .dijitInputContainer input")
               .isEnabled()
               .then(function(result) {
                  assert(result === true, "Test #3f - Field should have been enabled");
               })
               .end()

            // When Field1 is updated the field should become visible...
            .findByCssSelector("#INITIAL_VALUE1 .dijitInputContainer input")
               .type(keys.BACKSPACE)
               .end()
            .findByCssSelector("#SINGLE_POSITIVE_RULES")
               .getComputedStyle("display")
               .then(function(result) {
                  assert(result == "none", "Test #3d - Widget displayed unexpectedly after processing positive rules");
               })
               .end()
            .findByCssSelector("#SINGLE_NEGATIVE_RULES")
               .then(function() {}, function() {
                  assert(false, "Test #3e - Widget not displayed as expected after processing negative rules");
               })
               .end()

            // When Field2 is updated the field should become required...
            .findByCssSelector("#INITIAL_VALUE2 .dijitInputContainer input")
               .type(keys.BACKSPACE)
               .end()
            .findByCssSelector("#SINGLE_NEGATIVE_RULES span.requirementIndicator")
               .getComputedStyle("display")
               .then(function(result) {
                  assert(result == "inline-block", "Test #3f - Requirement indicator not displayed as expected");
               })
               .end()
            .findByCssSelector("#SINGLE_POSITIVE_RULES span.requirementIndicator")
               .getComputedStyle("display")
               .then(function(result) {
                  assert(result == "none", "Test #3g - Requirement indicator displayed unexpectedly");
               })
               .end()

            // When Field3 is updated the field should become disabled...
            .findByCssSelector("#INITIAL_VALUE3 .dijitInputContainer input")
               .type(keys.BACKSPACE)
               .end()
            .findByCssSelector("#SINGLE_NEGATIVE_RULES .dijitInputContainer input")
               .isEnabled()
               .then(function(result) {
                  assert(result === false, "Test #3h - Field should have been disabled");
               })
               .end()
            .findByCssSelector("#SINGLE_POSITIVE_RULES .dijitInputContainer input")
               .isEnabled()
               .then(function(result) {
                  assert(result === true, "Test #3i - Field should have been enabled");
               })
               .end()

            // Put the values back...
            // When Field1 is updated the field should become visible...
            .findByCssSelector("#INITIAL_VALUE1 .dijitInputContainer input")
               .type("1")
               .end()
            .findByCssSelector("#INITIAL_VALUE2 .dijitInputContainer input")
               .type("2")
               .end()
            .findByCssSelector("#INITIAL_VALUE3 .dijitInputContainer input")
               .type("3")
               .end()
            .findByCssSelector("#SINGLE_POSITIVE_RULES")
               .then(function() {}, function() {
                  assert(false, "Test #3a - Widget not displayed as expected");
               })
               .end()
            .findByCssSelector("#SINGLE_NEGATIVE_RULES")
               .getComputedStyle("display")
               .then(function(result) {
                  assert(result == "none", "Test #3b - Widget displayed unexpectedly");
               })
               .end()
            .findByCssSelector("#SINGLE_POSITIVE_RULES span.requirementIndicator")
               .getComputedStyle("display")
               .then(function(result) {
                  assert(result == "inline-block", "Test #3c - Requirement indicator not displayed as expected");
               })
               .end()
            .findByCssSelector("#SINGLE_NEGATIVE_RULES span.requirementIndicator")
               .getComputedStyle("display")
               .then(function(result) {
                  assert(result == "none", "Test #3d - Requirement indicator displayed unexpectedly");
               })
               .end()
            .findByCssSelector("#SINGLE_POSITIVE_RULES .dijitInputContainer input")
               .isEnabled()
               .then(function(result) {
                  assert(result === false, "Test #3e - Field should have been disabled");
               })
               .end()
            .findByCssSelector("#SINGLE_NEGATIVE_RULES .dijitInputContainer input")
               .isEnabled()
               .then(function(result) {
                  assert(result === true, "Test #3f - Field should have been enabled");
               })
               .end()

            // Test #4
            // Check mixed rules...
            // It should be initially invisible...
            .findByCssSelector("#MULTIPLE_MIXED_RULES")
               .getComputedStyle("display")
               .then(function(result) {
                  assert(result == "none", "Test #4a - Multiple mixed rule widget displayed unexpectedly");
               })
               .end()
            // Changing field 2 should make it visible...
            .findByCssSelector("#INITIAL_VALUE2 .dijitInputContainer input")
               .type("x")
               .end()
            .findByCssSelector("#MULTIPLE_MIXED_RULES")
               .getComputedStyle("display")
               .then(function(result) {
                  assert(result != "none", "Test #4b - Multiple mixed rule widget should be displayed");
               })
               .end()
            // Changing field 1 should hide it again...
            .findByCssSelector("#INITIAL_VALUE1 .dijitInputContainer input")
               .type("x")
               .end()
            .findByCssSelector("#MULTIPLE_MIXED_RULES")
               .getComputedStyle("display")
               .then(function(result) {
                  assert(result == "none", "Test #4c - Multiple mixed should be hidden again");
               })
               .end()

            // Make it visible again...
            .findByCssSelector("#INITIAL_VALUE1 .dijitInputContainer input")
               .type(keys.BACKSPACE)
               .end()
            // Requirement should be ON
            .findByCssSelector("#MULTIPLE_MIXED_RULES span.requirementIndicator")
               .getComputedStyle("display")
               .then(function(result) {
                  assert(result == "inline-block", "Test #4d - Multiple mixed requirement indicator was not displayed");
               })
               .end()
            .findByCssSelector("#MULTIPLE_MIXED_RULES .dijitInputContainer input")
               .isEnabled()
               .then(function(result) {
                  assert(result === false, "Test #4e - Multiple mixed should have been disabled");
               })
               .end()
            // Switch requirement OFF
            .findByCssSelector("#INITIAL_VALUE3 .dijitInputContainer input")
               .type("x")
               .end()
            .findByCssSelector("#MULTIPLE_MIXED_RULES span.requirementIndicator")
               .getComputedStyle("display")
               .then(function(result) {
                  assert(result == "none", "Test #4f - Multiple mixed requirement indicator displayed unexpectedly");
               })
               .end()
            .findByCssSelector("#MULTIPLE_MIXED_RULES .dijitInputContainer input")
               .isEnabled()
               .then(function(result) {
                  assert(result === true, "Test #4g - Multiple mixed should have been enabled");
               })
               .end()

            // Test #5
            // Check validation
            // The field should be initiall invalid (not a number)...
            .findByCssSelector("#HAS_VALIDATION_CONFIG span.validation")
               .getComputedStyle("display")
               .then(function(result) {
                  assert(result == "inline-block", "Test #5a - Validation error indicator should be displayed");
               })
               .end()
            .findByCssSelector("#HAS_VALIDATION_CONFIG span.validation-message")
               .getComputedStyle("display")
               .then(function(result) {
                  assert(result == "inline-block", "Test #5b - Validation error message should be displayed");
               })
               .getVisibleText()
               .then(function(text) {
                  assert(text == "Value must be a number", "Test #5c - Validation error message not set correctly");
               })
               .end()
            // Enter a non-numeric (should still be in error)...
            .findByCssSelector("#HAS_VALIDATION_CONFIG .dijitInputContainer input")
               .type("x")
               .end()
            .findByCssSelector("#HAS_VALIDATION_CONFIG span.validation")
               .getComputedStyle("display")
               .then(function(result) {
                  assert(result == "inline-block", "Test #5d - Validation error indicator should be displayed for non-numeric");
               })
               .end()
            // Remove the non-numeric and enter some numbers...
            .findByCssSelector("#HAS_VALIDATION_CONFIG .dijitInputContainer input")
               .type(keys.BACKSPACE)
               .type("1234")
               .end()
            .findByCssSelector("#HAS_VALIDATION_CONFIG span.validation")
               .getComputedStyle("display")
               .then(function(result) {
                  assert(result == "none", "Test #5a - Validation error indicator should be hidden for numeric entry");
               })
               .end()

            // Check fields with invalid validation config are displayed...
            .findByCssSelector("#INVALID_VALIDATION_CONFIG_1")
               .isDisplayed()
               .end()
            .findByCssSelector("#INVALID_VALIDATION_CONFIG_2")
               .isDisplayed()

           
            .alfPostCoverageResults(browser);
      }
   });
});