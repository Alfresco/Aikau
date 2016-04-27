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
        "alfresco/TestCommon"],
        function(module, defineSuite, assert, TestCommon) {

   var formSelectors = TestCommon.getTestSelectors("alfresco/forms/Form");
   var textBoxSelectors = TestCommon.getTestSelectors("alfresco/forms/controls/TextBox");
   var formControlSelectors = TestCommon.getTestSelectors("alfresco/forms/controls/BaseFormControl");
   var buttonSelectors = TestCommon.getTestSelectors("alfresco/buttons/AlfButton");
   var dialogSelectors = TestCommon.getTestSelectors("alfresco/dialogs/AlfDialog");

   var selectors = {
      form: {
         confirmationButton: TestCommon.getTestSelector(formSelectors, "confirmation.button", ["TEST_FORM"]),
         disabledConfirmationButton: TestCommon.getTestSelector(formSelectors, "confirmation.button.disabled", ["TEST_FORM"])
      },
      textBoxes: {
         threeLettersOrMore: {
            input: TestCommon.getTestSelector(textBoxSelectors, "input", ["TEST_CONTROL"]),
            validationMessage: TestCommon.getTestSelector(formControlSelectors, "validation.message", ["TEST_CONTROL"]),
            validating: TestCommon.getTestSelector(formControlSelectors, "validating.state", ["TEST_CONTROL"])
         },
         invert: {
            input: TestCommon.getTestSelector(textBoxSelectors, "input", ["TEST_CONTROL_INVERT"]),
            validationMessage: TestCommon.getTestSelector(formControlSelectors, "validation.message", ["TEST_CONTROL_INVERT"])
         },
         topicValidation: {
            input: TestCommon.getTestSelector(textBoxSelectors, "input", ["TOPIC_VALIDATION"]),
            validationMessage: TestCommon.getTestSelector(formControlSelectors, "validation.message", ["TOPIC_VALIDATION"])
         },
         matchTarget: {
            input: TestCommon.getTestSelector(textBoxSelectors, "input", ["MATCH_TARGET"]),
            validationMessage: TestCommon.getTestSelector(formControlSelectors, "validation.message", ["MATCH_TARGET"])
         },
         matchSource: {
            input: TestCommon.getTestSelector(textBoxSelectors, "input", ["MATCH_SOURCE"]),
            validationMessage: TestCommon.getTestSelector(formControlSelectors, "validation.message", ["MATCH_SOURCE"])
         },
         dialogTextBox: {
            validationMessage: TestCommon.getTestSelector(formControlSelectors, "validation.message", ["DIALOG_FORM_TEXTBOX"])
         },
         
      },
      buttons: {
         blockResponse: TestCommon.getTestSelector(buttonSelectors, "button.label", ["BLOCK_RESPONSE"]),
         unblockResponse: TestCommon.getTestSelector(buttonSelectors, "button.label", ["UNBLOCK_RESPONSE"]),
         showValidationDialog: TestCommon.getTestSelector(buttonSelectors, "button.label", ["SHOW_VALIDATION_IN_DIALOG"]),
      },
      dialogs: {
         checkMessage: {
            confirmationButton: TestCommon.getTestSelector(dialogSelectors, "form.dialog.confirmation.button", ["VALIDATION_DIALOG"]),
            disabledConfirmationButton: TestCommon.getTestSelector(dialogSelectors, "disabled.form.dialog.confirmation.button", ["VALIDATION_DIALOG"]),
            displayed: TestCommon.getTestSelector(dialogSelectors, "visible.dialog", ["VALIDATION_DIALOG"]),
            hidden: TestCommon.getTestSelector(dialogSelectors, "hidden.dialog", ["VALIDATION_DIALOG"]),
         }
      }
   };

   defineSuite(module, {
      name: "Advanced Form Validation Tests",
      testPage: "/Validation",

      "Check that the form is initially invalid": function() {
         return this.remote.findByCssSelector(selectors.form.disabledConfirmationButton);
      },

      "Check the initial error messages (1)": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.threeLettersOrMore.validationMessage)
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Too short, Letters only");
            });
      },

      "Check the initial error messages (2)": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.invert.validationMessage)
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Too short");
            });
      },

      "Check the in-progress indicator isn't shown": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.threeLettersOrMore.validating)
            .isDisplayed()
            .then(function(result) {
               assert.isFalse(result);
            });
      },

      // Add 3 letters to both controls (make sure errors are cleared and form can be posted)...
      "Check form confirmation button is enabled": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.threeLettersOrMore.input)
            .type("abc")
            .end()

         .findByCssSelector(selectors.textBoxes.invert.input)
            .type("abc")
            .end()

         .findAllByCssSelector(selectors.form.disabledConfirmationButton)
            .then(function(elements) {
               assert.lengthOf(elements, 0, "The forms confirmation button should be enabled");
            });
      },

      "Check that error message has been removed (1)": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.threeLettersOrMore.validationMessage)
            .isDisplayed()
            .then(function(result) {
               assert.isFalse(result);
            });
      },

      "Check that error message has been removed (2)": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.invert.validationMessage)
            .isDisplayed()
            .then(function(result) {
               assert.isFalse(result);
            });
      },

      // Add 6 letters to control 1 (make sure field is invalid and message is correct)...
      "Test confirmation button disabled (too many chars)": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.threeLettersOrMore.input)
            .clearValue()
            .type("abcdef")
            .end()

         .findByCssSelector(selectors.form.disabledConfirmationButton);
      },

      "Test error message (too many chars)": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.threeLettersOrMore.validationMessage)
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Too long");
            });
      },

      // Add numbers to control 1 (make sure field is invalid and message is correct)...
      "Test confirmation button disabled (invalid chars)": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.threeLettersOrMore.input)
            .clearValue()
            .type("123")
            .end()

         .findByCssSelector(selectors.form.disabledConfirmationButton);
      },

      "Test error message (invalid chars)": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.threeLettersOrMore.validationMessage)
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Letters only");
            });
      },

      // Add a value to control 1 that is used (make sure field is invalid and message is correct)...
      "Test confirmation button disabled (duplicate value)": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.threeLettersOrMore.input)
            .clearValue()
            .type("One")
            .end()

         .findByCssSelector(selectors.form.disabledConfirmationButton);
      },

      "Test error message (duplicate value)": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.threeLettersOrMore.validationMessage)
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Already used");
            });
      },

      // Add a value to control 2 that contains illegal characters (make sure field is invalid and message is correct)...
      "Test confirmation button is disabled (more illegal chars)": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.invert.input)
            .clearValue()
            .type("abc>def/")
            .end()

         .findByCssSelector(selectors.form.disabledConfirmationButton);
      },

      "Test error message (more illegal chars)": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.invert.validationMessage)
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "No illegal characters");
            });
      },

      // Check asynchoronous behaviour...
      "Test asynchoronous validation indicator gets displayed": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.threeLettersOrMore.input)
            .clearValue()
            .end()

         .findByCssSelector(selectors.buttons.blockResponse)
            .click()
            .end()

         .findByCssSelector(selectors.textBoxes.threeLettersOrMore.input)
            .type("O")
            .end()

         .findDisplayedByCssSelector(selectors.textBoxes.threeLettersOrMore.validating);
      },

      "Test progress indicator is removed": function() {
         return this.remote.findByCssSelector(selectors.buttons.unblockResponse)
            .click()
            .click() // Needs the 2nd click!
            .end()

         .findByCssSelector(selectors.textBoxes.threeLettersOrMore.validating)
            .isDisplayed()
            .then(function(result) {
               assert.isFalse(result);
            });
      },

      // Need to make the form valid before the next test!
      "Test confirmation button gets enabled": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.threeLettersOrMore.input)
            .clearValue()
            .type("abc")
            .end()
            .findByCssSelector(selectors.textBoxes.invert.input)
            .clearValue()
            .type("abc")
            .end()
            .findAllByCssSelector(selectors.form.disabledConfirmationButton)
            .then(function(elements) {
               assert.lengthOf(elements, 0, "The forms confirmation button should be enabled");
            });
      },

      "Test validationTopic returns a failure": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.topicValidation.input)
            .clearValue()
            .type("#fail")
            .end()

         .findByCssSelector(selectors.form.disabledConfirmationButton);
      },

      "Test validationTopic returns success": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.topicValidation.input)
            .clearValue()
            .type("success")
            .end()

         .findAllByCssSelector(selectors.form.disabledConfirmationButton)
            .then(function(elements) {
               assert.lengthOf(elements, 0, "The forms confirmation button should be enabled");
            });
      },

      "Test Match Validation - Source Change": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.matchTarget.input)
            .clearValue()
            .type("ABC")
            .end()

         .findByCssSelector(selectors.form.disabledConfirmationButton);
      },

      "Test Match Validation - Target Match": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.matchSource.input)
            .clearValue()
            .type("ABC")
            .end()

         .findAllByCssSelector(selectors.form.disabledConfirmationButton)
            .then(function(elements) {
               assert.lengthOf(elements, 0, "The forms confirmation button should be enabled");
            });
      },

      "Test Match Validation - Target Mismatch": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.matchTarget.input)
            .clearValue()
            .type("AB")
            .end()

         .findByCssSelector(selectors.form.disabledConfirmationButton);
      },

      "Test Match Validation - Source Match Again": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.matchSource.input)
            .clearValue()
            .type("AB")
            .end()

         .findAllByCssSelector(selectors.form.disabledConfirmationButton)
            .then(function(elements) {
               assert.lengthOf(elements, 0, "The forms confirmation button should be disabled");
            });
      },

      "Validation message visible with no label in form dialog": function() {
         return this.remote.findByCssSelector(selectors.buttons.showValidationDialog)
            .click()
         .end()

         .findByCssSelector(selectors.dialogs.checkMessage.displayed)
         .end()

         .findDisplayedByCssSelector(selectors.textBoxes.dialogTextBox.validationMessage);
      }
   });
});