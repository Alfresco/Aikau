/**
 * Copyright (C) 2005-2016 Alfresco Software Limited.
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
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"],
        function(module, defineSuite, assert, TestCommon, keys) {

   var baseFormControlSelectors = TestCommon.getTestSelectors("alfresco/forms/controls/BaseFormControl");
   var textBoxSelectors = TestCommon.getTestSelectors("alfresco/forms/controls/TextBox");

   var selectors = {
      textBoxes: {
         basic: {
            label: TestCommon.getTestSelector(baseFormControlSelectors, "label", ["BASIC"])
         },
         hasValidationConfig: {
            input: TestCommon.getTestSelector(textBoxSelectors, "input", ["HAS_VALIDATION_CONFIG"]),
            invalid: TestCommon.getTestSelector(baseFormControlSelectors, "invalid.state", ["HAS_VALIDATION_CONFIG"]),
            validationMessage: TestCommon.getTestSelector(baseFormControlSelectors, "validation.message", ["HAS_VALIDATION_CONFIG"])
         },
         initialValue1: {
            input: TestCommon.getTestSelector(textBoxSelectors, "input", ["INITIAL_VALUE1"])
         },
         initialValue2: {
            input: TestCommon.getTestSelector(textBoxSelectors, "input", ["INITIAL_VALUE2"])
         },
         initialValue3: {
            input: TestCommon.getTestSelector(textBoxSelectors, "input", ["INITIAL_VALUE3"])
         },
         multipleMixedRules: {
            input: TestCommon.getTestSelector(textBoxSelectors, "input", ["MULTIPLE_MIXED_RULES"]),
            requirementIndicator: TestCommon.getTestSelector(baseFormControlSelectors, "requirement.indicator", ["MULTIPLE_MIXED_RULES"])
         },
         singleNegativeRules: {
            input: TestCommon.getTestSelector(textBoxSelectors, "input", ["SINGLE_NEGATIVE_RULES"]),
            requirementIndicator: TestCommon.getTestSelector(baseFormControlSelectors, "requirement.indicator", ["SINGLE_NEGATIVE_RULES"])
         },
         singlePostitiveRules: {
            input: TestCommon.getTestSelector(textBoxSelectors, "input", ["SINGLE_POSITIVE_RULES"]),
            requirementIndicator: TestCommon.getTestSelector(baseFormControlSelectors, "requirement.indicator", ["SINGLE_POSITIVE_RULES"])
         },
         unitsAndDescription: {
            units: TestCommon.getTestSelector(baseFormControlSelectors, "units", ["UNITS_AND_DESCRIPTION"])
         },
         withHelp: {
            helpIndicator: TestCommon.getTestSelector(baseFormControlSelectors, "help.indicator", ["FORM_FIELD_WITH_HELP"])
         }
      }
   };

   defineSuite(module, {
      name: "Text Box Tests",
      testPage: "/TextBox",

      "Check that label is rendered correctly": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.basic.label)
            .getVisibleText()
            .then(function(resultText) {
               assert.equal(resultText, "Basic");
            });
      },

      "Check that units are rendered correctly": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.unitsAndDescription.units)
            .getVisibleText()
            .then(function(resultText) {
               assert.equal(resultText, "Some unit");
            });
      },

      "Check that initial value is set correctly": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.initialValue1.input)
            .getProperty("value")
            .then(function(resultText) {
               assert.equal(resultText, "Val1");
            });
      },

      "Check that SINGLE_POSITIVE_RULES widget is displayed": function() {
         return this.remote.findDisplayedByCssSelector("#SINGLE_POSITIVE_RULES");
      },

      "Check that SINGLE_NEGATIVE_RULES widget is hidden": function() {
         return this.remote.findByCssSelector("#SINGLE_NEGATIVE_RULES")
            .getComputedStyle("display")
            .then(function(result) {
               assert.equal(result, "none");
            });
      },

      "Check that SINGLE_POSITIVE_RULES widget requirement indicator is shown": function() {
         return this.remote.findDisplayedByCssSelector(selectors.textBoxes.singlePostitiveRules.requirementIndicator);
      },

      "Check requirement indicator": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.singleNegativeRules.requirementIndicator)
            .getComputedStyle("display")
            .then(function(result) {
               assert.equal(result, "none");
            });
      },

      "Check field is disabled": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.singlePostitiveRules.input)
            .isEnabled()
            .then(function(result) {
               assert.isFalse(result);
            });
      },

      "Check field is enabled": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.singleNegativeRules.input)
            .isEnabled()
            .then(function(result) {
               assert.isTrue(result);
            });
      },

      "Check widget is dynamically hidden": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.initialValue1.input)
            .type(keys.BACKSPACE)
            .end()

         .findByCssSelector("#SINGLE_POSITIVE_RULES")
            .getComputedStyle("display")
            .then(function(result) {
               assert.equal(result, "none", "Widget displayed unexpectedly after processing positive rules");
            });
      },

      "Check widget is displayed": function() {
         return this.remote.findDisplayedByCssSelector("#SINGLE_NEGATIVE_RULES");
      },

      "Check requirement indicator is displayed": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.initialValue2.input)
            .type(keys.BACKSPACE)
            .end()

         .findDisplayedByCssSelector(selectors.textBoxes.singleNegativeRules.requirementIndicator);
      },

      "Check requirement indicator is hidden": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.singlePostitiveRules.requirementIndicator)
            .getComputedStyle("display")
            .then(function(result) {
               assert.equal(result, "none", "Requirement indicator displayed unexpectedly");
            });
      },

      "Check field is disabled on backspace": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.initialValue3.input)
            .type(keys.BACKSPACE)
            .end()

         .findByCssSelector(selectors.textBoxes.singleNegativeRules.input)
            .isEnabled()
            .then(function(result) {
               assert.isFalse(result);
            });
      },

      "Check field is enabled on backspace": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.singlePostitiveRules.input)
            .isEnabled()
            .then(function(result) {
               assert.isTrue(result);
            });
      },

      "Check widget displayed": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.initialValue1.input)
            .type("1")
            .end()

         .findByCssSelector(selectors.textBoxes.initialValue2.input)
            .type("2")
            .end()

         .findByCssSelector(selectors.textBoxes.initialValue3.input)
            .type("3")
            .end()

         .findDisplayedByCssSelector("#SINGLE_POSITIVE_RULES");
      },

      "Check widget hidden": function() {
         return this.remote.findByCssSelector("#SINGLE_NEGATIVE_RULES")
            .getComputedStyle("display")
            .then(function(result) {
               assert.equal(result, "none");
            });
      },

      "Check requirement indicator displayed": function() {
         return this.remote.findDisplayedByCssSelector(selectors.textBoxes.singlePostitiveRules.requirementIndicator);
      },

      "Check requirement indicate hidden": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.singleNegativeRules.requirementIndicator)
            .getComputedStyle("display")
            .then(function(result) {
               assert.equal(result, "none");
            });
      },

      "Check field is disabled (SINGLE_POSITIVE_RULES)": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.singlePostitiveRules.input)
            .isEnabled()
            .then(function(result) {
               assert.isFalse(result);
            });
      },

      "Check field is enabled (SINGLE_NEGATIVE_RULES)": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.singleNegativeRules.input)
            .isEnabled()
            .then(function(result) {
               assert.isTrue(result);
            });
      },

      "Check widget is hidden (MULTIPLE_MIXED_RULES)": function() {
         return this.remote.findByCssSelector("#MULTIPLE_MIXED_RULES")
            .getComputedStyle("display")
            .then(function(result) {
               assert.equal(result, "none");
            });
      },

      "Check widget is displayed (MULTIPLE_MIXED_RULES)": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.initialValue2.input)
            .type("x")
            .end()

         .findDisplayedByCssSelector("#MULTIPLE_MIXED_RULES");
      },

      "Check widget is hidden again (MULTIPLE_MIXED_RULES)": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.initialValue1.input)
            .type("x")
            .end()

         .findByCssSelector("#MULTIPLE_MIXED_RULES")
            .getComputedStyle("display")
            .then(function(result) {
               assert.equal(result, "none");
            });
      },

      "Check requirement indicator was displayed (MULTIPLE_MIXED_RULES)": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.initialValue1.input)
            .type(keys.BACKSPACE)
            .end()

         // Requirement should be ON
         .findDisplayedByCssSelector(selectors.textBoxes.multipleMixedRules.requirementIndicator);
      },

      "Check widget is disabled (MULTIPLE_MIXED_RULES)": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.multipleMixedRules.input)
            .isEnabled()
            .then(function(result) {
               assert.isFalse(result, "Multiple mixed should have been disabled");
            });
      },

      "Check requirement indicator is hidden (MULTIPLE_MIXED_RULES)": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.initialValue3.input)
            .type("x")
            .end()

         .findByCssSelector(selectors.textBoxes.multipleMixedRules.requirementIndicator)
            .getComputedStyle("display")
            .then(function(result) {
               assert.equal(result, "none");
            });
      },

      "Check widget is enabled (MULTIPLE_MIXED_RULES)": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.multipleMixedRules.input)
            .isEnabled()
            .then(function(result) {
               assert.isTrue(result);
            });
      },

      "Check validation error indicator": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.hasValidationConfig.invalid);
      },

      "Check validation error message": function() {
         return this.remote.findDisplayedByCssSelector(selectors.textBoxes.hasValidationConfig.validationMessage)
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Value must be a number");
            });
      },

      "Check validation error indicator is displayed (non-numeric)": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.hasValidationConfig.input)
            .type("x")
            .end()

         .findByCssSelector(selectors.textBoxes.hasValidationConfig.invalid);
      },

      "Check validation indicator is hidden (non-numeric)": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.hasValidationConfig.input)
            .type(keys.BACKSPACE)
            .type("1234")
            .end()

         .findAllByCssSelector(selectors.textBoxes.hasValidationConfig.invalid)
            .then(function(elements) {
               assert.lengthOf(elements, 0);
            });
      },

      "Check invalid configuration": function() {
         return this.remote.findDisplayedByCssSelector("#INVALID_VALIDATION_CONFIG_1")
            .end()

         .findDisplayedByCssSelector("#INVALID_VALIDATION_CONFIG_2");
      },

      "Check textbox with help is displayed": function() {
         return this.remote.findDisplayedByCssSelector(selectors.textBoxes.withHelp.helpIndicator);
      }
   });
});