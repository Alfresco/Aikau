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
   /* global document */

   var testClearingDocumentList = function(browser, buttonId, errorMsg) {
      return browser.findByCssSelector(".alfresco_logging_DebugLog__clear-button")
         .click()
      .end()

      .execute(function() {
         document.querySelector("#INFINITE_SCROLL_AREA_WITH_DOCLIST .alfresco-layout-FixedHeaderFooter__content").scrollTop += 50;
      })
      .getLastPublish("DOCUMENT_LIST_ALF_EVENTS_SCROLL", "Document list scroll event not registered")

      .findAllByCssSelector("#DOCUMENT_LIST tr")
         .then(function(elements) {
            assert.lengthOf(elements, 20, "Additional rows were not loaded when the bottom of the list was reached");
         })
      .end()

      .findByCssSelector(".alfresco_logging_DebugLog__clear-button")
         .click()
      .end()

      .findByCssSelector(buttonId)
         .click()
      .end()

      .getLastPublish("DOCUMENT_LIST_ALF_DOCLIST_REQUEST_FINISHED", "More results not loaded")

      .findAllByCssSelector("#DOCUMENT_LIST tr")
         .then(function(elements) {
            assert.lengthOf(elements, 10, errorMsg);
         });
   };

   defineSuite(module, {
      name: "AlfSortablePaginatedList Tests",
      testPage: "/AlfSortablePaginatedList#currentPage=2&currentPageSize=20",

      "Preference names are honoured when retrieving pageSize": function() {
         return this.remote.findDisplayedByCssSelector("#HASH_CUSTOM_PAGE_SIZES") // Need to create the session
            .getLogEntries({
               type: "PUBLISH",
               topic: "ALF_PREFERENCE_GET",
               object: "HASH_LIST",
               pos: "last"
            })
            .then(function(payload) {
               assert.propertyVal(payload, "preference", "org.alfresco.share.documentList.documentsPerPage", "Incorrect preference used for HASH_LIST list");
            })

         .getLogEntries({
               type: "PUBLISH",
               topic: "ALF_PREFERENCE_GET",
               object: "DOCUMENT_LIST",
               pos: "last"
            })
            .then(function(payload) {
               assert.propertyVal(payload, "preference", "org.alfresco.share.documentList.documentsPerPage", "Incorrect preference used for DOCUMENT_LIST list");
            })

         .getLogEntries({
               type: "PUBLISH",
               topic: "ALF_PREFERENCE_GET",
               object: "INFINITE_SCROLL_LIST",
               pos: "last"
            })
            .then(function(payload) {
               assert.propertyVal(payload, "preference", "custom.pageSize.preference", "Incorrect preference used for INFINITE_SCROLL_LIST list");
            });
      },

      "Check URL hash controls displayed page": function() {
         // See AKU-293
         return this.remote.findByCssSelector("#HASH_LIST tr:nth-child(1) .alfresco-renderers-Property .value")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "21", "The currentPage URL hash parameter was ignored on load");
            });
      },

      "Check paginator has updated the page size": function() {
         // See AKU-302
         return this.remote.findByCssSelector("#HASH_CUSTOM_PAGE_SIZE_PAGINATOR_RESULTS_PER_PAGE_SELECTOR_text")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "20 per page", "Page size menu ignored URL hash parameter");
            });
      },

      "Count the rows": function() {
         return this.remote.findAllByCssSelector("#HASH_LIST .alfresco-lists-views-layouts-Row")
            .then(function(elements) {
               assert.lengthOf(elements, 20, "There should only be twenty rows");
            });
      },

      "Scroll to bottom of basic infinite scroll area": function() {
         // Click on the first row to give it focus...
         return this.remote.execute(function() {
               document.querySelector("#INFINITE_SCROLL_AREA .alfresco-layout-FixedHeaderFooter__content").scrollTop += 50;
            })
            .getLastPublish("INFINITE_SCROLL_AREA_ALF_EVENTS_SCROLL", "List scroll event not registered")
         .end()
      
         .findAllByCssSelector("#INFINITE_SCROLL_LIST tr")
            .then(function(elements) {
               assert.lengthOf(elements, 20, "Additional rows were not loaded when the bottom of the list was reached");
            });
      },

      "Simulate a filter data request": function() {
         // Clear previous pub/sub log (so that we can detect the next load)...
         return this.remote.findByCssSelector(".alfresco_logging_DebugLog__clear-button")
            .click()
         .end()

         // Scroll back up the page to prevent Chrome loading the next page of data because its so damn fast!
         .execute(function() {
            document.querySelector("#INFINITE_SCROLL_AREA .alfresco-layout-FixedHeaderFooter__content").scrollTop -= 50;
         })

         .findByCssSelector("#SIMULATE_FILTER_label")
            .click()
         .end()

         .getLastPublish("INFINITE_SCROLL_AREA_ALF_DOCLIST_REQUEST_FINISHED", 1500, "More results not loaded")

         .findAllByCssSelector("#INFINITE_SCROLL_LIST tr")
            .then(function(elements) {
               assert.lengthOf(elements, 10, "Old data not cleared when data filter request applied");
            });
      },

      "Simulate a reload request": function() {
         return this.remote.findByCssSelector(".alfresco_logging_DebugLog__clear-button")
            .click()
         .end()
         
         .findByCssSelector("#SIMULATE_RELOAD_label")
            .click()
         .end()
   
         .getLastPublish("INFINITE_SCROLL_AREA_ALF_DOCLIST_REQUEST_FINISHED", "More results not loaded")

         .findAllByCssSelector("#INFINITE_SCROLL_LIST tr")
            .then(function(elements) {
               assert.lengthOf(elements, 10, "Old data not cleared when data filter request applied");
            });
      },

      "Simulate a path change": function() {
         return this.remote.then(() => {
            return testClearingDocumentList(this.remote, "#SIMULATE_PATH_CHANGE_label", "Old data not cleared when path change request applied");
         });
      },

      "Simulate a category change": function() {
         return this.remote.then(() => {
            return testClearingDocumentList(this.remote, "#SIMULATE_CATEGORY_CHANGE_label", "Old data not cleared when category change request applied");
         });
      },

      "Simulate a tag change": function() {
         return this.remote.then(() => {
            return testClearingDocumentList(this.remote, "#SIMULATE_TAG_CHANGE_label", "Old data not cleared when tag change request applied");
         });
      },

      "Simulate a filter change": function() {
         return this.remote.then(() => {
            return testClearingDocumentList(this.remote, "#SIMULATE_FILTER_CHANGE_label", "Old data not cleared when filter change request applied");
         });
      }
   });

   defineSuite(module, {
      name: "AlfSortablePaginatedList Tests (item selection retention)",
      testPage: "/AlfSortablePaginatedList",

      "Select items": function() {
         return this.remote.findDisplayedById("SELECTOR_ITEM_2")
            .click()
         .end()

         .getLastPublish("HASH_CUSTOM_ALF_DOCLIST_FILE_SELECTION", "Selection data not published (1)")
         .clearLog()

         .findDisplayedById("SELECTOR_ITEM_4")
            .click()
         .end()

         .getLastPublish("HASH_CUSTOM_ALF_DOCLIST_FILE_SELECTION", "Selection data not published (2)")
         .clearLog();
      },

      "Switch order and check items are still selected": function() {
         return this.remote.findById("DESCENDING_text")
            .click()
            .end()

         .getLastPublish("HASH_CUSTOM_ALF_RETRIEVE_DOCUMENTS_REQUEST_SUCCESS", "Data not reloaded")
            .clearLog()

         .findByCssSelector("#SELECTOR_ITEM_2.alfresco-lists-ItemSelectionMixin--selected")
         .end()

         .findByCssSelector("#SELECTOR_ITEM_4.alfresco-lists-ItemSelectionMixin--selected");
      },

      "Change the page size and check items are still selected": function() {
         return this.remote.findById("HASH_CUSTOM_PAGE_SIZE_PAGINATOR_RESULTS_PER_PAGE_SELECTOR_text")
            .click()
         .end()

         .findDisplayedByCssSelector("#HASH_CUSTOM_PAGE_SIZE_PAGINATOR_RESULTS_PER_PAGE_SELECTOR_dropdown tr:first-child .dijitMenuItemLabel")
            .click()
         .end()

         .getLastPublish("HASH_CUSTOM_ALF_RETRIEVE_DOCUMENTS_REQUEST_SUCCESS", "Data not reloaded")
            .clearLog()

         .findByCssSelector("#SELECTOR_ITEM_2.alfresco-lists-ItemSelectionMixin--selected")
         .end()

         .findByCssSelector("#SELECTOR_ITEM_4.alfresco-lists-ItemSelectionMixin--selected");
      }
   });

   defineSuite(module, {
      name: "AlfSortablePaginatedList Tests (data load failure)",
      testPage: "/AlfSortablePaginatedListDataFail",

      "Check data failure message": function() {
         return this.remote.findByCssSelector("#LIST .data-failure")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "Loading message not displayed");
            });
      },

      "Check that the pagination controls are all hidden": function() {
         return this.remote.findByCssSelector("#PAGINATOR_PAGE_SELECTOR")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The page selector was NOT hidden");
            })
         .end()
      
         .findByCssSelector("#PAGINATOR_PAGE_BACK")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The page back button was NOT hidden");
            })
         .end()
   
         .findByCssSelector("#PAGINATOR_PAGE_MARKER")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The page indicator was NOT hidden");
            })
         .end()

         .findByCssSelector("#PAGINATOR_PAGE_FORWARD")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The page forward button was NOT hidden");
            })
         .end()

         .findByCssSelector("#PAGINATOR_RESULTS_PER_PAGE_SELECTOR")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The items per page selector was NOT hidden");
            });
      },

      "Resize and check that controls are all still hidden": function() {
         return this.remote.setWindowSize(null, 1024, 300)
            .findByCssSelector("#PAGINATOR_RESULTS_PER_PAGE_SELECTOR")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The items per page selector was revealed on resize");
            });
      }
   });
});