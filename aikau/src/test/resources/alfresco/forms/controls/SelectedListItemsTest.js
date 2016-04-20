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

   var buttonSelectors = TestCommon.getTestSelectors("alfresco/buttons/AlfButton");
   var formSelectors = TestCommon.getTestSelectors("alfresco/forms/Form");
   var selectorSelectors = TestCommon.getTestSelectors("alfresco/renderers/Selector");

   var selectors = {
      buttons: {
         selectItems: TestCommon.getTestSelector(buttonSelectors, "button.label", ["BUTTON"])
      },
      form: {
         confirmationButton: TestCommon.getTestSelector(formSelectors, "confirmation.button", ["FORM"])
      },
      selectors: {
         first: {
            checked: TestCommon.getTestSelector(selectorSelectors, "nth.selector.checked", ["SELECTOR", "0"])
         },
         fourth: {
            element: TestCommon.getTestSelector(selectorSelectors, "nth.selector", ["SELECTOR", "3"]),
            checked: TestCommon.getTestSelector(selectorSelectors, "nth.selector.checked", ["SELECTOR", "3"])
         },
         fifth: {
            element: TestCommon.getTestSelector(selectorSelectors, "nth.selector", ["SELECTOR", "4"]),
            checked: TestCommon.getTestSelector(selectorSelectors, "nth.selector.checked", ["SELECTOR", "4"])
         },
         eigth: {
            checked: TestCommon.getTestSelector(selectorSelectors, "nth.selector.checked", ["SELECTOR", "7"])
         }
      }
   };

   defineSuite(module, {
      name: "SelectedListItems Tests",
      testPage: "/SelectedListItems",

      "Fourth item is selected on load": function() {
         return this.remote.findDisplayedByCssSelector(selectors.selectors.fourth.checked);
      },

      "Publish initial form value": function() {
         return this.remote.findByCssSelector(selectors.form.confirmationButton)
            .click()
            .end()

         .getLastPublish("FORMSAVE")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "selectedItems[0].nodeRef", "workspace://SpacesStore/d040aa05-ad54-495f-bf4e-3266b96391e9");
            });
      },

      "Check fifth and post form": function() {
         return this.remote.findByCssSelector(selectors.selectors.fifth.element)
            .click()
            .end()

         .findByCssSelector(selectors.selectors.fifth.checked)
            .end()

         .clearLog()

         .findByCssSelector(selectors.form.confirmationButton)
            .click()
            .end()

         .getLastPublish("FORMSAVE")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "selectedItems[0].nodeRef", "workspace://SpacesStore/d040aa05-ad54-495f-bf4e-3266b96391e9");
               assert.deepPropertyVal(payload, "selectedItems[1].nodeRef", "workspace://SpacesStore/ee0461e1-daa0-4efc-a142-3f709452fa0b");
            });
      },

      "Select items via form setValueTopic": function() {
         return this.remote.findByCssSelector(selectors.buttons.selectItems)
            .click()
         .end()

         .findByCssSelector(selectors.selectors.eigth.checked);
      }
   });

   defineSuite(module, {
      name: "SelectedListItems Tests (Publish selected items on page load)",
      testPage: "/SelectedListItems?publishOnPageLoad=true",

      "Values can be selected before list has rendered": function() {
         return this.remote.findDisplayedByCssSelector(selectors.selectors.first.checked);
      }

   });
});