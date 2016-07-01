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
 * @author Dave Draper
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert"],
        function(module, defineSuite, assert) {

   defineSuite(module, {
      name: "AlfDocumentList (with AlfBreadcrumbTrail) Tests",
      testPage: "/AlfDocumentList",

      // See AKU-1010 for the background on these tests...
      "Browse sub-folder": function() {
         return this.remote.getLastPublish("ALF_DOCLIST_REQUEST_FINISHED").clearLog()

         .findDisplayedByCssSelector("#SIMPLE_VIEW_NAME_ITEM_0")
            .click()
         .end()

         .getLastPublish("ALF_DOCLIST_REQUEST_FINISHED").clearLog()

         // Need to wait for the loading message to be hidden to stop Firefox test failures!
         .waitForDeletedByCssSelector(".alfresco-lists-AlfList--loading");
      },

      "Browse to sub-folder and immediately select root breadcrumb": function() {
         // Click the first item in the list...
         return this.remote.findDisplayedByCssSelector("#SIMPLE_VIEW_NAME_ITEM_0")
            .click()
         .end()

         // ...then click the root breadcrumb...
         .findDisplayedByCssSelector(".alfresco-documentlibrary-AlfBreadcrumb:first-child .breadcrumb")
            .click()
         .end()

         // We need to wait for the mock server delayed response (of which there should be two)...
         .sleep(2000)

         .getLastPublish("ALF_RETRIEVE_DOCUMENTS_REQUEST")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "filter.path", "/");
            });
      }
   });
});