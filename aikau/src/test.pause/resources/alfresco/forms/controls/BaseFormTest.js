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
 * This is a unit test for the BaseForm control
 *
 * @author Richard Smith
 * @author Martin Doyle
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert",
        "intern/dojo/node!leadfoot/keys",
        "alfresco/TestCommon"],
        function(module, defineSuite, assert, keys, TestCommon) {

   var formSelectors = TestCommon.getTestSelectors("alfresco/forms/Form");
   var textBoxSelectors = TestCommon.getTestSelectors("alfresco/forms/controls/TextBox");
   var buttonSelectors = TestCommon.getTestSelectors("alfresco/buttons/AlfButton");

   var selectors = {
      forms: {
         basic: {
            confirmationButton: TestCommon.getTestSelector(formSelectors, "confirmation.button", ["BASIC_FORM"]),
            cancelButton: TestCommon.getTestSelector(formSelectors, "cancellation.button", ["BASIC_FORM"]),
            hiddenConfirmationButton: TestCommon.getTestSelector(formSelectors, "hidden.confirmation.button", ["BASIC_FORM"]),
            hiddenCancelButton: TestCommon.getTestSelector(formSelectors, "hidden.cancellation.button", ["BASIC_FORM"])
         },
         autoSave: {
            confirmationButton: TestCommon.getTestSelector(formSelectors, "confirmation.button", ["AUTOSAVE_FORM"]),
            cancelButton: TestCommon.getTestSelector(formSelectors, "cancellation.button", ["AUTOSAVE_FORM"])
         },
         enterForm: {
            confirmationButton: TestCommon.getTestSelector(formSelectors, "confirmation.button", ["ENTER_FORM"]),
         }
      },
      textBoxes: {
         basic: {
            input: TestCommon.getTestSelector(textBoxSelectors, "input", ["FORM_FIELD"])
         },
         autoSave: {
            input: TestCommon.getTestSelector(textBoxSelectors, "input", ["AUTOSAVE_FORM_FIELD"])
         },
         invalidAutoSave: {
            input: TestCommon.getTestSelector(textBoxSelectors, "input", ["AUTOSAVE_INVALID_FORM_FIELD"])
         },
         submitOnEnter: {
            input: TestCommon.getTestSelector(textBoxSelectors, "input", ["ENTER_TEXT_FIELD"])
         }
      },
      buttons: {
         setValue1: TestCommon.getTestSelector(buttonSelectors, "button.label", ["SET_FORM_VALUE_1"]),
         setValue2: TestCommon.getTestSelector(buttonSelectors, "button.label", ["SET_FORM_VALUE_2"]),
         setValue3: TestCommon.getTestSelector(buttonSelectors, "button.label", ["SET_FORM_VALUE_3"]),
         setValue4: TestCommon.getTestSelector(buttonSelectors, "button.label", ["SET_FORM_VALUE_4"]),
         setValue5: TestCommon.getTestSelector(buttonSelectors, "button.label", ["SET_FORM_VALUE_5"]),
         clearAutoSave: TestCommon.getTestSelector(buttonSelectors, "button.label", ["CLEAR_AUTOSAVE_1"])
      }
   };

   defineSuite(module, {
      name: "Base Form Control Tests",
      testPage: "/BaseForm",

      "Checking the form field is initially empty": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.basic.input)
            .getProperty("value")
            .then(function(value) {
               assert.equal(value, "", "Form field not initially empty");
            });
      },

      "No payload does not update value": function() {
         return this.remote.findByCssSelector(selectors.buttons.setValue1)
            .click()
            .end()

         .findByCssSelector(selectors.textBoxes.basic.input)
            .getProperty("value")
            .then(function(value) {
               assert.equal(value, "", "No payload published but field value updated");
            });
      },

      "Invalid field name does not update value": function() {
         return this.remote.findByCssSelector(selectors.buttons.setValue2)
            .click()
            .end()

         .findByCssSelector(selectors.textBoxes.basic.input)
            .getProperty("value")
            .then(function(value) {
               assert.equal(value, "", "Invalid field name provided but value updated");
            });
      },

      "Setting string value updates field appropriately": function() {
         return this.remote.findByCssSelector(selectors.buttons.setValue3)
            .click()
            .end()

         .findByCssSelector(selectors.textBoxes.basic.input)
            .getProperty("value")
            .then(function(value) {
               assert.equal(value, "this is the new value", "Field value not updated to published string value");
            });
      },

      "Setting number value updates field appropriately": function() {
         return this.remote.findByCssSelector(selectors.buttons.setValue4)
            .click()
            .end()

         .findByCssSelector(selectors.textBoxes.basic.input)
            .getProperty("value")
            .then(function(value) {
               assert.equal(value, "3.14159265", "Field value not updated to published numeric value");
            });
      },

      "Setting boolean value updates field appropriately": function() {
         return this.remote.findByCssSelector(selectors.buttons.setValue5)
            .click()
            .end()

         .findByCssSelector(selectors.textBoxes.basic.input)
            .getProperty("value")
            .then(function(value) {
               assert.equal(value, "true", "Field value not updated to published boolean value");
            });
      },

      "Autosave on a form removes OK/Cancel buttons": function() {
         return this.remote.findAllByCssSelector(selectors.forms.basic.confirmationButton + ", " + selectors.forms.basic.cancelButton)
            .then(function(elements) {
               assert.lengthOf(elements, 2, "OK/Cancel buttons not found on basic form");
            })
            .end()

         .findAllByCssSelector(selectors.forms.autoSave.confirmationButton + ", " + selectors.forms.autoSave.cancelButton)
            .then(function(elements) {
               assert.lengthOf(elements, 0, "OK/Cancel buttons found on autosave form");
            });
      },

      "Updating autosave value publishes form": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.autoSave.input)
            .clearValue()
            .type("wibble")
            .getLastPublish("AUTOSAVE_FORM_1")
            .then(function(payload) {
               assert.propertyVal(payload, "control", "wibble", "Did not autosave updated value");
               assert.propertyVal(payload, "alfValidForm", true, "Did not autosave validity property");
            });
      },

      "Updating to invalid value does not autosave form": function() {
         return this.remote.findByCssSelector(selectors.buttons.clearAutoSave)
            .click()
            .clearLog()
            .getAllPublishes("AUTOSAVE_FORM_1")
            .then(function(payloads) {
               assert.lengthOf(payloads, 0, "Published form when invalid");
            });
      },

      "Autosave on invalid flag publishes invalid form": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.invalidAutoSave.input)
            .clearLog()
            .clearValue()
            .pressKeys(keys.BACKSPACE) // Need to trigger an update!
            .getLastPublish("AUTOSAVE_FORM_2")
            .then(function(payload) {
               assert.propertyVal(payload, "control", "", "Did not autosave updated, invalid value");
               assert.propertyVal(payload, "alfValidForm", false, "Did not autosave validity property");
            });
      },

      "Autosaving with defined payload mixes payload into form values": function() {
         return this.remote.findByCssSelector("body") // Need to get session to check for publish
            .getLastPublish("AUTOSAVE_FORM_2")
            .then(function(payload) {
               assert.propertyVal(payload, "customProperty", "awooga", "Did not mix custom payload into form values");
            });
      },

      "Ensure hidden button inputs have value": function() {
         return this.remote.findByCssSelector(selectors.forms.basic.hiddenConfirmationButton)
            .getAttribute("value")
            .then(function(value) {
               assert.equal(value, "OK");
            })
            .end()

         .findByCssSelector(selectors.forms.basic.hiddenCancelButton)
            .getAttribute("value")
            .then(function(value) {
               assert.equal(value, "CANCEL");
            });
      },

      "Enter key can submit form": function() {
         var firstPublish;

         return this.remote.findByCssSelector(selectors.textBoxes.submitOnEnter.input)
            .clearLog()
            .type("wibble")
            .pressKeys(keys.ENTER)
            .end()

         .getLastPublish("FORM_PUBLISH")
            .then(function(payload) {
               firstPublish = payload;
            })

         .findByCssSelector(selectors.forms.enterForm.confirmationButton)
            .clearLog()
            .click()
            .end()

         .getLastPublish("FORM_PUBLISH")
            .then(function(payload) {
               assert.deepEqual(payload, firstPublish, "ENTER publish did not match button-click publish");
            });
      },

      // See AKU-813
      "Check renderFilter config can be used on form": function() {
         return this.remote.findById("RENDER_FILTER_FORM");
      }
   });
});