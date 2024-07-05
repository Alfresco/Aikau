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
   var dialogSelectors = TestCommon.getTestSelectors("alfresco/dialogs/AlfDialog");
   var selectors = {
      dialogs: {
         withForm: {
            confirmationButton: TestCommon.getTestSelector(dialogSelectors, "form.dialog.confirmation.button", ["DIALOG_WITH_FORM"]),
            disabledConfirmationButton: TestCommon.getTestSelector(dialogSelectors, "disabled.form.dialog.confirmation.button", ["DIALOG_WITH_FORM"]),
            displayed: TestCommon.getTestSelector(dialogSelectors, "visible.dialog", ["DIALOG_WITH_FORM"]),
            hidden: TestCommon.getTestSelector(dialogSelectors, "hidden.dialog", ["DIALOG_WITH_FORM"]),
         },
      },
      buttons: {
         showDialogWithForm: TestCommon.getTestSelector(buttonSelectors, "button.label", ["CREATE_FORM_IN_DIALOG"])
      }
   };

   defineSuite(module, {
      name: "ControlRow Tests",
      testPage: "/ControlRow",

      "Test child form controls publish values": function() {
         return this.remote.findByCssSelector("#DB1_label")
            .click()
         .end()
         
         .getLastPublish("FORM1__valueChangeOf_SELECT1")
            .then(function(payload) {
               assert.equal(payload.value, "ONE", "The initial value of the select field wasn't published");
            })
         
         .getLastPublish("FORM1__valueChangeOf_TEXTBOX1")
            .then(function(payload) {
               assert.equal(payload.value, "Initial Value", "The initial value of the text box field wasn't published");
            })
         
         .getLastPublish("FORM1_TEST")
            .then(function(payload) {
               assert.equal(payload.selected, "ONE", "The dynamic payload button didn't get the published update");
            });
      },

      "Ensure showValidationErrorsImmediately is respected": function() {
         return this.remote.findByCssSelector("#TB1 .validation-message")
            .getVisibleText()
            .then(function(visibleText) {
               assert.equal(visibleText, "");
            });
      },


      "Text box in control row in form with no value in dialog publishes value change": function() {
         return this.remote.findByCssSelector(selectors.buttons.showDialogWithForm)
            .clearLog()
            .click()
         .end()

         .findByCssSelector(selectors.dialogs.withForm.displayed)
         .end()

         .getLastPublish("CONTROL_ROW_FORM__valueChangeOf_CONTROL_ROW_TEXT_BOX");
      }
   });
});