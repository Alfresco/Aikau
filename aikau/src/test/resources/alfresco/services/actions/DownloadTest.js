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

   var actionsSelectors = TestCommon.getTestSelectors("alfresco/renderers/Actions");
   var selectors = {
      downloadDocument: {
         label: TestCommon.getTestSelector(actionsSelectors, "nth.label", ["ACTIONS", "0"]),
         dropDown: TestCommon.getTestSelector(actionsSelectors, "nth.dropdown", ["ACTIONS", "0"]),
         action1: TestCommon.getTestSelector(actionsSelectors, "nth.dropdown.nth.action.label", ["ACTIONS", "0", "1"])
      },
      downloadFolder: {
         label: TestCommon.getTestSelector(actionsSelectors, "nth.label", ["ACTIONS", "1"]),
         dropDown: TestCommon.getTestSelector(actionsSelectors, "nth.dropdown", ["ACTIONS", "1"])
      }
   };

   defineSuite(module, {
      name: "Download Action Tests",
      testPage: "/Download",

      "Test that action does appear for document": function() {
         return this.remote.findByCssSelector(selectors.downloadDocument.label)
            .click()
            .end()

         .findDisplayedById("ACTIONS_ITEM_0_DOWNLOAD");
      },

      "Test that action does NOT appear for folder": function() {
         return this.remote.findByCssSelector(selectors.downloadFolder.label)
            .click()
            .end()
            .findAllByCssSelector("#ACTIONS_ITEM_1_DOWNLOAD")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Download action should not be present for folder");
            });
      },

      "Test download action": function() {
         return this.remote.findByCssSelector(selectors.downloadDocument.label)
            .click()
            .end()

         .findDisplayedByCssSelector(selectors.downloadDocument.action1)
            .click()
            .end()

         .findByCssSelector("iframe#ALF_DOCUMENT_SERVICE_DOWNLOAD_IFRAME")
            .getAttribute("src")
            .then(function(src) {
               assert.include(src, "/proxy/alfresco/slingshot/node/content/workspace/SpacesStore/62e6c83c-f239-4f85-b1e8-6ba0fd50fac4/2013-12-29%2009.58.43.jpg?a=true");
            });
      }
   });
});