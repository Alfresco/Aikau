/*jshint browser:true*/
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
 * HashList test
 *
 * @author Dave Draper
 * @author Martin Doyle
 */
define(["module",
        "alfresco/TestCommon",
        "intern/chai!assert",
        "alfresco/defineSuite"],
        function(module, TestCommon, assert, defineSuite) {

   var buttonSelectors = TestCommon.getTestSelectors("alfresco/buttons/AlfButton");
   var dialogSelectors = TestCommon.getTestSelectors("alfresco/dialogs/AlfDialog");
   var textBoxSelectors = TestCommon.getTestSelectors("alfresco/forms/controls/TextBox");
   
   var selectors = {
      buttons: {
         addItem: TestCommon.getTestSelector(buttonSelectors, "button.label", ["ADD_ITEM_BUTTON_ITEM_0"]),
      },
      dialogs: {
         newItem: {
            confirmationButton: TestCommon.getTestSelector(dialogSelectors, "form.dialog.confirmation.button", ["ADD_ITEM_DIALOG"]),
            displayed: TestCommon.getTestSelector(dialogSelectors, "visible.dialog", ["ADD_ITEM_DIALOG"]),
            hidden: TestCommon.getTestSelector(dialogSelectors, "hidden.dialog", ["ADD_ITEM_DIALOG"])
         }
      },
      textBoxes: {
         newItemName: {
            input: TestCommon.getTestSelector(textBoxSelectors, "input", ["NEW_ITEM_NAME"]),
         }
      }
   };

   defineSuite(module, {
      name: "List Item Focus Tests",
      testPage: "/ListItemFocus",

      "Create a new item and check that it is focused": function() {
         // Click on the button in the appendix item to request a dialog for adding a new item...
         return this.remote.getLastPublish("ALF_DOCLIST_REQUEST_FINISHED").clearLog()

         .findDisplayedByCssSelector(selectors.buttons.addItem)
            .click()
         .end()

         // When the dialog is displayed...
         .findByCssSelector(selectors.dialogs.newItem.displayed)
         .end()

         // Find the text box and enter a name...
         .findByCssSelector(selectors.textBoxes.newItemName.input)
            .clearValue()
            .type("test")
         .end()

         // Confirm the dialog...
         .findByCssSelector(selectors.dialogs.newItem.confirmationButton)
            .click()
         .end()

         // Check the reload request (following the create request) contains the item to focus on...
         .getLastPublish("ALF_DOCLIST_RELOAD_DATA")
            .then(function(payload) {
               assert.property(payload, "focusItemKey", "No item to focus on was provided in the reload request");
            })

         // Check the expanded section is displayed...
         .findDisplayedByCssSelector(".alfresco-lists-views-layouts-Grid__cell--focused");
      }
   });
});