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
 * @since 1.0.85
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert",
        "alfresco/TestCommon"],
        function(module, defineSuite, assert, TestCommon) {

   // Get the selectors for the MultiInputSelect widget...
   var multiSelectInputSelectors = TestCommon.getTestSelectors("alfresco/forms/controls/MultiSelectInput");
   var formSelectors = TestCommon.getTestSelectors("alfresco/forms/Form");

   // Build a map of the selectors to use...
   var selectors = {
      forms: {
         form1: {
            confirmationButton: TestCommon.getTestSelector(formSelectors, "confirmation.button", ["FORM1"]),
            disabledConfirmationButton: TestCommon.getTestSelector(formSelectors, "confirmation.button.disabled", ["FORM1"])
         }
      },
      multiselects: {
         multiSelect1: {
            control: TestCommon.getTestSelector(multiSelectInputSelectors, "control", ["MULTISELECT_1"]),
            loaded: TestCommon.getTestSelector(multiSelectInputSelectors, "options.loaded.state", ["MULTISELECT_1"]),
            firstChoice: {
               element: TestCommon.getTestSelector(multiSelectInputSelectors, "nth.choice", ["MULTISELECT_1", "1"]),
               content: TestCommon.getTestSelector(multiSelectInputSelectors, "nth.choice.content", ["MULTISELECT_1", "1"]),
               delete: TestCommon.getTestSelector(multiSelectInputSelectors, "nth.choice.delete", ["MULTISELECT_1", "1"])
            },
            secondChoice: {
               element: TestCommon.getTestSelector(multiSelectInputSelectors, "nth.choice", ["MULTISELECT_1", "2"]),
               content: TestCommon.getTestSelector(multiSelectInputSelectors, "nth.choice.content", ["MULTISELECT_1", "2"]),
               delete: TestCommon.getTestSelector(multiSelectInputSelectors, "nth.choice.delete", ["MULTISELECT_1", "2"])
            },
            thirdChoice: {
               element: TestCommon.getTestSelector(multiSelectInputSelectors, "nth.choice", ["MULTISELECT_1", "3"]),
               content: TestCommon.getTestSelector(multiSelectInputSelectors, "nth.choice.content", ["MULTISELECT_1", "3"]),
               delete: TestCommon.getTestSelector(multiSelectInputSelectors, "nth.choice.delete", ["MULTISELECT_1", "3"])
            },
            result: TestCommon.getTestSelector(multiSelectInputSelectors, "result", ["MULTISELECT_1"]),
            loading: TestCommon.getTestSelector(multiSelectInputSelectors, "results.loading.message", ["MULTISELECT_1"]),
            firstResult: TestCommon.getTestSelector(multiSelectInputSelectors, "nth.result", ["MULTISELECT_1", "1"]),
            secondResult: TestCommon.getTestSelector(multiSelectInputSelectors, "nth.result", ["MULTISELECT_1", "2"]),
            fourthResult: TestCommon.getTestSelector(multiSelectInputSelectors, "nth.result", ["MULTISELECT_1", "4"]),
            searchbox: TestCommon.getTestSelector(multiSelectInputSelectors, "searchbox", ["MULTISELECT_1"]),
            noresults: TestCommon.getTestSelector(multiSelectInputSelectors, "no.results.message", ["MULTISELECT_1"])
         }
      }
   };

   defineSuite(module, {
      name: "Initial Form Values Tests",
      testPage: "/InitialFormValues",

      "Initial form submission shows nothing added or removed": function() {
         return this.remote.findDisplayedByCssSelector(selectors.forms.form1.confirmationButton)
            .clearLog()
            .click()
         .end()

         .getLastPublish("FORM1_SAVE1")
            .then(function(payload) {
               assert.propertyVal(payload, "sweets_added", "");
               assert.propertyVal(payload, "sweets_removed", "");
            });
      },

      "Remove choice shown in form value": function() {
         return this.remote.findDisplayedByCssSelector(selectors.multiselects.multiSelect1.firstChoice.delete)
            .click()
         .end()

         .findDisplayedByCssSelector(selectors.forms.form1.confirmationButton)
            .clearLog()
            .click()
         .end()

         .getLastPublish("FORM1_SAVE1")
            .then(function(payload) {
               assert.propertyVal(payload, "sweets_added", "");
               assert.propertyVal(payload, "sweets_removed", "form_strawberries");
            });
      },

      "Added option shown in form value": function() {
         return this.remote.findByCssSelector(selectors.multiselects.multiSelect1.control)
            .click()
         .end()

         .findDisplayedByCssSelector(selectors.multiselects.multiSelect1.secondResult)
            .click()
         .end()

         .findByCssSelector(selectors.multiselects.multiSelect1.secondChoice.content)
            .getVisibleText()
            .then(function(visibleText) {
               assert.include(visibleText, "Sherbert Lemons");
            })
         .end()

         .findDisplayedByCssSelector(selectors.forms.form1.confirmationButton)
            .clearLog()
            .click()
         .end()

         .getLastPublish("FORM1_SAVE1")
            .then(function(payload) {
               assert.propertyVal(payload, "sweets_added", "sherbert_lemons");
               assert.propertyVal(payload, "sweets_removed", "form_strawberries");
            });
      }
   });
});