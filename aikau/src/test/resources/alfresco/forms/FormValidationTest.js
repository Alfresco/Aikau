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
        "intern/chai!assert"],
        function(module, defineSuite, assert) {

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
         return this.remote.findAllByCssSelector("#NO_INITIAL_VALIDATION .buttons .alfresco-buttons-AlfButton.confirmationButton.dijitButtonDisabled")
            .then(function(elements) {
               assert(elements.length === 1, "Confirmation button was not initially disabled");
            });
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
         return this.remote.findByCssSelector("#TB1 .dijitInputContainer input")
            .click()
            .end()
            .findByCssSelector("#TB2 .dijitInputContainer input")
            .click()
            .end()
            .findByCssSelector("#TB1.alfresco-forms-controls-BaseFormControl--invalid");
      },

      "Remove focus from second text field and verify control is marked as invalid": function() {
         return this.remote.findByCssSelector("#TB3 .dijitInputContainer input")
            .click()
            .end()
            .findByCssSelector("#TB2.alfresco-forms-controls-BaseFormControl--invalid");
      },

      "Make third text field valid and then remove focus and verify that control is not marked as invalid": function() {
         return this.remote.findByCssSelector("#TB5 .dijitInputContainer input")
            .clearValue()
            .type("abcde")
            .end()
            .findByCssSelector("#TB3 .dijitInputContainer input")
            .click()
            .end()
            .findAllByCssSelector("#TB5.alfresco-forms-controls-BaseFormControl--invalid")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "The control should not be marked as invalid (TB5)");
            });
      }
   });
});