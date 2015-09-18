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
        function (registerSuite, assert, require, TestCommon) {

registerSuite(function(){
   var browser;

   return {
      name: "Form Validation Display Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/FormValidation", "Form Validation Display Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Check that first form does NOT show validation errors on load": function() {
         return browser.findAllByCssSelector("#TB1 .validation-error")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "The error icon should not have been displayed (TB1)");
            })
         .end()
         .findByCssSelector("#TB1 .validation-message")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The error message should not have been displayed (TB1)");
            })
         .end()
         .findAllByCssSelector("#TB2 .validation-error")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "The error icon should not have been displayed (TB1)");
            })
         .end()
         .findByCssSelector("#TB2 .validation-message")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The error message should not have been displayed (TB2)");
            });
      },

      "Check that first form confirmation button is disabled": function() {
         return browser.findAllByCssSelector("#NO_INITIAL_VALIDATION .buttons .alfresco-buttons-AlfButton.confirmationButton.dijitButtonDisabled")
            .then(function(elements) {
               assert(elements.length === 1, "Confirmation button was not initially disabled");
            });
      },

      "Check that seoond form DOES show validation errors on load": function() {
         return browser.findByCssSelector("#TB3 .validation-error")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "The error icon SHOULD have been displayed (TB3)");
            })
         .end()
         .findByCssSelector("#TB3 .validation-message")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "The error message SHOULD have been displayed (TB3)");
            })
         .end()
         .findByCssSelector("#TB4 .validation-error")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "The error icon SHOULD have been displayed (TB4)");
            })
         .end()
         .findByCssSelector("#TB4 .validation-message")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "The error message SHOULD have been displayed (TB4)");
            });
      },

      "Give and remove focus to first text field and verify error message is displayed": function() {
         return browser.findByCssSelector("#TB1 .dijitInputContainer input")
            .click()
         .end()
         .findByCssSelector("#TB2 .dijitInputContainer input")
            .click()
         .end()
         .findByCssSelector("#TB1 .validation-error")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "The error icon SHOULD have been displayed (TB1)");
            })
         .end()
         .findByCssSelector("#TB1 .validation-message")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "The error message SHOULD have been displayed (TB1)");
            });
      },

      "Remove focus from second text field and verify error message is displayed": function() {
         return browser.findByCssSelector("#TB3 .dijitInputContainer input")
            .click()
         .end()
         .findByCssSelector("#TB2 .validation-error")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "The error icon SHOULD have been displayed (TB2)");
            })
         .end()
         .findByCssSelector("#TB2 .validation-message")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "The error message SHOULD have been displayed (TB2)");
            });
      },

      "Make third text field valid and then remove focus and verify that error indicator is not displayed": function() {
         return browser.findByCssSelector("#TB5 .dijitInputContainer input")
            .clearValue()
            .type("abcde")
         .end()
         .findByCssSelector("#TB3 .dijitInputContainer input")
            .click()
         .end()
         .findAllByCssSelector("#TB5 .validation-error")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "The error icon should NOT have been displayed (TB5)");
            })
         .end()
         .findByCssSelector("#TB5 .validation-message")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The error message should NOT have been displayed (TB5)");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});