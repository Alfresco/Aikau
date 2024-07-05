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

   var baseFormControlSelectors = TestCommon.getTestSelectors("alfresco/forms/controls/BaseFormControl");
   var tabSelectors = TestCommon.getTestSelectors("alfresco/layout/AlfTabContainer");
   var buttonSelectors = TestCommon.getTestSelectors("alfresco/buttons/AlfButton");
   var dialogSelectors = TestCommon.getTestSelectors("alfresco/dialogs/AlfDialog");

   var selectors = {
      buttons: {
         create: TestCommon.getTestSelector(buttonSelectors, "button.label", ["CREATE_DIALOG_BUTTON"])
      },
      dialogs: {
         dialog1: {
            visible: TestCommon.getTestSelector(dialogSelectors, "visible.dialog", ["DIALOG1"])
         }
      },
      tabs: {
         tab1: TestCommon.getTestSelector(tabSelectors, "identified.tab", ["TABS", "DYNAMIC"])
      },
      checkBoxes: {
         initialVisibility: {
            label: TestCommon.getTestSelector(baseFormControlSelectors, "label", ["INITIALLY_VISIBLE"])
         }
      }
   };

   defineSuite(module, {
      name: "Asynchronous Form Control Loading Test",
      testPage: "/AsyncFormControlLoading",

      "Check that controls all load": function() {
         // Open the dialog...
         return this.remote.findByCssSelector(selectors.buttons.create)
            .click()
            .end()

         // ...wait for it to be displayed...
         .findByCssSelector(selectors.dialogs.dialog1.visible)
            .end()

         // Select the "DYNAMIC" tab...
         .findByCssSelector(selectors.tabs.tab1)
            .click()
            .end()

         .findDisplayedByCssSelector(selectors.checkBoxes.initialVisibility.label);
      }
   });
});