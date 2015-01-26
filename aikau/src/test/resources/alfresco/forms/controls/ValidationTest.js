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
      name: 'Advanced Form Validation Test',
      'Test Initial State': function () {
         var testName = "Advanced Form Validation Test";
         return TestCommon.loadTestWebScript(this.remote, "/Validation", testName)

            // Check that the form is initially invalid...
            .findAllByCssSelector(".confirmationButton.dijitDisabled")
               .then(function(elements) {
                  assert(elements.length === 1, "Test #1a - The forms confirmation button should be initially disabled");
               })
            .end()

            // Check the initial error messages...
            .findByCssSelector("#TEST_CONTROL .validation-message")
               .getVisibleText()
               .then(function(text) {
                  assert(text === "Too short, Letters only", "Test #1b - The initial error message is incorrect: " + text);
               })
            .end()

            .findByCssSelector("#TEST_CONTROL_INVERT .validation-message")
               .getVisibleText()
               .then(function(text) {
                  assert(text === "Too short", "Test #1c - The initial error message is incorrect: " + text);
               })
            .end()

            // Check the in-progress indicator isn't shown...
            .findByCssSelector(".validationInProgress")
               .isDisplayed()
               .then(function(result) {
                  assert(result === false, "Test", "Test #1d - The in progress indicator is displayed incorrectly");
               })
            .end();
      },
      'Test Valid State': function () {

         return this.remote
            
            // Add 3 letters to both controls (make sure errors are cleared and form can be posted)...
            .findByCssSelector("#TEST_CONTROL .dijitInputContainer input")
               .type("abc")
            .end()
            .findByCssSelector("#TEST_CONTROL_INVERT .dijitInputContainer input")
               .type("abc")
            .end()
            .findAllByCssSelector(".confirmationButton.dijitDisabled")
               .then(function(elements) {
                  assert(elements.length === 0, "Test #2a - The forms confirmation button should be enabled");
               })
            .end()
            .findByCssSelector("#TEST_CONTROL .validation-message")
               .isDisplayed()
               .then(function(result) {
                  assert(result === false, "Test #2b - The error message was displayed incorrectly");
               })
            .end()
            .findByCssSelector("#TEST_CONTROL_INVERT .validation-message")
               .isDisplayed()
               .then(function(result) {
                  assert(result === false, "Test #2c - The error message was displayed incorrectly");
               })
            .end();
      },
      'Test Too Many Characters': function () {
         return this.remote

            // Add 6 letters to control 1 (make sure field is invalid and message is correct)...
            .findByCssSelector("#TEST_CONTROL .dijitInputContainer input")
               .clearValue()
               .type("abcdef")
            .end()
            .findAllByCssSelector(".confirmationButton.dijitDisabled")
               .then(function(elements) {
                  assert(elements.length === 1, "Test #3a - The forms confirmation button should be disabled");
               })
            .end()
            .findByCssSelector("#TEST_CONTROL .validation-message")
               .getVisibleText()
               .then(function(text) {
                  assert(text === "Too long", "Test #3b - The initial error message is incorrect: " + text);
               })
            .end();
      },
      'Test Invalid Characters': function () {
         return this.remote
            // Add numbers to control 1 (make sure field is invalid and message is correct)...
            .findByCssSelector("#TEST_CONTROL .dijitInputContainer input")
               .clearValue()
               .type("123")
            .end()
            .findAllByCssSelector(".confirmationButton.dijitDisabled")
               .then(function(elements) {
                  assert(elements.length === 1, "Test #4a - The forms confirmation button should be disabled");
               })
            .end()
            .findByCssSelector("#TEST_CONTROL .validation-message")
               .getVisibleText()
               .then(function(text) {
                  assert(text === "Letters only", "Test #4b - The initial error message is incorrect: " + text);
               })
            .end();
      },
      'Test Duplicate Value': function () {
         return this.remote
            // Add a value to control 1 that is used (make sure field is invalid and message is correct)...
            .findByCssSelector("#TEST_CONTROL .dijitInputContainer input")
               .clearValue()
               .type("One")
            .end()
            .findAllByCssSelector(".confirmationButton.dijitDisabled")
               .then(function(elements) {
                  assert(elements.length === 1, "Test #5a - The forms confirmation button should be disabled");
               })
            .end()
            .findByCssSelector("#TEST_CONTROL .validation-message")
               .getVisibleText()
               .then(function(text) {
                  assert(text === "Already used", "Test #5b - The initial error message is incorrect: " + text);
               })
            .end();
      },
      'Test Illegal Characters Again': function () {
         return this.remote
            // Add a value to control 2 that contains illegal characters (make sure field is invalid and message is correct)...
            .findByCssSelector("#TEST_CONTROL_INVERT .dijitInputContainer input")
               .clearValue()
               .type("abc>def/")
            .end()
            .findAllByCssSelector(".confirmationButton.dijitDisabled")
               .then(function(elements) {
                  assert(elements.length === 1, "Test #6a - The forms confirmation button should be disabled");
               })
            .end()
            .findByCssSelector("#TEST_CONTROL_INVERT .validation-message")
               .getVisibleText()
               .then(function(text) {
                  assert(text === "No illegal characters", "Test #6b - The initial error message is incorrect: " + text);
               })
            .end();
      },
      'Test Asynchoronous Validation': function () {
         return this.remote
            // Check asynchoronous behaviour...
            .findByCssSelector("#TEST_CONTROL .dijitInputContainer input")
               .clearValue()
            .end()
            .findByCssSelector("#BLOCK_RESPONSE_label")
               .click()
            .end()
            .findByCssSelector("#TEST_CONTROL .dijitInputContainer input")
               .type("O")
            .end()
            .findByCssSelector(".validationInProgress")
               .isDisplayed()
               .then(function(result) {
                  assert(result === true, "Test #7a - The in progress indicator isn't visible");
               })
            .end()
            .findByCssSelector("#UNBLOCK_RESPONSE_label")
               .click()
               .click() // Needs the 2nd click!
            .end()
            .findByCssSelector(".validationInProgress")
               .isDisplayed()
               .then(function(result) {
                  assert(result === false, "Test #7b - The in progress indicator is visible");
               })
            .end();
            
      },
      // Need to make the form valid before the next test!
      'Test Match Validation - Reset Form': function () {
         return this.remote
            .findByCssSelector("#TEST_CONTROL .dijitInputContainer input")
               .clearValue()
               .type("abc")
            .end()
            .findByCssSelector("#TEST_CONTROL_INVERT .dijitInputContainer input")
               .clearValue()
               .type("abc")
            .end()
            .findAllByCssSelector(".confirmationButton.dijitDisabled")
               .then(function(elements) {
                  assert(elements.length === 0, "Test #8a - The forms confirmation button should be enabled");
               })
            .end();
      },
      'Test Match Validation - Source Change': function () {
         return this.remote
            .findByCssSelector("#MATCH_TARGET .dijitInputContainer input")
               .clearValue()
               .type("ABC")
            .end()
            .findAllByCssSelector(".confirmationButton.dijitDisabled")
               .then(function(elements) {
                  assert(elements.length === 1, "Test #8b - The forms confirmation button should be disabled");
               })
            .end();
      },
      'Test Match Validation - Target Match': function () {
         return this.remote
            .findByCssSelector("#MATCH_SOURCE .dijitInputContainer input")
               .clearValue()
               .type("ABC")
            .end()
            .findAllByCssSelector(".confirmationButton.dijitDisabled")
               .then(function(elements) {
                  assert(elements.length === 0, "Test #8c - The forms confirmation button should be enabled");
               })
            .end();
      },
      'Test Match Validation - Target Mismatch': function () {
         return this.remote
            .findByCssSelector("#MATCH_SOURCE .dijitInputContainer input")
               .clearValue()
               .type("AB")
            .end()
            .findAllByCssSelector(".confirmationButton.dijitDisabled")
               .then(function(elements) {
                  assert(elements.length === 1, "Test #8d - The forms confirmation button should be disabled");
               })
            .end()

            .alfPostCoverageResults(this.remote);
      },
      'Test Match Validation - Source Match Again': function () {
         return this.remote
            .findByCssSelector("#MATCH_TARGET .dijitInputContainer input")
               .clearValue()
               .type("AB")
            .end()
            .findAllByCssSelector(".confirmationButton.dijitDisabled")
               .then(function(elements) {
                  assert(elements.length === 0, "Test #8f - The forms confirmation button should be disabled");
               })
            .end()

            .alfPostCoverageResults(this.remote);
      }
   });
});