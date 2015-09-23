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
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"], 
        function (registerSuite, assert, require, TestCommon, keys) {

registerSuite(function(){
   var browser;

   return {
      name: "Text Box Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/TextBox", "Text Box Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      // teardown: function() {
      //    browser.end();
      // },
      
     "Check that label is rendered correctly": function () {
         return browser.findByCssSelector("#BASIC .label")
            .getVisibleText()
            .then(function(resultText) {
               assert(resultText === "Basic", "The label was not rendered correctly: " + resultText);
            });
      },

      "Check that units are rendered correctly": function() {
         return browser.findByCssSelector("#UNITS_AND_DESCRIPTION .units")
            .getVisibleText()
            .then(function(resultText) {
               assert(resultText === "Some unit", "The units was not rendered correctly: " + resultText);
            });
      },

      "Check that initial value is set correctly": function() {
         return browser.findByCssSelector("#INITIAL_VALUE1 .dijitInputContainer input")
            .getProperty("value")
            .then(function(resultText) {
               assert(resultText === "Val1", "The initial value was not set correctly: " + resultText);
            });
      },

      "Check that SINGLE_POSITIVE_RULES widget is displayed": function() {
         return browser.findByCssSelector("#SINGLE_POSITIVE_RULES")
            .then(
               function() {
                  // No action;
               }, 
               function() {
                  assert(false, "Widget not displayed as expected");
               }
            );
      },

      "Check that SINGLE_NEGATIVE_RULES widget is hidden": function() {
         return browser.findByCssSelector("#SINGLE_NEGATIVE_RULES")
            .getComputedStyle("display")
            .then(function(result) {
               assert(result === "none", "Widget displayed unexpectedly");
            });
      },

      "Check that SINGLE_POSITIVE_RULES widget requirement indicator is shown": function() {
         return browser.findByCssSelector("#SINGLE_POSITIVE_RULES span.requirementIndicator")
            .getComputedStyle("display")
            .then(function(result) {
               assert(result === "inline-block", "Requirement indicator not displayed as expected");
            });
      },

      "Check requirement indicator": function() {
         return browser.findByCssSelector("#SINGLE_NEGATIVE_RULES span.requirementIndicator")
            .getComputedStyle("display")
            .then(function(result) {
               assert(result === "none", "Requirement indicator displayed unexpectedly");
            });
      },

      "Check field is disabled": function() {
         return browser.findByCssSelector("#SINGLE_POSITIVE_RULES .dijitInputContainer input")
            .isEnabled()
            .then(function(result) {
               assert(result === false, "Field should have been disabled");
            });
      },

      "Check field is enabled": function() {
         return browser.findByCssSelector("#SINGLE_NEGATIVE_RULES .dijitInputContainer input")
            .isEnabled()
            .then(function(result) {
               assert(result === true, "Field should have been enabled");
            });
      },

      "Check widget is hidden": function() {
         return browser.findByCssSelector("#INITIAL_VALUE1 .dijitInputContainer input")
            .type(keys.BACKSPACE)
         .end()
         .findByCssSelector("#SINGLE_POSITIVE_RULES")
            .getComputedStyle("display")
            .then(function(result) {
               assert(result === "none", "Widget displayed unexpectedly after processing positive rules");
            });
      },

      "Check widget is displayed": function() {
         return browser.findByCssSelector("#SINGLE_NEGATIVE_RULES")
            .then(function() {}, function() {
               assert(false, "Widget not displayed as expected after processing negative rules");
            });
      },

      "Check requirement indicator is displayed": function() {
         return browser.findByCssSelector("#INITIAL_VALUE2 .dijitInputContainer input")
            .type(keys.BACKSPACE)
         .end()
         .findByCssSelector("#SINGLE_NEGATIVE_RULES span.requirementIndicator")
            .getComputedStyle("display")
            .then(function(result) {
               assert(result === "inline-block", "Requirement indicator not displayed as expected");
            });
      },

      "Check requirement indicator is hidden": function() {
         return browser.findByCssSelector("#SINGLE_POSITIVE_RULES span.requirementIndicator")
            .getComputedStyle("display")
            .then(function(result) {
               assert(result === "none", "Requirement indicator displayed unexpectedly");
            });
      },

      "Check field is disabled on backspace": function() {
         return browser.findByCssSelector("#INITIAL_VALUE3 .dijitInputContainer input")
            .type(keys.BACKSPACE)
         .end()
         .findByCssSelector("#SINGLE_NEGATIVE_RULES .dijitInputContainer input")
            .isEnabled()
            .then(function(result) {
               assert(result === false, "Field should have been disabled");
            });
      },

      "Check field is enabled on backspace": function() {
         return browser.findByCssSelector("#SINGLE_POSITIVE_RULES .dijitInputContainer input")
            .isEnabled()
            .then(function(result) {
               assert(result === true, "Field should have been enabled");
            });
      },

      "Check widget displayed": function() {
         return browser.findByCssSelector("#INITIAL_VALUE1 .dijitInputContainer input")
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
               assert(false, "Widget not displayed as expected");
            });
      },

      "Check widget hidden": function() {
         return browser.findByCssSelector("#SINGLE_NEGATIVE_RULES")
            .getComputedStyle("display")
            .then(function(result) {
               assert(result === "none", "Widget displayed unexpectedly");
            });
      },

      "Check requirement indicator displayed": function() {
         return browser.findByCssSelector("#SINGLE_POSITIVE_RULES span.requirementIndicator")
            .getComputedStyle("display")
            .then(function(result) {
               assert(result === "inline-block", "Requirement indicator not displayed as expected");
            });
      },

      "Check requirement indicate hidden": function() {
         return browser.findByCssSelector("#SINGLE_NEGATIVE_RULES span.requirementIndicator")
            .getComputedStyle("display")
            .then(function(result) {
               assert(result === "none", "Requirement indicator displayed unexpectedly");
            });
      },

      "Check field is disabled (SINGLE_POSITIVE_RULES)": function() {
         return browser.findByCssSelector("#SINGLE_POSITIVE_RULES .dijitInputContainer input")
            .isEnabled()
            .then(function(result) {
               assert(result === false, "Field should have been disabled");
            });
      },

      "Check field is enabled (SINGLE_NEGATIVE_RULES)": function() {
         return browser.findByCssSelector("#SINGLE_NEGATIVE_RULES .dijitInputContainer input")
               .isEnabled()
               .then(function(result) {
                  assert(result === true, "Field should have been enabled");
               });
      },

      "Check widget is hidden (MULTIPLE_MIXED_RULES)": function() {
         return browser.findByCssSelector("#MULTIPLE_MIXED_RULES")
            .getComputedStyle("display")
            .then(function(result) {
               assert(result === "none", "Multiple mixed rule widget displayed unexpectedly");
            });
      },

      "Check widget is displayed (MULTIPLE_MIXED_RULES)": function() {
         return browser.findByCssSelector("#INITIAL_VALUE2 .dijitInputContainer input")
            .type("x")
         .end()
         .findByCssSelector("#MULTIPLE_MIXED_RULES")
            .getComputedStyle("display")
            .then(function(result) {
               assert(result !== "none", "Multiple mixed rule widget should be displayed");
            });
      },

      "Check widget is hidden again (MULTIPLE_MIXED_RULES)": function() {
         return browser.findByCssSelector("#INITIAL_VALUE1 .dijitInputContainer input")
            .type("x")
         .end()
         .findByCssSelector("#MULTIPLE_MIXED_RULES")
            .getComputedStyle("display")
            .then(function(result) {
               assert(result === "none", "Multiple mixed should be hidden again");
            });
      },

      "Check requirement indicator was hidden (MULTIPLE_MIXED_RULES)": function() {
         return browser.findByCssSelector("#INITIAL_VALUE1 .dijitInputContainer input")
            .type(keys.BACKSPACE)
         .end()
         // Requirement should be ON
         .findByCssSelector("#MULTIPLE_MIXED_RULES span.requirementIndicator")
            .getComputedStyle("display")
            .then(function(result) {
               assert(result === "inline-block", "Multiple mixed requirement indicator was not displayed");
            });
      },

      "Check widget is disabled (MULTIPLE_MIXED_RULES)": function() {
         return browser.findByCssSelector("#MULTIPLE_MIXED_RULES .dijitInputContainer input")
            .isEnabled()
            .then(function(result) {
               assert(result === false, "Multiple mixed should have been disabled");
            });
      },

      "Check requirement indicator is hidden (MULTIPLE_MIXED_RULES)": function() {
         return browser.findByCssSelector("#INITIAL_VALUE3 .dijitInputContainer input")
            .type("x")
         .end()
         .findByCssSelector("#MULTIPLE_MIXED_RULES span.requirementIndicator")
            .getComputedStyle("display")
            .then(function(result) {
               assert(result === "none", "Multiple mixed requirement indicator displayed unexpectedly");
            });
      },

      "Check widget is enabled (MULTIPLE_MIXED_RULES)": function() {
         return browser.findByCssSelector("#MULTIPLE_MIXED_RULES .dijitInputContainer input")
            .isEnabled()
            .then(function(result) {
               assert(result === true, "Multiple mixed should have been enabled");
            });
      },

      "Check validation error indicator": function() {
         return browser.findByCssSelector("#HAS_VALIDATION_CONFIG span.validation")
            .getComputedStyle("display")
            .then(function(result) {
               assert(result === "inline-block", "Validation error indicator should be displayed");
            });
      },

      "Check validation error message": function() {
         return browser.findByCssSelector("#HAS_VALIDATION_CONFIG span.validation-message")
            .getComputedStyle("display")
            .then(function(result) {
               assert(result === "inline-block", "Validation error message should be displayed");
            })
            .getVisibleText()
            .then(function(text) {
               assert(text === "Value must be a number", "Validation error message not set correctly");
            });
      },

      "Check validation error indicator is displayed (non-numeric)": function() {
         return browser.findByCssSelector("#HAS_VALIDATION_CONFIG .dijitInputContainer input")
            .type("x")
         .end()
         .findByCssSelector("#HAS_VALIDATION_CONFIG span.validation")
            .getComputedStyle("display")
            .then(function(result) {
               assert(result === "inline-block", "Validation error indicator should be displayed for non-numeric");
            });
      },

      "Check validation indicator is hidden (non-numeric)": function() {
         return browser.findByCssSelector("#HAS_VALIDATION_CONFIG .dijitInputContainer input")
            .type(keys.BACKSPACE)
            .type("1234")
         .end()
         .findByCssSelector("#HAS_VALIDATION_CONFIG span.validation")
            .getComputedStyle("display")
            .then(function(result) {
               assert(result === "none", "Validation error indicator should be hidden for numeric entry");
            });
      },

      "Check invalid configuration": function() {
         // TODO: Need assertions here...
         return browser.findByCssSelector("#INVALID_VALIDATION_CONFIG_1")
            .isDisplayed()
            .end()
         .findByCssSelector("#INVALID_VALIDATION_CONFIG_2")
            .isDisplayed();
      },

      "Check textbox with help is displayed": function() {
         return browser.findByCssSelector("#FORM_FIELD_WITH_HELP img.inlineHelp")
            .then(
               function() {
                  // No action;
               }, 
               function() {
                  assert(false, "Textbox with help is not displayed");
               }
            );
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});