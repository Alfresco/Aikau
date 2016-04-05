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
 * @author David Webster
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert",
        "alfresco/TestCommon"],
        function(module, defineSuite, assert, TestCommon) {

   var actionsSelectors = TestCommon.getTestSelectors("alfresco/renderers/Actions");
   var selectors = {
      restActions: {
         first: {
            label: TestCommon.getTestSelector(actionsSelectors, "nth.label", ["XHR_ACTIONS", "0"]),
            dropDown: TestCommon.getTestSelector(actionsSelectors, "nth.dropdown", ["XHR_ACTIONS", "0"]),
            action: TestCommon.getTestSelector(actionsSelectors, "nth.dropdown.actions", ["XHR_ACTIONS", "0"])
         }
      },
      mergedActions: {
         first: {
            label: TestCommon.getTestSelector(actionsSelectors, "nth.label", ["MERGED_XHR_ACTIONS", "0"]),
            dropDown: TestCommon.getTestSelector(actionsSelectors, "nth.dropdown", ["MERGED_XHR_ACTIONS", "0"]),
            action: TestCommon.getTestSelector(actionsSelectors, "nth.dropdown.actions", ["MERGED_XHR_ACTIONS", "0"])
         }
      }
   };

   defineSuite(module, {
      name: "XHR Actions Renderer Tests",
      testPage: "/XhrActions",

      "Check Actions menu was rendered": function() {
         // Test spec:
         // 1: Check dropdown element exists
         return this.remote.findByCssSelector(selectors.restActions.first.label);
      },

      "Check that document request event was triggered": function() {
         // 2: Click on it. Check event triggered: ALF_RETRIEVE_SINGLE_DOCUMENT_REQUEST
         return this.remote.findByCssSelector(selectors.restActions.first.label)
            .click()
            .end()
            .getLastPublish("ALF_RETRIEVE_SINGLE_DOCUMENT_REQUEST", "Retrieve single doc request not triggered");
      },

      "Check default behaviour to render 'legacy' document actions": function() {
         return this.remote.findDisplayedByCssSelector(selectors.restActions.first.dropDown)
            .end()

         .findAllByCssSelector(selectors.restActions.first.action)
            .then(function(elements) {
               assert.lengthOf(elements, 11);
            });
      },

      "Check merged and filtered actions": function() {
         return this.remote.findByCssSelector(selectors.mergedActions.first.label)
            .click()
            .end()

         .findDisplayedByCssSelector(selectors.mergedActions.first.dropDown)
            .end()

         .findAllByCssSelector(selectors.mergedActions.first.action)
            .then(function(elements) {
               assert.lengthOf(elements, 3);
            });
      }
   });
});