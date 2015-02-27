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
        "alfresco/TestCommon"], 
        function (registerSuite, assert, require, TestCommon) {

   var browser;
   registerSuite({
      name: "Advanced Form Validation Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/Validation", "Advanced Form Validation Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      // teardown: function() {
      //    browser.end();
      // },
      
     "Check that the form is initially invalid": function () {
         return browser.findAllByCssSelector(".confirmationButton.dijitDisabled")
            .then(function(elements) {
               assert(elements.length === 1, "The forms confirmation button should be initially disabled");
            });
      },

      "Check the initial error messages (1)": function() {
         return browser.findByCssSelector("#TEST_CONTROL .validation-message")
            .getVisibleText()
            .then(function(text) {
               assert(text === "Too short, Letters only", "The initial error message is incorrect: " + text);
            });
      },
       
      "Check the initial error messages (2)": function() {
         return browser.findByCssSelector("#TEST_CONTROL_INVERT .validation-message")
            .getVisibleText()
            .then(function(text) {
               assert(text === "Too short", "The initial error message is incorrect: " + text);
            });
      },

      "Check the in-progress indicator isn't shown": function() {
         return browser.findByCssSelector(".validationInProgress")
            .isDisplayed()
            .then(function(result) {
               assert(result === false, "Test", "The in progress indicator is displayed incorrectly");
            });
      },

      // Add 3 letters to both controls (make sure errors are cleared and form can be posted)...
      "Check form confirmation button is enabled": function () {
         return browser.findByCssSelector("#TEST_CONTROL .dijitInputContainer input")
            .type("abc")
         .end()
         .findByCssSelector("#TEST_CONTROL_INVERT .dijitInputContainer input")
            .type("abc")
         .end()
         .findAllByCssSelector(".confirmationButton.dijitDisabled")
            .then(function(elements) {
               assert(elements.length === 0, "The forms confirmation button should be enabled");
            });
      },

      "Check that error message has been removed (1)": function() {
         return browser.findByCssSelector("#TEST_CONTROL .validation-message")
            .isDisplayed()
            .then(function(result) {
               assert(result === false, "The error message was displayed incorrectly");
            });
      },

      "Check that error message has been removed (2)": function() {
         return browser.findByCssSelector("#TEST_CONTROL_INVERT .validation-message")
            .isDisplayed()
            .then(function(result) {
               assert(result === false, "The error message was displayed incorrectly");
            });
      },

      // Add 6 letters to control 1 (make sure field is invalid and message is correct)...
      "Test confirmation button disabled (too many chars)": function () {
         return browser.findByCssSelector("#TEST_CONTROL .dijitInputContainer input")
            .clearValue()
            .type("abcdef")
         .end()
         .findAllByCssSelector(".confirmationButton.dijitDisabled")
            .then(function(elements) {
               assert(elements.length === 1, "The forms confirmation button should be disabled");
            });
      },

      "Test error message (too many chars)": function() {
         return browser.findByCssSelector("#TEST_CONTROL .validation-message")
            .getVisibleText()
            .then(function(text) {
               assert(text === "Too long", "The initial error message is incorrect: " + text);
            });
      },

      // Add numbers to control 1 (make sure field is invalid and message is correct)...
      "Test confirmation button disabled (invalid chars)": function () {
         return browser.findByCssSelector("#TEST_CONTROL .dijitInputContainer input")
            .clearValue()
            .type("123")
         .end()
         .findAllByCssSelector(".confirmationButton.dijitDisabled")
            .then(function(elements) {
               assert(elements.length === 1, "The forms confirmation button should be disabled");
            });
      },

      "Test error message (invalid chars)": function() {
         return browser.findByCssSelector("#TEST_CONTROL .validation-message")
            .getVisibleText()
            .then(function(text) {
               assert(text === "Letters only", "The initial error message is incorrect: " + text);
            });
      },

      // Add a value to control 1 that is used (make sure field is invalid and message is correct)...
      "Test confirmation button disabled (duplicate value)": function () {
         return browser.findByCssSelector("#TEST_CONTROL .dijitInputContainer input")
            .clearValue()
            .type("One")
         .end()
         .findAllByCssSelector(".confirmationButton.dijitDisabled")
            .then(function(elements) {
               assert(elements.length === 1, "The forms confirmation button should be disabled");
            });
      },

      "Test error message (duplicate value)": function() {
         return browser.findByCssSelector("#TEST_CONTROL .validation-message")
            .getVisibleText()
            .then(function(text) {
               assert(text === "Already used", "The initial error message is incorrect: " + text);
            });
      },

      // Add a value to control 2 that contains illegal characters (make sure field is invalid and message is correct)...
      "Test confirmation button is disabled (more illegal chars)": function () {
         return browser.findByCssSelector("#TEST_CONTROL_INVERT .dijitInputContainer input")
            .clearValue()
            .type("abc>def/")
         .end()
         .findAllByCssSelector(".confirmationButton.dijitDisabled")
            .then(function(elements) {
               assert(elements.length === 1, "The forms confirmation button should be disabled");
            });
      },

      "Test error message (more illegal chars)": function() {
         return browser.findByCssSelector("#TEST_CONTROL_INVERT .validation-message")
            .getVisibleText()
            .then(function(text) {
               assert(text === "No illegal characters", "The initial error message is incorrect: " + text);
            });
      },

      // Check asynchoronous behaviour...
      "Test asynchoronous validation indicator gets displayed": function () {
         return browser.findByCssSelector("#TEST_CONTROL .dijitInputContainer input")
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
               assert(result === true, "The in progress indicator isn't visible");
            });
      },

      "Test progress indicator is removed": function() {
         return browser.findByCssSelector("#UNBLOCK_RESPONSE_label")
            .click()
            .click() // Needs the 2nd click!
         .end()
         .findByCssSelector(".validationInProgress")
            .isDisplayed()
            .then(function(result) {
               assert(result === false, "The in progress indicator is visible");
            });
      },

      // Need to make the form valid before the next test!
      "Test confirmation button gets enabled": function () {
         return browser.findByCssSelector("#TEST_CONTROL .dijitInputContainer input")
            .clearValue()
            .type("abc")
         .end()
         .findByCssSelector("#TEST_CONTROL_INVERT .dijitInputContainer input")
            .clearValue()
            .type("abc")
         .end()
         .findAllByCssSelector(".confirmationButton.dijitDisabled")
            .then(function(elements) {
               assert(elements.length === 0, "The forms confirmation button should be enabled");
            });
      },

      "Test Match Validation - Source Change": function () {
         return browser.findByCssSelector("#MATCH_TARGET .dijitInputContainer input")
            .clearValue()
            .type("ABC")
         .end()
         .findAllByCssSelector(".confirmationButton.dijitDisabled")
            .then(function(elements) {
               assert(elements.length === 1, "The forms confirmation button should be disabled");
            });
      },

      "Test Match Validation - Target Match": function () {
         return browser.findByCssSelector("#MATCH_SOURCE .dijitInputContainer input")
            .clearValue()
            .type("ABC")
         .end()
         .findAllByCssSelector(".confirmationButton.dijitDisabled")
            .then(function(elements) {
               assert(elements.length === 0, "The forms confirmation button should be enabled");
            });
      },

      "Test Match Validation - Target Mismatch": function () {
         return browser.findByCssSelector("#MATCH_SOURCE .dijitInputContainer input")
            .clearValue()
            .type("AB")
         .end()
         .findAllByCssSelector(".confirmationButton.dijitDisabled")
            .then(function(elements) {
               assert(elements.length === 1, "The forms confirmation button should be disabled");
            });
      },

      "Test Match Validation - Source Match Again": function () {
         return browser.findByCssSelector("#MATCH_TARGET .dijitInputContainer input")
            .clearValue()
            .type("AB")
         .end()
         .findAllByCssSelector(".confirmationButton.dijitDisabled")
            .then(function(elements) {
               assert(elements.length === 0, "The forms confirmation button should be disabled");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });
});