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

   var rowSelectors = TestCommon.getTestSelectors("alfresco/lists/views/layouts/Row");
   var headerCellSelectors = TestCommon.getTestSelectors("alfresco/lists/views/layouts/HeaderCell");

   var selectors = {
      rows: {
         all:  TestCommon.getTestSelector(rowSelectors, "row")
      },
      headerCells: {
         all: {
            indicators: TestCommon.getTestSelector(headerCellSelectors, "all.indicators")
         },
         name: {
            indicators: TestCommon.getTestSelector(headerCellSelectors, "indicator", ["TABLE_VIEW_NAME_HEADING"]),
            ascending: TestCommon.getTestSelector(headerCellSelectors, "ascending.indicator", ["TABLE_VIEW_NAME_HEADING"]),
            descending: TestCommon.getTestSelector(headerCellSelectors, "descending.indicator", ["TABLE_VIEW_NAME_HEADING"]),
            label: TestCommon.getTestSelector(headerCellSelectors, "label", ["TABLE_VIEW_NAME_HEADING"])
         }
      }
   };

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
            return browser.findDisplayedByCssSelector(selectors.headerCells.all.indicators)
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

            .findAllByCssSelector(selectors.rows.all)
               .then(function(elements) {
                  assert.lengthOf(elements, 4);
               });
         },

         "Sort on name, check four results are still shown": function() {
            return browser.findByCssSelector(selectors.headerCells.name.label)
               .clearLog()
               .click()
            .end()

            .getLastPublish("ALF_RETRIEVE_DOCUMENTS_REQUEST")
            .getLastPublish("ALF_DOCLIST_REQUEST_FINISHED")

            .findAllByCssSelector(selectors.rows.all)
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

            .findDisplayedByCssSelector(selectors.headerCells.all.indicators);
         },

         "Post Coverage Results (1)": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });

   registerSuite(function(){
      var browser;

      return {
         name: "AlfDocumentList Sorting Tests (no hash, no infinite scroll)",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/InfiniteScrollDocumentList?useHash=false&useInfiniteScroll=false", "AlfDocumentList Sorting Tests (no hash, no infinite scroll)").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "No initial sorting indicated": function() {
            return browser.findDisplayedByCssSelector(selectors.headerCells.all.indicators)
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

            .findAllByCssSelector(selectors.rows.all)
               .then(function(elements) {
                  assert.lengthOf(elements, 4);
               });
         },

         "Sort on name, check four results are still shown": function() {
            return browser.findByCssSelector(selectors.headerCells.name.label)
               .clearLog()
               .click()
            .end()

            .getLastPublish("ALF_RETRIEVE_DOCUMENTS_REQUEST")
            .getLastPublish("ALF_DOCLIST_REQUEST_FINISHED")

            .findAllByCssSelector(selectors.rows.all)
               .then(function(elements) {
                  assert.lengthOf(elements, 4);
               });
         },

         "Ascending icon is shown": function() {
            return browser.findDisplayedByCssSelector(selectors.headerCells.name.ascending);
         },

         "Change sort order of name": function() {
            return browser.findByCssSelector(selectors.headerCells.name.label)
               .clearLog()
               .click()
            .end()

            .getLastPublish("ALF_RETRIEVE_DOCUMENTS_REQUEST")
               .then(function(payload) {
                  assert.propertyVal(payload, "sortAscending", false);
               })

            .getLastPublish("ALF_DOCLIST_REQUEST_FINISHED")

            .findDisplayedByCssSelector(selectors.headerCells.name.descending);
         },

         "Change sort order again": function() {
            return browser.findByCssSelector(selectors.headerCells.name.label)
               .clearLog()
               .click()
            .end()

            .getLastPublish("ALF_RETRIEVE_DOCUMENTS_REQUEST")
               .then(function(payload) {
                  assert.propertyVal(payload, "sortAscending", true);
               })

            .getLastPublish("ALF_DOCLIST_REQUEST_FINISHED")

            .findDisplayedByCssSelector(selectors.headerCells.name.ascending);
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});