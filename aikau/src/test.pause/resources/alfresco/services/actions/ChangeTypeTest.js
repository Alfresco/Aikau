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
   var selectSelectors = TestCommon.getTestSelectors("alfresco/forms/controls/Select");

   var selectors = {
      buttons: {
         changeNode: TestCommon.getTestSelector(buttonSelectors, "button.label", ["CHANGE_TYPE_1"]),
         changeNodeNoMetadata: TestCommon.getTestSelector(buttonSelectors, "button.label", ["CHANGE_TYPE_2"])
      },
      dialogs: {
         changeType: {
            title: TestCommon.getTestSelector(dialogSelectors, "title", ["ALF_CHANGE_TYPE_DIALOG"]),
            visible: TestCommon.getTestSelector(dialogSelectors, "visible.dialog", ["ALF_CHANGE_TYPE_DIALOG"]),
            confirmationButton: TestCommon.getTestSelector(dialogSelectors, "form.dialog.confirmation.button", ["ALF_CHANGE_TYPE_DIALOG"])
         }
      },
      typeSelector: {
         openIcon: TestCommon.getTestSelector(selectSelectors, "open.menu.icon", ["CHANGE_TYPE_DIALOG_SELECT"]),
         options: TestCommon.getTestSelector(selectSelectors, "options", ["CHANGE_TYPE_DIALOG_SELECT"]),
         option1: TestCommon.getTestSelector(selectSelectors, "nth.option.label", ["CHANGE_TYPE_DIALOG_SELECT", "1"]),
         option2: TestCommon.getTestSelector(selectSelectors, "nth.option.label", ["CHANGE_TYPE_DIALOG_SELECT", "2"])
      }
   };

   defineSuite(module, {
      name: "Change Type Tests",
      testPage: "/ChangeType",

      "Open dialog for node WITH metdata": function() {
         return this.remote.findByCssSelector(selectors.buttons.changeNode)
            .click()
            .end()

         .findByCssSelector(selectors.dialogs.changeType.visible)
            .end()

         .findByCssSelector(selectors.dialogs.changeType.title)
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Change Type of ''Some Node Title''");
            });
      },

      "There are two types to select": function() {
         return this.remote.findByCssSelector(selectors.typeSelector.openIcon)
            .click()
            .end()

         .findAllByCssSelector(selectors.typeSelector.options)
            .then(function(options) {
               assert.lengthOf(options, 2);
            });
      },

      "Select the first type": function() {
         return this.remote.findDisplayedByCssSelector(selectors.typeSelector.option1)
            .click()
            .end()

         .findByCssSelector(selectors.dialogs.changeType.confirmationButton)
            .click()
            .end()

         .getLastPublish("ALF_DISPLAY_NOTIFICATION")
            .then(function(payload) {
               assert.propertyVal(payload, "message", "Type of document ''Some Node Title'' was successfully changed");
            });
      },

      "Open dialog for node WITHOUT metdata": function() {
         return this.remote.findByCssSelector(selectors.buttons.changeNodeNoMetadata)
            .click()
            .end()

         .findByCssSelector(selectors.dialogs.changeType.visible)
            .end()

         .findByCssSelector(selectors.dialogs.changeType.title)
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Change Type of ''PDF.pdf''");
            });
      },

      "Select the second type": function() {
         return this.remote.findByCssSelector(selectors.typeSelector.openIcon)
            .click()
            .end()

         .findDisplayedByCssSelector(selectors.typeSelector.option2)
            .click()
            .end()

         .findByCssSelector(selectors.dialogs.changeType.confirmationButton)
            .click()
            .end()

         .getLastPublish("ALF_DISPLAY_PROMPT")
            .then(function(payload) {
               assert.propertyVal(payload, "message", "We couldn't change the type of ''PDF.pdf''. Check with your Alfresco Administrator that the type matches the data model.");
            });
      }
   });
});