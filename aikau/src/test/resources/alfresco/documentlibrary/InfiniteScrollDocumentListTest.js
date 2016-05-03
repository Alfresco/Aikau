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

   var rowSelectors = TestCommon.getTestSelectors("alfresco/lists/views/layouts/Row");
   var headerCellSelectors = TestCommon.getTestSelectors("alfresco/lists/views/layouts/HeaderCell");
   var menuBarSelectSelectors = TestCommon.getTestSelectors("alfresco/menus/AlfMenuBarSelect");
   var checkableMenuItemSelectors = TestCommon.getTestSelectors("alfresco/menus/AlfCheckableMenuItem");

   var selectors = {
      rows: {
         all: TestCommon.getTestSelector(rowSelectors, "row")
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
      },
      sortMenu: {
         label: TestCommon.getTestSelector(menuBarSelectSelectors, "label", ["DOCLIB_SORT_FIELD_SELECT"]),
         popup: TestCommon.getTestSelector(menuBarSelectSelectors, "popup", ["DOCLIB_SORT_FIELD_SELECT"])
      },
      sortItems: {
         fourth: TestCommon.getTestSelector(checkableMenuItemSelectors, "nth.item.label", ["DOCLIB_SORT_FIELD_SELECT_GROUP", "4"])
      }
   };

   defineSuite(module, {
      name: "AlfDocumentList Tests (infinite scrolling)",
      testPage: "/InfiniteScrollDocumentList",

      "No initial sorting indicated": function() {
         return this.remote.findDisplayedByCssSelector(selectors.headerCells.all.indicators)
            .then(function() {
                  assert(false, "Should not have found any displayed sort indicators");
               },
               function() {
                  assert(true);
               });
      },

      "Four results shown initially": function() {
         return this.remote.findByCssSelector("body").end()

         .getLastPublish("ALF_DOCLIST_REQUEST_FINISHED")

         .findAllByCssSelector(selectors.rows.all)
            .then(function(elements) {
               assert.lengthOf(elements, 4);
            });
      },

      "Sort on name, check four results are still shown": function() {
         return this.remote.findByCssSelector(selectors.headerCells.name.label)
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

      "Reload the page and check initial sorting displayed": function() {
         return this.remote.reload()
         
         .getLastPublish("ALF_DOCLIST_REQUEST_FINISHED")

         .findDisplayedByCssSelector(selectors.headerCells.all.indicators);
      }
   });

   defineSuite(module, {
      name: "AlfDocumentList Sorting Tests (sort via menu)",
      testPage: "/InfiniteScrollDocumentList?includeSortMenu=true",

      "Sort via menu": function() {
         // Open the sort menu...
         return this.remote.findByCssSelector(selectors.sortMenu.label)
            .click()
            .end()

         .clearLog()

         // Wait for it to open...
         .findDisplayedByCssSelector(selectors.sortMenu.popup)
            .end()

         // Click the fourth sort item...
         .findDisplayedByCssSelector(selectors.sortItems.fourth)
            .click()
            .end()

         .getLastPublish("ALF_DOCLIST_REQUEST_FINISHED")

         .findAllByCssSelector(selectors.rows.all)
            .then(function(elements) {
               assert.lengthOf(elements, 4);
            });
      },

      // See AKU-924
      "Use back button": function() {
         return this.remote.goBack()

         .getLastPublish("ALF_DOCLIST_REQUEST_FINISHED")

         .findAllByCssSelector(selectors.rows.all)
            .then(function(elements) {
               assert.lengthOf(elements, 4);
            });
      }
   });

   defineSuite(module, {
      name: "AlfDocumentList Sorting Tests (no hash, no infinite scroll)",
      testPage: "/InfiniteScrollDocumentList?useHash=false&useInfiniteScroll=false",

      "No initial sorting indicated": function() {
         return this.remote.findDisplayedByCssSelector(selectors.headerCells.all.indicators)
            .then(function() {
                  assert(false, "Should not have found any displayed sort indicators");
               },
               function() {
                  assert(true);
               });
      },

      "Four results shown initially": function() {
         return this.remote.findByCssSelector("body").end()

         .getLastPublish("ALF_DOCLIST_REQUEST_FINISHED")

         .findAllByCssSelector(selectors.rows.all)
            .then(function(elements) {
               assert.lengthOf(elements, 4);
            });
      },

      "Sort on name, check four results are still shown": function() {
         return this.remote.findByCssSelector(selectors.headerCells.name.label)
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
         return this.remote.findDisplayedByCssSelector(selectors.headerCells.name.ascending);
      },

      "Change sort order of name": function() {
         return this.remote.findByCssSelector(selectors.headerCells.name.label)
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
         return this.remote.findByCssSelector(selectors.headerCells.name.label)
            .clearLog()
            .click()
            .end()

         .getLastPublish("ALF_RETRIEVE_DOCUMENTS_REQUEST")
            .then(function(payload) {
               assert.propertyVal(payload, "sortAscending", true);
            })

         .getLastPublish("ALF_DOCLIST_REQUEST_FINISHED")

         .findDisplayedByCssSelector(selectors.headerCells.name.ascending);
      }
   });
});