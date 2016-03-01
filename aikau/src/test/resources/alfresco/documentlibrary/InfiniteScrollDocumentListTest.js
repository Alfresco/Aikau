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

   registerSuite(function(){
      var browser;

      return {
         name: "AlfDocumentList Tests (infinite scrolling)",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/InfiniteScrollDocumentList", "AlfDocumentList Tests (infinite scrolling)").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "No initial sorting indicated": function() {
            return browser.findDisplayedByCssSelector(".alfresco-lists-views-layouts-HeaderCell img")
               .then(function() {
                  assert(false, "Should not have found any displayed sort indicators");
               },
               function() {
                  assert(true);
               });
         },

         "Four results shown initially": function() {
            return browser.findByCssSelector("body").end()

            .getLastPublish("ALF_DOCLIST_REQUEST_FINISHED")

            .findAllByCssSelector(".alfresco-lists-views-layouts-Row")
               .then(function(elements) {
                  assert.lengthOf(elements, 4);
               });
         },

         "Sort on name, check four results are still shown": function() {
            return browser.findByCssSelector("#TABLE_VIEW_NAME_HEADING .label")
               .clearLog()
               .click()
            .end()

            .getLastPublish("ALF_RETRIEVE_DOCUMENTS_REQUEST")
            .getLastPublish("ALF_DOCLIST_REQUEST_FINISHED")

            .findAllByCssSelector(".alfresco-lists-views-layouts-Row")
               .then(function(elements) {
                  assert.lengthOf(elements, 4);
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         },

         "Reload the page and check initial sorting displayed": function() {
            return browser.refresh().findByCssSelector("body").end()
            .getLastPublish("ALF_DOCLIST_REQUEST_FINISHED")

            .findDisplayedByCssSelector("#TABLE_VIEW_NAME_HEADING img");
         },

         "Post Coverage Results (1)": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});