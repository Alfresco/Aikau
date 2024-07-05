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

   var buttonSelectors = TestCommon.getTestSelectors("alfresco/buttons/AlfButton");
   var formSelectors = TestCommon.getTestSelectors("alfresco/forms/Form");
   var textBoxSelectors = TestCommon.getTestSelectors("alfresco/forms/controls/TextBox");

   var selectors = {
      buttons: {
         setHash: TestCommon.getTestSelector(buttonSelectors, "button.label", ["SET_HASH"]),
         setForm: TestCommon.getTestSelector(buttonSelectors, "button.label", ["SET_FORM_VALUE"]),
         showLabel4: TestCommon.getTestSelector(buttonSelectors, "button.label", ["BUTTON_1"]),
         hideLabel4: TestCommon.getTestSelector(buttonSelectors, "button.label", ["BUTTON_2"]),
         reset: TestCommon.getTestSelector(buttonSelectors, "button.label", ["RESET"])
      },
      forms: {
         hashForm: {
            confirmationButton: TestCommon.getTestSelector(formSelectors, "confirmation.button", ["HASH_FORM"])
         },
         standardForm: {
            confirmationButton: TestCommon.getTestSelector(formSelectors, "confirmation.button", ["STANDARD_FORM"]),
            confirmationButtonContent: TestCommon.getTestSelector(formSelectors, "confirmation.button.content", ["STANDARD_FORM"]),
            disabledConfirmationButton: TestCommon.getTestSelector(formSelectors, "confirmation.button.disabled", ["STANDARD_FORM"]),
            disabledConfirmationButtonContent: TestCommon.getTestSelector(formSelectors, "confirmation.button.disabled.content", ["STANDARD_FORM"])
         },
         setValueForm: {
            confirmationButton: TestCommon.getTestSelector(formSelectors, "confirmation.button", ["SET_VALUE_VIA_PUBSUB_FORM"])
         },
         customFieldsForm: {
            confirmationButton: TestCommon.getTestSelector(formSelectors, "confirmation.button", ["CUSTOM_FIELDS_FORM"])
         },
         resetForm: {
            confirmationButton: TestCommon.getTestSelector(formSelectors, "confirmation.button", ["RESET_FORM"])
         }
      },
      textBoxes: {
         hash1: {
            input: TestCommon.getTestSelector(textBoxSelectors, "input", ["HASH_TEXT_BOX_1"])
         },
         hash2: {
            input: TestCommon.getTestSelector(textBoxSelectors, "input", ["HASH_TEXT_BOX_2"])
         },
         text1: {
            input: TestCommon.getTestSelector(textBoxSelectors, "input", ["TEXT_BOX_1"])
         },
         text2: {
            input: TestCommon.getTestSelector(textBoxSelectors, "input", ["TEXT_BOX_2"])
         },
         text3: {
            input: TestCommon.getTestSelector(textBoxSelectors, "input", ["TEXT_BOX_3"])
         },
         text4: {
            input: TestCommon.getTestSelector(textBoxSelectors, "input", ["TEXT_BOX_4"])
         },
         text6: {
            input: TestCommon.getTestSelector(textBoxSelectors, "input", ["TEXT_BOX_6"])
         },
         text8: {
            input: TestCommon.getTestSelector(textBoxSelectors, "input", ["TEXT_BOX_8"])
         },
         addText1: {
            input: TestCommon.getTestSelector(textBoxSelectors, "input", ["ADD_TEXT_BOX_1"])
         },
         addText2: {
            input: TestCommon.getTestSelector(textBoxSelectors, "input", ["ADD_TEXT_BOX_2"])
         },
         customTarget: {
            input: TestCommon.getTestSelector(textBoxSelectors, "input", ["CUSTOM_TARGET"])
         }
      }
   };

   defineSuite(module, {
      name: "Forms Tests",
      testPage: "/Forms",

      "Test setting browser hash fragment with form post": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.hash1.input)
            .type("test1")
         .end()
            
         .findByCssSelector(selectors.textBoxes.hash2.input)
            .type("test2")
         .end()
      
         .findByCssSelector(selectors.forms.hashForm.confirmationButton)
            .click()
            .execute("return window.location.hash.toString()")
            .then(function(hash) {
               assert.equal(hash, "#field1=test1&field2=test2", "Form submit did not update hash fragment");
            });
      },

      "Test updating browser hash updates form": function() {
         return this.remote.findByCssSelector(selectors.buttons.setHash)
            .click()
         .end()
            
         .findByCssSelector(selectors.textBoxes.hash1.input)
            .getProperty("value")
            .then(function(resultText) {
               assert.equal(resultText, "updatedField1");
            })
         .end()
            
         .findByCssSelector(selectors.textBoxes.hash2.input)
            .getProperty("value")
            .then(function(resultText) {
               assert.equal(resultText, "updatedField2");
            });
      },

      "Test confirmation form button initially disabled": function() {
         return this.remote.findAllByCssSelector(selectors.forms.standardForm.disabledConfirmationButton)
            .then(function(elements) {
               assert.lengthOf(elements, 1);
            })
         .end()
            
         .findByCssSelector(selectors.forms.standardForm.disabledConfirmationButtonContent)
            .getAttribute("disabled")
            .then(function(disabled) {
               assert.equal(disabled, "true");
            });
      },

      "Test confirmation button is enabled with valid fields": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.text1.input)
            .type("test3")
         .end()
            
         .findByCssSelector(selectors.textBoxes.text2.input)
            .type("9")
         .end()
            
         .findAllByCssSelector(selectors.forms.standardForm.disabledConfirmationButton)
            .then(function(elements) {
               assert.lengthOf(elements, 0);
            })
         .end()
         
         .findByCssSelector(selectors.forms.standardForm.confirmationButtonContent)
            .getAttribute("disabled")
            .then(function(disabled) {
               assert.equal(disabled, "false");
            });
      },

      "Test form value publication": function() {
         return this.remote.findByCssSelector(selectors.forms.standardForm.confirmationButton)
            .click()
         .end()
            
         .getLastPublish("STANDARD_FORM_PUBLISH_FORM_DATA")
            .then(function(payload) {
               assert.propertyVal(payload, "field3", "test3");
               assert.propertyVal(payload, "field4", "9");
            });
      },

      "Test additional form buttons rendered": function() {
         return this.remote.findAllByCssSelector("#ADD_BUTTON_1")
            .then(function(elements) {
               assert.lengthOf(elements, 1);
            })
         .end()
            
         .findAllByCssSelector("#ADD_BUTTON_2")
            .then(function(elements) {
               assert.lengthOf(elements, 1);
            });
      },

      "Test additional form buttons publish correct data": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.addText1.input)
            .type("test4")
         .end()
            
         .findByCssSelector(selectors.textBoxes.addText2.input)
            .type("test5")
         .end()
      
         .findByCssSelector("#ADD_BUTTON_1")
            .click()
         .end()

         .getLastPublish("CUSTOM_SCOPE_AddButton1")
            .then(function(payload) {
               assert.propertyVal(payload, "field5", "test4");
               assert.propertyVal(payload, "field6", "test5");
               assert.propertyVal(payload, "extra", "stuff");
            });
      },

      "Additional button can omit form values": function() {
         return this.remote.findByCssSelector("#ADD_BUTTON_3")
            .click()
         .end()

         .getLastPublish("CUSTOM_SCOPE_AddButton3")
            .then(function(payload) {
               assert.notProperty(payload, "field5");
               assert.notProperty(payload, "field6");
               assert.propertyVal(payload, "original", "only");
            });
      },

      "Test global scope set correctly": function() {
         return this.remote.getLastPublish("SET_HASH");
      },

      "Test setting form value by publication": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.text3.input)
            .getProperty("value")
            .then(function(resultText) {
               assert.equal(resultText, "", "Text box to be set via publication is not empty before test");
            })
         .end()
            
         .findByCssSelector(selectors.buttons.setForm)
            .click()
         .end()
      
         .findByCssSelector(selectors.textBoxes.text3.input)
            .getProperty("value")
            .then(function(resultText) {
               assert.equal(resultText, "Value Set", "Text box value was not set via publication");
            });
      },

      "Test noValueUpdateWhenHiddenOrDisabled (disabled)": function() {
         return this.remote.findByCssSelector(selectors.forms.setValueForm.confirmationButton)
            .click()
         .end()

         .getLastPublish("SETTABLE_OK")
            .then(function(payload) {
               assert.propertyVal(payload, "pub3", "default");
            });
      },

      "Test noValueUpdateWhenHiddenOrDisabled (enabled)": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.text4.input)
            .clearValue()
         .end()
      
         .findByCssSelector("#SET_FORM_VALUE_2")
            .click()
         .end()
   
         .findByCssSelector(selectors.forms.setValueForm.confirmationButton)
            .clearLog()
            .click()
         .end()

         .getLastPublish("SETTABLE_OK")
            .then(function(payload) {
               assert.property(payload, "pub3");
            });
      },

      "Test postWhenHiddenOrDisabled (displayed) and noPostWhenValueIs (hidden)": function() {
         return this.remote.findByCssSelector("#TARGET_OPTIONS .radio-button:nth-child(3) .radio-button-widget input")
            .click()
         .end()
         
         .findByCssSelector(selectors.textBoxes.customTarget.input)
            .clearValue()
            .type("bob")
         .end()
   
         .findByCssSelector(selectors.forms.customFieldsForm.confirmationButton)
            .clearLog()
            .click()
         .end()

         .getLastPublish("CONDITIONAL_FORM_DATA")
            .then(function(payload) {
               assert.propertyVal(payload, "TARGET", "bob");
            });
      },

      "Test postWhenHiddenOrDisabled (hidden) and noPostWhenValueIs (displayed)": function() {
         return this.remote.findByCssSelector("#TARGET_OPTIONS .radio-button:nth-child(1) .radio-button-widget input")
            .click()
         .end()
            
         .findByCssSelector(selectors.forms.customFieldsForm.confirmationButton)
            .clearLog()
            .click()
         .end()

         .getLastPublish("CONDITIONAL_FORM_DATA")
            .then(function(payload) {
               assert.propertyVal(payload, "TARGET", "KNOWN1");
            });
      },

      "Label 1 should be displayed initially": function() {
         return this.remote.findDisplayedById("LABEL_1");
      },

      "Label 2 should be displayed initially": function() {
         return this.remote.findDisplayedById("LABEL_2");
      },

      "Label 3 should be displayed initially": function() {
         return this.remote.findDisplayedById("LABEL_3");
      },

      "Label 4 should be hidden initially": function() {
         return this.remote.findByCssSelector("#LABEL_4")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed);
            });
      },

      "Click the 'show' button to reveal label 4": function() {
         return this.remote.findByCssSelector(selectors.buttons.showLabel4)
            .click()
         .end()

         .findDisplayedById("LABEL_4");
      },

      "Manually clearing text box should hide label 1 and 2": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.text6.input)
            .clearValue()
            .type("hide")
         .end()

         .findByCssSelector("#LABEL_1")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "Label 1 should not be displayed");
            })
         .end()

         .findByCssSelector("#LABEL_2")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "Label 2 should not be displayed");
            });
      },

      "Labels 3 and 4 should still be displayed after text box has been cleared": function() {
         return this.remote.findDisplayedById("LABEL_3")
         .end()

         .findDisplayedById("LABEL_4");
      },

      "Auto-set text box via selects to hide labels 3 and 4": function() {
         return this.remote.findByCssSelector("#SELECT_1_CONTROL .dijitSelectLabel")
            .click()
         .end()

         .findDisplayedByCssSelector("#SELECT_1_CONTROL_dropdown table tr:nth-child(2) td.dijitMenuItemLabel")
            .click()
         .end()

         .findByCssSelector("#SELECT_2_CONTROL .dijitSelectLabel")
            .click()
         .end()

         .findDisplayedByCssSelector("#SELECT_2_CONTROL_dropdown table tr:nth-child(2) td.dijitMenuItemLabel")
            .click()
         .end()

        .findByCssSelector("#LABEL_3")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "Label 3 should not be visible");
            })
         .end()

         .findByCssSelector("#LABEL_4")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "Label 4 should not be visible");
            });
      },

      "Auto-set text box via selects to reveal labels": function() {
         return this.remote.findByCssSelector("#SELECT_1_CONTROL .dijitSelectLabel")
            .click()
         .end()

         .findDisplayedByCssSelector("#SELECT_1_CONTROL_dropdown table tr:nth-child(1) td.dijitMenuItemLabel")
            .click()
         .end()

         .findByCssSelector("#SELECT_2_CONTROL .dijitSelectLabel")
            .click()
         .end()

         .findDisplayedByCssSelector("#SELECT_2_CONTROL_dropdown table tr:nth-child(1) td.dijitMenuItemLabel")
            .click()
         .end()

         .findDisplayedById("LABEL_1")
         .end()

         .findDisplayedById("LABEL_2")
         .end()

         .findDisplayedById("LABEL_3")
         .end()

         .findDisplayedById("LABEL_4");
      },

      "Auto-set text box via select to hide label": function() {
         return this.remote.findByCssSelector("#SELECT_1_CONTROL .dijitSelectLabel")
            .click()
         .end()

         .findDisplayedByCssSelector("#SELECT_1_CONTROL_dropdown table tr:nth-child(2) td.dijitMenuItemLabel")
            .click()
         .end()

         .findByCssSelector("#LABEL_1")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed);
            });
      },

      "Click the 'hide' button to hide label 4": function() {
         return this.remote.findByCssSelector(selectors.buttons.hideLabel4)
            .click()
         .end()

         .findByCssSelector("#LABEL_4")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed);
            });
      },

      "Reset a form": function() {
         return this.remote.findDisplayedByCssSelector(selectors.forms.resetForm.confirmationButton)
            .clearLog()
            .click()
         .end()

         .getLastPublish("RESETTABLE_OK")
            .then(function(payload) {
               assert.propertyVal(payload, "text", "Original");
            })
         .end()

         .findByCssSelector(selectors.textBoxes.text8.input)
            .clearValue()
            .type("Update")
         .end()

         .findByCssSelector(selectors.forms.resetForm.confirmationButton)
            .clearLog()
            .click()
         .end()

         .getLastPublish("RESETTABLE_OK")
            .then(function(payload) {
               assert.propertyVal(payload, "text", "Update");
            })
         .end()

         .findByCssSelector(selectors.buttons.reset)
            .click()
         .end()

         .findByCssSelector(selectors.forms.resetForm.confirmationButton)
            .clearLog()
            .click()
         .end()

         .getLastPublish("RESETTABLE_OK")
            .then(function(payload) {
               assert.propertyVal(payload, "text", "Original");
            });
      }
   });
});