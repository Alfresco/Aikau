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
         },
         description: {
            indicators: TestCommon.getTestSelector(headerCellSelectors, "indicator", ["TABLE_VIEW_DESCRIPTION_HEADING"]),
            ascending: TestCommon.getTestSelector(headerCellSelectors, "ascending.indicator", ["TABLE_VIEW_DESCRIPTION_HEADING"]),
            descending: TestCommon.getTestSelector(headerCellSelectors, "descending.indicator", ["TABLE_VIEW_DESCRIPTION_HEADING"]),
            label: TestCommon.getTestSelector(headerCellSelectors, "label", ["TABLE_VIEW_DESCRIPTION_HEADING"])
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

      // See AKU-1019
      "Select and invert": function() {
         // Select the first item...
         return this.remote.findDisplayedByCssSelector("#TABLE_SELECTOR_ITEM_0")
            .click()
         .end()

         // Check that the CSS matches the selected state...
         .findByCssSelector("#TABLE_SELECTOR_ITEM_0.alfresco-lists-ItemSelectionMixin--selected")
         .end()

         // Open the selection drop-down...
         .findByCssSelector("#ITEM_SELECTION .alfresco-menus-AlfMenuBarPopup__arrow")
            .click()
         .end()

         // Select the "invert" menu item...
         .findDisplayedByCssSelector("#ITEM_SELECTION_dropdown tr:nth-child(3) .dijitMenuItemLabel")
            .click()
         .end()

         // Check the selected item is now deselected...
         .findAllByCssSelector("#TABLE_SELECTOR_ITEM_0.alfresco-lists-ItemSelectionMixin--selected")
            .then(function(elements) {
               assert.lengthOf(elements, 0);
            })
         .end()

         // Check that one of the other items is now selected...
         .findByCssSelector("#TABLE_SELECTOR_ITEM_1.alfresco-lists-ItemSelectionMixin--selected");
      },

      "Sort via menu": function() {
         // Open the sort menu...
         return this.remote.findDisplayedByCssSelector(selectors.sortMenu.label)
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

   defineSuite(module, {
      name: "AlfDocumentList Sorting Tests (no hash, no infinite scroll)",
      testPage: "/InfiniteScrollDocumentList?useHash=false&includeSortMenu=true",

      "Sort on description, check menu is updated": function() {
         return this.remote.findDisplayedByCssSelector(selectors.sortMenu.label)
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Name");
            })
         .end()

         .findByCssSelector(selectors.headerCells.description.label)
            .clearLog()
            .click()
         .end()

         .getLastPublish("ALF_RETRIEVE_DOCUMENTS_REQUEST")
         .getLastPublish("ALF_DOCLIST_REQUEST_FINISHED")

         .findDisplayedByCssSelector(selectors.sortMenu.label)
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Description");
            });
      },

      "Change sort order via header, check toggle is updated": function() {
         return this.remote.findDisplayedByCssSelector("#SORT_TOGGLE img.alf-sort-ascending-icon")
         .end()

         .findByCssSelector(selectors.headerCells.description.label)
            .clearLog()
            .click()
         .end()

         .getLastPublish("ALF_RETRIEVE_DOCUMENTS_REQUEST")
         .getLastPublish("ALF_DOCLIST_REQUEST_FINISHED")

         .findDisplayedByCssSelector("#SORT_TOGGLE img.alf-sort-descending-icon");
      }
   });
});