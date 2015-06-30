/**
 * Copyright (C) 2005-2015 Alfresco Software Limited.
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
        "require",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"], 
        function (registerSuite, assert, require, TestCommon, keys) {

   

   var browser;

   var testClearingDocumentList = function(buttonId, errorMsg) {
      return browser.findByCssSelector(".alfresco_logging_DebugLog__clear-button")
         .click()
      .end()
      .findByCssSelector("#DOCUMENT_LIST tr:nth-child(1) .alfresco-renderers-Property")
         .click()
         .pressKeys(keys.ARROW_DOWN)
         .pressKeys(keys.ARROW_DOWN)
         .pressKeys(keys.ARROW_DOWN)
         .pressKeys(keys.ARROW_DOWN)
         .pressKeys(keys.ARROW_DOWN)
         .pressKeys(keys.ARROW_DOWN)
         .pressKeys(keys.ARROW_DOWN)
         .pressKeys(keys.ARROW_DOWN)
      .end()
      .getLastPublish("DOCUMENT_LIST_ALF_EVENTS_SCROLL")
         .then(function(payload) {
            assert.isNotNull(payload, "Document list scroll event not registered");
         })
      .end()
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
      .getLastPublish("DOCUMENT_LIST_ALF_DOCLIST_REQUEST_FINISHED")
         .then(function(payload) {
            assert.isNotNull(payload, "More results not loaded");
         })
      .end()
      .findAllByCssSelector("#DOCUMENT_LIST tr")
         .then(function(elements) {
            assert.lengthOf(elements, 10, errorMsg);
         });
   };


   registerSuite({
      name: "AlfSortablePaginatedList Tests",
      
      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/AlfSortablePaginatedList#currentPage=2&currentPageSize=20", "AlfSortablePaginatedList Tests").end();
      },
      
      beforeEach: function() {
         browser.end();
      },

      "Check URL hash controls displayed page": function() {
         // See AKU-293
         return browser.findByCssSelector("#HASH_LIST tr:nth-child(1) .alfresco-renderers-Property .value")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "21", "The currentPage URL hash parameter was ignored on load");
            });
      },

      "Check paginator has updated the page size": function() {
         // See AKU-302
         return browser.findByCssSelector("#HASH_CUSTOM_PAGE_SIZE_PAGINATOR_RESULTS_PER_PAGE_SELECTOR_text")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "20 per page", "Page size menu ignored URL hash parameter");
            });
      },

      "Count the rows": function() {
         return browser.findAllByCssSelector("#HASH_LIST .alfresco-lists-views-layouts-Row")
            .then(function(elements) {
               assert.lengthOf(elements, 20, "There should only be twenty rows");
            });
      },

      "Scroll to bottom of basic infinite scroll area": function() {
         // Click on the first row to give it focus...
         return browser.findByCssSelector("#INFITE_SCROLL_LIST tr:nth-child(1) .alfresco-renderers-Property")
            .click()
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN)
         .end()
         .getLastPublish("INFINITE_SCROLL_AREA_ALF_EVENTS_SCROLL")
            .then(function(payload) {
               assert.isNotNull(payload, "List scroll event not registered");
            })
         .end()
         .findAllByCssSelector("#INFITE_SCROLL_LIST tr")
            .then(function(elements) {
               assert.lengthOf(elements, 20, "Additional rows were not loaded when the bottom of the list was reached");
            });
      },

      "Simulate a filter data request": function() {
         // Clear previous pub/sub log (so that we can detect the next load)...
         return browser.findByCssSelector(".alfresco_logging_DebugLog__clear-button")
            .click()
         .end()
         .findByCssSelector("#SIMULATE_FILTER_label")
            .click()
         .end()
         .getLastPublish("INFINITE_SCROLL_AREA_ALF_DOCLIST_REQUEST_FINISHED")
            .then(function(payload) {
               assert.isNotNull(payload, "More results not loaded");
            })
         .end()
         .findAllByCssSelector("#INFITE_SCROLL_LIST tr")
            .then(function(elements) {
               assert.lengthOf(elements, 10, "Old data not cleared when data filter request applied");
            });
      },

      "Simulate a reload request": function() {
         return browser.findByCssSelector(".alfresco_logging_DebugLog__clear-button")
            .click()
         .end()
         .findByCssSelector("#SIMULATE_RELOAD_label")
            .click()
         .end()
         .getLastPublish("INFINITE_SCROLL_AREA_ALF_DOCLIST_REQUEST_FINISHED")
            .then(function(payload) {
               assert.isNotNull(payload, "More results not loaded");
            })
         .end()
         .findAllByCssSelector("#INFITE_SCROLL_LIST tr")
            .then(function(elements) {
               assert.lengthOf(elements, 10, "Old data not cleared when data filter request applied");
            });
      },

      "Simulate a path change": function() {
         return browser.then(function() {
            return testClearingDocumentList("#SIMULATE_PATH_CHANGE_label", "Old data not cleared when path change request applied");
         });
      },

      "Simulate a category change": function() {
         return browser.then(function() {
            return testClearingDocumentList("#SIMULATE_CATEGORY_CHANGE_label", "Old data not cleared when category change request applied");
         });
      },

      "Simulate a tag change": function() {
         return browser.then(function() {
            return testClearingDocumentList("#SIMULATE_TAG_CHANGE_label", "Old data not cleared when tag change request applied");
         });
      },

      "Simulate a filter change": function() {
         return browser.then(function() {
            return testClearingDocumentList("#SIMULATE_FILTER_CHANGE_label", "Old data not cleared when filter change request applied");
         });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });

   registerSuite({
      name: "AlfSortablePaginatedList Tests (data load failure)",
      
      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/AlfSortablePaginatedListDataFail", "AlfSortablePaginatedList Tests (data load failure)").end();
      },
      
      beforeEach: function() {
         browser.end();
      },

      "Check data failure message": function() {
         return browser.findByCssSelector("#LIST .data-failure")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "Loading message not displayed");
            });
      },

      "Check that the pagination controls are all hidden": function() {
         return browser.findByCssSelector("#PAGINATOR_PAGE_SELECTOR")
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
         return browser.setWindowSize(null, 1024, 300)
            .findByCssSelector("#PAGINATOR_RESULTS_PER_PAGE_SELECTOR")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The items per page selector was revealed on resize");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });
});