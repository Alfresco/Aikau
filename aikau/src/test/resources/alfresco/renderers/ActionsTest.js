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
define(["intern!object",
        "intern/chai!assert",
        "alfresco/TestCommon"],
       function (registerSuite, assert, TestCommon) {

   var actionsSelectors = TestCommon.getTestSelectors("alfresco/renderers/Actions");
   var selectors = {
      restActions: {
         first: {
            label: TestCommon.getTestSelector(actionsSelectors, "nth.label", ["REST_ACTIONS", "0"]),
            dropDown: TestCommon.getTestSelector(actionsSelectors, "nth.dropdown", ["REST_ACTIONS", "0"]),
            action: TestCommon.getTestSelector(actionsSelectors, "nth.dropdown.actions", ["REST_ACTIONS", "0"])
         }
      },
      customActions: {
         first: {
            label: TestCommon.getTestSelector(actionsSelectors, "nth.label", ["CUSTOM_ACTIONS", "0"]),
            dropDown: TestCommon.getTestSelector(actionsSelectors, "nth.dropdown", ["CUSTOM_ACTIONS", "0"]),
            action: TestCommon.getTestSelector(actionsSelectors, "nth.dropdown.actions", ["CUSTOM_ACTIONS", "0"])
         }
      },
      mergedActions: {
         first: {
            label: TestCommon.getTestSelector(actionsSelectors, "nth.label", ["MERGED_ACTIONS", "0"]),
            dropDown: TestCommon.getTestSelector(actionsSelectors, "nth.dropdown", ["MERGED_ACTIONS", "0"]),
            action: TestCommon.getTestSelector(actionsSelectors, "nth.dropdown.actions", ["MERGED_ACTIONS", "0"])
         }
      },
      footerActions: {
         first: {
            label: TestCommon.getTestSelector(actionsSelectors, "label", ["FOOTER_ACTIONS"]),
            dropDown: TestCommon.getTestSelector(actionsSelectors, "dropdown", ["FOOTER_ACTIONS"]),
            action1: TestCommon.getTestSelector(actionsSelectors, "dropdown.nth.action.label", ["FOOTER_ACTIONS", "1"])
         }
      }
   };

   registerSuite(function(){
      var browser;

      return {
         name: "Action Renderer Test",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/ActionsRenderer", "Action Renderer Test").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Count REST API actions": function() {
            return browser.waitForDeletedByCssSelector(".alfresco-lists-AlfList--loading")
            .end()

            .findByCssSelector(selectors.restActions.first.label)
               .click()
            .end()

            .findDisplayedByCssSelector(selectors.restActions.first.dropDown)
            .end()

            .findAllByCssSelector(selectors.restActions.first.action)
               .then(function(elements) {
                  assert.lengthOf(elements, 10, "Unexpected number of REST API actions rendered");
               });
         },

         "Count custom actions": function() {
            return browser.findByCssSelector(selectors.customActions.first.label)
               .click()
            .end()

            .findDisplayedByCssSelector(selectors.customActions.first.dropDown)
            .end()
            
            .findAllByCssSelector(selectors.customActions.first.action)
               .then(function(elements) {
                  assert.lengthOf(elements, 2, "Unexpected number of custom actions rendered");
               });
         },

         "Count filtered merged actions": function() {
            return browser.findByCssSelector(selectors.mergedActions.first.label)
               .click()
            .end()

            .findDisplayedByCssSelector(selectors.mergedActions.first.dropDown)
            .end()
            
            .findAllByCssSelector(selectors.mergedActions.first.action)
               .then(function(elements) {
                  assert.lengthOf(elements, 5, "Unexpected number of filtered merged REST API and custom actions rendered");
               });
         },

         "Check that actions don't appear off the screen": function() {
            return browser.findByCssSelector(selectors.footerActions.first.label)
               .click()
            .end()

            .findDisplayedByCssSelector(selectors.footerActions.first.dropDown)
            .end()
            
            .findDisplayedByCssSelector(selectors.footerActions.first.action1)
               // NOTE: These tests should ensure that the menu item is visible.
               .isDisplayed()
               .click();
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});