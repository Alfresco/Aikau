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
 * @author Dave Draper
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert",
        "alfresco/TestCommon"],
        function(module, defineSuite, assert, TestCommon) {

   var formSelectors = TestCommon.getTestSelectors("alfresco/forms/Form");
   var textBoxSelectors = TestCommon.getTestSelectors("alfresco/forms/controls/TextBox");
   var selectSelectors = TestCommon.getTestSelectors("alfresco/forms/controls/Select");

   var selectors = {
      forms: {
         noInitialValidation: {
            confirmationButton: TestCommon.getTestSelector(formSelectors, "confirmation.button", ["NO_INITIAL_VALIDATION"]),
            disabledConfirmationButton: TestCommon.getTestSelector(formSelectors, "confirmation.button.disabled", ["NO_INITIAL_VALIDATION"])
         },
         disablementChanges: {
            confirmationButton: TestCommon.getTestSelector(formSelectors, "confirmation.button", ["FORM3"]),
            disabledConfirmationButton: TestCommon.getTestSelector(formSelectors, "confirmation.button.disabled", ["FORM3"])
         }
      },
      textBoxes: {
         tb1: {
            input: TestCommon.getTestSelector(textBoxSelectors, "input", ["TB1"])
         },
         tb2: {
            input: TestCommon.getTestSelector(textBoxSelectors, "input", ["TB2"])
         },
         tb3: {
            input: TestCommon.getTestSelector(textBoxSelectors, "input", ["TB3"])
         },
         tb5: {
            input: TestCommon.getTestSelector(textBoxSelectors, "input", ["TB5"])
         }
      },
      select: {
         firstOption: TestCommon.getTestSelector(selectSelectors, "nth.option.label", ["SELECT", "1"]),
         openIcon: TestCommon.getTestSelector(selectSelectors, "open.menu.icon", ["SELECT"]),
         secondOption: TestCommon.getTestSelector(selectSelectors, "nth.option.label", ["SELECT", "2"])
      }
   };

   defineSuite(module, {
      name: "Form Validation Display Tests",
      testPage: "/FormValidation",

      "Check that first field of second form is focused initially": function() {
         var focusedId;

         return this.remote.getActiveElement()
            .getAttribute("id")
            .then(function(id) {
               focusedId = id;
            })
            .end()

         .findByCssSelector("#TB3 .dijitInputInner")
            .getAttribute("id")
            .then(function(id) {
               assert.equal(focusedId, id);
            });
      },

      "Check that first form is NOT displayed as invalid on load": function() {
         return this.remote.findAllByCssSelector("#TB1.alfresco-forms-controls-BaseFormControl--invalid")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "The form control should not be marked as invalid (TB1)");
            })
         .end()
         
         .findAllByCssSelector("#TB2.alfresco-forms-controls-BaseFormControl--invalid")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "The form control should not be marked as invalid (TB2)");
            });
      },

      "Check that first form confirmation button is disabled": function() {
         return this.remote.findByCssSelector(selectors.forms.noInitialValidation.disabledConfirmationButton);
      },

      "Check that second form IS displayed as invalid on load": function() {
         return this.remote.findByCssSelector("#TB3.alfresco-forms-controls-BaseFormControl--invalid")
         .end()
      
         .findByCssSelector("#TB4.alfresco-forms-controls-BaseFormControl--invalid");
      },

      "Error indicators are only shown when form is invalid": function() {
         return this.remote.findByCssSelector("#TB1 .alfresco-forms-controls-BaseFormControl__validation-error")
            .isDisplayed()
            .then(function(isDisplayed) {
               assert.isFalse(isDisplayed, "Error image was shown on valid form control");
            })
         .end()

         .findByCssSelector("#TB1 .validation-message")
            .isDisplayed()
            .then(function(isDisplayed) {
               assert.isFalse(isDisplayed, "Error message was shown on valid form control");
            })
         .end()

         .findByCssSelector("#TB3 .alfresco-forms-controls-BaseFormControl__validation-error")
            .isDisplayed()
            .then(function(isDisplayed) {
               assert.isTrue(isDisplayed, "Error image was not shown on invalid form control");
            })
         .end()

         .findByCssSelector("#TB3 .validation-message")
            .isDisplayed()
            .then(function(isDisplayed) {
               assert.isTrue(isDisplayed, "Error message was not shown on invalid form control");
            });
      },

      "Give and remove focus to first text field and verify control is marked as invalid": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.tb1.input)
            .click()
         .end()
         
         .findByCssSelector(selectors.textBoxes.tb2.input)
            .click()
         .end()
         
         .findByCssSelector("#TB1.alfresco-forms-controls-BaseFormControl--invalid");
      },

      "Remove focus from second text field and verify control is marked as invalid": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.tb3.input)
            .click()
         .end()
         
         .findByCssSelector("#TB2.alfresco-forms-controls-BaseFormControl--invalid");
      },

      "Make third text field valid and then remove focus and verify that control is not marked as invalid": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.tb5.input)
            .clearValue()
            .type("abcde")
         .end()
      
         .findByCssSelector(selectors.textBoxes.tb3.input)
            .click()
         .end()

         .findAllByCssSelector("#TB5.alfresco-forms-controls-BaseFormControl--invalid")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "The control should not be marked as invalid (TB5)");
            });
      },

      "Disablement change form confirmation button is initially enabled": function() {
         return this.remote.findByCssSelector(selectors.forms.disablementChanges.confirmationButton)
         .end()

         .findAllByCssSelector(selectors.forms.disablementChanges.disabledConfirmationButton)
            .then(function(elements) {
               assert.lengthOf(elements, 0);
            });
      },

      "Selecting option to enable text area and make it required should disable form confirmation button": function() {
         return this.remote.findByCssSelector(selectors.select.openIcon)
            .click()
         .end()

         .findByCssSelector(selectors.select.secondOption)
            .click()
         .end()

         .findByCssSelector(selectors.forms.disablementChanges.confirmationButton);
      }
   });
});