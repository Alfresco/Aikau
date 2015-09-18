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

registerSuite(function(){
   var browser;

   return {
      name: "Number Spinner Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/NumberSpinner", "Number Spinner Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Test that the confirmation button isn't disabled": function() {
         // AKU-271 - NumberSpinners report requirement failure when value is 0...
         // The 3rd NumberSpinner is both required and has a value of 0 so we need to check that the
         // form's ok button isn't disabled
         return browser.findAllByCssSelector(".confirmationButton .dijitButtonDisabled")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "The confirmation button should not have been disabled");
            });
      },

      "Test that values honour min allowed": function() {
         // AKU-272 - NumberSpinners show Dojo validation errors when invalid
         // By making sure values fall within the min and max constraints we prevent the Dojo validation errors appearing
         return browser.findByCssSelector("#NS2 .dijitInputContainer input")
            .getProperty("value")
            .then(function(value) {
               assert.equal(value, "5", "The value wasn't updated to meet the min required value");
            });
      },

      "Set value below min (range validation)": function() {
         return browser.findByCssSelector("#NS2 .dijitInputContainer input")
            .clearValue()
            .type("4")
            .end()
            .findByCssSelector("#NS2 span.validation-message")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "Validation error message should be displayed");
            })
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Enter a number that's at least 5 and no more than 10", "Validation error message not set correctly");
            });
      },

      "Set value above max (range validation)": function() {
         return browser.findByCssSelector("#NS2 .dijitInputContainer input")
            .clearValue()
            .type("11")
            .end()
            .findByCssSelector("#NS2 span.validation-message")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "Validation error message should be displayed");
            })
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Enter a number that's at least 5 and no more than 10", "Validation error message not set correctly");
            });
      },

      "Clear error message": function() {
         return browser.findByCssSelector("#NS2 .dijitInputContainer input")
            .clearValue()
            .type("7")
            .end()
            .findByCssSelector("#NS2 span.validation-message")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "Validation error message should have been removed");
            });
      },

      "Set value below min (min only validation)": function() {
         return browser.findByCssSelector("#NS4 .dijitInputContainer input")
            .clearValue()
            .type("0")
            .end()
            .findByCssSelector("#NS4 span.validation-message")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "Validation error message should be displayed");
            })
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Enter a number that's at least 1", "Validation error message not set correctly");
            });
      },

      "Set value above max (max only validation)": function() {
         return browser.findByCssSelector("#NS5 .dijitInputContainer input")
            .clearValue()
            .type("8")
            .end()
            .findByCssSelector("#NS5 span.validation-message")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "Validation error message should be displayed");
            })
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Enter a number that's no more than 5", "Validation error message not set correctly");
            });
      },

      "Enter a non numerical value": function() {
         return browser.findByCssSelector("#NS1 .dijitInputContainer input")
            .clearValue()
            .type("a")
            .end()
            .findByCssSelector("#NS1 span.validation-message")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "Validation error message should be displayed");
            })
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Enter a number", "Validation error message not set correctly");
            });
      },

      "Check number with commas is valid": function() {
         return browser.findByCssSelector("#NS6 span.validation-message")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "Validation error message should NOT be displayed");
            });
      },

      "Empty values are only permitted when permitEmpty specified": function() {
         return browser.findByCssSelector("#NS1 .dijitInputContainer input")
            .clearValue()
            .end()

         .findAllByCssSelector("#NS1 .validation-error")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Standard number spinner should not permit empty values");
            })
            .end()

         .findByCssSelector("#NS7 .dijitInputContainer input")
            .clearValue()
            .end()

         .findAllByCssSelector("#NS7 .validation-error")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "'permitEmpty' number spinner should allow empty values");
            });
      },

      "Empty value submits null value": function() {
         return browser.findByCssSelector(".alfresco-buttons-AlfButton[widgetid=\"RESET_VALUES\"] .dijitButtonNode")
            .click()
            .end()

         .findByCssSelector("#NS1 .dijitInputContainer input")
            .type("0")
            .end()

         .findByCssSelector(".confirmationButton .dijitButtonNode")
            .click()
            .end()

         .getLastPublish("FORM_POST")
            .then(function(payload) {
               assert.propertyVal(payload, "seven", null, "Did not publish null value for empty number spinner");
            });
      },

      "Trailing decimal point is always invalid": function() {
         return browser.findByCssSelector("#NS1 .dijitInputContainer input")
            .clearValue()
            .type("5.")
            .end()

         .findByCssSelector("#NS1 span.validation-message")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "Validation error message should be displayed");
            })
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Enter a number", "Validation error message not set correctly");
            })
            .end()

         .findByCssSelector("#NS8 .dijitInputContainer input")
            .clearValue()
            .type("5.")
            .end()

         .findByCssSelector("#NS8 span.validation-message")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "Validation error message should be displayed");
            })
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Enter a number", "Validation error message not set correctly");
            });
      },

      "Decimal point is only valid when configured properly": function() {
         return browser.findByCssSelector("#NS1 .dijitInputContainer input")
            .clearValue()
            .type("5.5")
            .end()

         .findByCssSelector("#NS1 span.validation-message")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "Validation error message should be displayed");
            })
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Number should be whole number", "Validation error message not set correctly");
            })
            .end()

         .findByCssSelector("#NS8 .dijitInputContainer input")
            .clearValue()
            .type("5.5")
            .end()

         .findByCssSelector("#NS8 span.validation-message")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "Validation error message should be displayed");
            })
            .end()

         .findByCssSelector("#NS8 .dijitInputContainer input")
            .type("6")
            .end()

         .findByCssSelector("#NS8 span.validation-message")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "Validation error message should be displayed");
            })
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Number should use exactly 1 decimal place", "Validation error message not set correctly");
            });
      },

      // Make sure this is always the final test, and update accordingly
      "All values publish correctly": function() {
         return browser.findByCssSelector(".alfresco-buttons-AlfButton[widgetid=\"RESET_VALUES\"] .dijitButtonNode")
            .click()
            .end()

         .findByCssSelector("#NS1 .dijitInputContainer input")
            .type("0")
            .end()

         .findByCssSelector(".confirmationButton .dijitButtonNode")
            .click()
            .end()

         .getLastPublish("FORM_POST")
            .then(function(payload) {
               assert.propertyVal(payload, "one", 0, "Invalid published value for control with ID \"NS1\"");
               assert.propertyVal(payload, "two", 5, "Invalid published value for control with ID \"NS2\"");
               assert.propertyVal(payload, "three", 0, "Invalid published value for control with ID \"NS3\"");
               assert.propertyVal(payload, "four", 1, "Invalid published value for control with ID \"NS4\"");
               assert.propertyVal(payload, "five", 3, "Invalid published value for control with ID \"NS5\"");
               assert.propertyVal(payload, "six", 1001, "Invalid published value for control with ID \"NS6\"");
               assert.propertyVal(payload, "seven", null, "Invalid published value for control with ID \"NS7\"");
               assert.propertyVal(payload, "eight", 5.5, "Invalid published value for control with ID \"NS8\"");
            });
      },
      // Make sure this is always the final test, and update accordingly

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});