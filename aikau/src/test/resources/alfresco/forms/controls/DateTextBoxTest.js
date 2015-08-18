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
 * @author Erik Winlöf
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!assert", 
        "require", 
        "alfresco/TestCommon", 
        "intern/dojo/node!leadfoot/keys"], 
        function(registerSuite, assert, require, TestCommon, keys) {

registerSuite(function(){
   var browser;

   return {
      name: "DateTextBox Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/DateTextBox", "DateTextBox Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Test initial valid values": function() {
         return browser.findByCssSelector("#VALID_DATES_FORM .confirmationButton .dijitButtonNode")
            .click()
            .getLastPublish("VALID_DATES_FORM_SUBMIT")
            .then(function(payload) {
               assert.propertyVal(payload, "validDate1", "2012-12-12", "Incorrect date value retrieved from control");
               assert.propertyVal(payload, "validDate2", "2015-07-07", "Incorrect date value retrieved from control");
            });
      },

      "Test initial invalid values": function() {
         return browser.findById("LETTERS_DATE_VALUE_CONTROL")
            .getProperty("value")
            .then(function(value){
               assert.equal(value, "", "Initial value of letters should present empty date box");
            })
            .end()
            
         .findById("EMPTY_DATE_VALUE_CONTROL")
            .getProperty("value")
            .then(function(value){
               assert.equal(value, "", "Initial value of empty should present empty date box");
            })
            .end()

         .findById("NULL_DATE_VALUE_CONTROL")
            .getProperty("value")
            .then(function(value){
               assert.equal(value, "", "Initial value of null should present empty date box");
            })
            .end()

         .findById("UNDEFINED_DATE_VALUE_CONTROL")
            .getProperty("value")
            .then(function(value){
               assert.equal(value, "", "Initial value of undefined should present empty date box");
            });
      },

      "Ensure invalid form is disabled": function() {
         return browser.findByCssSelector("#INVALID_DATES_FORM .dijitButtonDisabled");
      },
      
      "Changed date publishes correct value": function() {
         return browser.findByCssSelector("#VALID_DATE_VALUE_2 .dijitArrowButton") // Click down arrow
            .clearLog()
            .click()
            .end()

         .findByCssSelector("#VALID_DATE_VALUE_2_CONTROL_popup tr:nth-child(3) td:nth-child(3)") // Choose third date on third row
            .click()
            .end()

         .findByCssSelector("#VALID_DATES_FORM .confirmationButton .dijitButtonNode") // Submit the form
            .click()
            .getLastPublish("VALID_DATES_FORM_SUBMIT")
            .then(function(payload) {
               assert.propertyVal(payload, "validDate1", "2012-12-12", "Incorrect date value retrieved from control after other control updated");
               assert.propertyVal(payload, "validDate2", "2015-07-14", "Incorrect date value retrieved from control after this control updated");
            });
      },

      "Entering invalid date produces correct error": function() {
         return browser.findById("VALID_DATE_VALUE_1_CONTROL")
            .clearValue()
            .type("foo")
            .end()

         .findByCssSelector("#VALID_DATE_VALUE_1 .validation-message")
            .isDisplayed()
            .then(function(isDisplayed) {
               assert.isTrue(isDisplayed, "Did not display error message");
            })
            .getVisibleText()
            .then(function(visibleText) {
               assert.equal(visibleText, "Enter a valid date", "Did not display correct error text");
            });
      },

      "Check that rule declaring textbox is not required initially": function() {
         return browser.findByCssSelector("#RULES_SUBSCRIBER .requirementIndicator")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The requirement indicator should not have been initially displayed");
            });
      },

      "Type a date to verify rules processing occurs on keyboard entry": function() {
         return browser.findById("RULES_CHECKER_CONTROL")
            .click()
            .type("05/05/1946")
         .end()
         .findByCssSelector("#RULES_SUBSCRIBER .requirementIndicator")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "The requirement indicator should be displayed on date entry via keyboard");
            });
      },

      "Clear the date to check that the textbox stops being required": function() {
         return browser.findById("RULES_CHECKER_CONTROL")
            .clearValue() // Clear the value, makes it less to delete via backspace...
            .type("1")    // ...add a single character to be deleted with backspace...
            .pressKeys(keys.BACKSPACE) // ...and delete
         .end()
         .findByCssSelector("#RULES_SUBSCRIBER .requirementIndicator")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The requirement indicator should be hidden when the date field is cleared");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});