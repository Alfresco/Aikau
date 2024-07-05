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
        "intern/dojo/lang", 
        "intern/dojo/node!leadfoot/Command"], 
        function(module, defineSuite, assert, lang, Command) {

   // Decorate the Command object with specific extensions for this module
   // NOTE: Not ideal prefixing the function names, but need to scope them as this
   // is essentially a global object. Longer-term, this should be refactored to be
   // handled more elegantly.
   lang.mixin(Command.prototype, {
      PaginationTest_clickButton: function(buttonId) {
         return new this.constructor(this, function() {
            var browser = this.parent;
            return browser.findByCssSelector("[widgetid=\"" + buttonId + "\"] .dijitButtonNode")
               .click()
               .end();
         });
      },

      PaginationTest_gotoNextPage: function(scope) {
         return new this.constructor(this, function() {
            var browser = this.parent;
            return browser.findById(scope + "PAGE_SIZE_PAGINATOR_PAGE_FORWARD")
               .clearLog()
               .click()
               .end()

            .getLastPublish("ALF_PAGE_FORWARD")

            .getLastPublish("ALF_DOCLIST_REQUEST_FINISHED")

            .waitForDeletedByCssSelector(".alfresco-lists-AlfList--loading");
         });
      },

      PaginationTest_checkPage: function(scope, pageNum) {
         var firstItem = ((pageNum - 1) * 10) + 1;
         return new this.constructor(this, function() {
            var browser = this.parent;
            return browser.findById(scope + "PAGE_SIZE_PAGINATOR_PAGE_MARKER")
               .getVisibleText()
               .then(function(text) {
                  assert.equal(text, "" + pageNum, "Should be displaying that page number is " + pageNum);
               })
               .end()

            .findByCssSelector("#" + scope + "PAGE_SIZES .alfresco-lists-views-layouts-Row:first-child")
               .getVisibleText()
               .then(function(text) {
                  assert.equal(text, "" + firstItem, "Should be displaying results from page " + pageNum);
               })
               .end();
         });
      }
   });

   defineSuite(module, {
      name: "Pagination Tests",
      testPage: "/Paginator",

      "Test page selector drop-down label intialization": function() {
         return this.remote.getLastPublish("ALF_WIDGETS_READY")
            .end()

         .findByCssSelector("#PAGINATOR_PAGE_SELECTOR_text")
            .getVisibleText()
            .then(function(text) {
               assert(text === "1-25 of 243", "Page selector menu label didn't initialize correctly, expected '1-25 of 243' but saw: " + text);
            });
      },

      "Test custom configured page selector drop-down label intialization": function() {
         return this.remote.findByCssSelector("#CUSTOM_PAGE_SIZE_PAGINATOR_PAGE_SELECTOR_text")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "1-10 of 243", "Page selector menu label didn't initialize correctly for custom pagination");
            });
      },

      "Test custom configured page size selector value": function() {
         return this.remote.findByCssSelector("#CUSTOM_PAGE_SIZE_PAGINATOR_RESULTS_PER_PAGE_SELECTOR_text")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "10 per page", "Page size menu label didn't initialize correctly for custom pagination");
            });
      },

      "Count custom configured page sizes": function() {
         return this.remote.findByCssSelector("#CUSTOM_PAGE_SIZE_PAGINATOR_RESULTS_PER_PAGE_SELECTOR_text")
            .click()
            .end()

         .findAllByCssSelector("#CUSTOM_PAGE_SIZE_PAGINATOR_RESULTS_PER_PAGE_SELECTOR_dropdown .alfresco-menus-AlfCheckableMenuItem")
            .then(function(elements) {
               assert.lengthOf(elements, 3, "The wrong number of custom page sizes was found");
            });
      },

      "Test prevous page button is disabled on page load": function() {
         return this.remote.findAllByCssSelector("#PAGINATOR_PAGE_BACK.dijitDisabled")
            .then(function(elements) {
               assert(elements.length === 1, "The previous page button should be disabled");
            });
      },

      "Test next page button is enabled on page load": function() {
         return this.remote.findAllByCssSelector("#PAGINATOR_PAGE_FORWARD.dijitDisabled")
            .then(function(elements) {
               assert(elements.length === 0, "The next page button should be enabled");
            });
      },

      "Check customized back button label": function() {
         return this.remote.findById("CUSTOM_PAGE_SIZE_PAGINATOR_PAGE_BACK_text")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Last One");
            });
      },

      "Check customized forward button label": function() {
         return this.remote.findById("CUSTOM_PAGE_SIZE_PAGINATOR_PAGE_FORWARD_text")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Next One");
            });
      },

      "Test items loaded correctly (check first row of 25 items)": function() {
         return this.remote.findByCssSelector(".alfresco-lists-AlfList tr:nth-child(1) span.value")
            .getVisibleText()
            .then(function(text) {
               assert(text === "1", "First displayed row should be 1, saw: " + text);
            });
      },

      "Test items loaded correctly (check last row of 25 items)": function() {
         return this.remote.findByCssSelector(".alfresco-lists-AlfList tr:nth-child(25) span.value")
            .getVisibleText()
            .then(function(text) {
               assert(text === "25", "First displayed row should be 25, saw: " + text);
            });
      },

      "Test 50 items per page selection update page selector drop-down label": function() {
         // Wait for the data to load and the page to draw - this is currently slow and the rendering needs to be
         // Switch to 50 results per page...
         return this.remote.findByCssSelector("#PAGINATOR_RESULTS_PER_PAGE_SELECTOR_text")
            .click()
            .end()

         .findByCssSelector("#PAGINATOR_RESULTS_PER_PAGE_SELECTOR_dropdown tr:nth-child(2) td:nth-child(3)")
            .click()
            .end()
            .findByCssSelector("#PAGINATOR_PAGE_SELECTOR_text")
            .getVisibleText()
            .then(function(text) {
               assert(text === "1-50 of 243", "Page selector label not updated correctly after switching to 50 items per page: " + text);
            });
      },

      "Test that user page size user preference is updated": function() {
         return this.remote.findByCssSelector("body")
            .end()

         .getLastXhr("aikau/proxy/alfresco/api/people/guest/preferences")
            .then(function(xhr) {
               assert.deepPropertyVal(xhr.request.body, "org.alfresco.share.documentList.documentsPerPage", 50);
            });
      },

      "Test previous page button is still disabled (after increasing page size)": function() {
         return this.remote.findAllByCssSelector("#PAGINATOR_PAGE_BACK.dijitDisabled")
            .then(function(elements) {
               assert(elements.length === 1, "The previous page button should still be disabled");
            });
      },

      "Test next page button is still enabled (after increasing page size)": function() {
         return this.remote.findAllByCssSelector("#PAGINATOR_PAGE_FORWARD.dijitDisabled")
            .then(function(elements) {
               assert(elements.length === 0, "The next page button should still be enabled");
            });
      },

      "Test clicking next page updates page selector drop-down label": function() {
         return this.remote.findByCssSelector("#PAGINATOR_PAGE_FORWARD_text")
            .click()
            .end()

         .findByCssSelector("#PAGINATOR_PAGE_SELECTOR_text")
            .getVisibleText()
            .then(function(text) {
               assert(text === "51-100 of 243", "Page selector label not correct, expected '51-100 of 243' but saw: " + text);
            });
      },

      "Test clicking next page enables previous page button": function() {
         return this.remote.findAllByCssSelector("#PAGINATOR_PAGE_BACK.dijitDisabled")
            .then(function(elements) {
               assert(elements.length === 0, "The previous page button should now be enabled");
            });
      },

      "Test next page button is still enabled (after using next page button)": function() {
         return this.remote.findAllByCssSelector("#PAGINATOR_PAGE_FORWARD.dijitDisabled")
            .then(function(elements) {
               assert(elements.length === 0, "The next page button should still be enabled");
            });
      },

      "Test previous page button updates page selector drop-down label": function() {
         return this.remote.findByCssSelector("#PAGINATOR_PAGE_BACK_text")
            .click()
            .end()

         .findByCssSelector("#PAGINATOR_PAGE_SELECTOR_text")
            .getVisibleText()
            .then(function(text) {
               assert(text === "1-50 of 243", "Page selector label not correct, expected '1-50 of 243' but saw: " + text);
            });
      },

      "Test previous page button is disabled (after previous page action)": function() {
         return this.remote.findAllByCssSelector("#PAGINATOR_PAGE_BACK.dijitDisabled")
            .then(function(elements) {
               assert(elements.length === 1, "The previous page button should now be disabled");
            });
      },

      "Test page selection updates page selector label correctly": function() {
         // Select the 4th page, because there are 5 pages and we want to click next page to check that
         // using the next page button will disable the next page button when the last page is reached...
         return this.remote.findByCssSelector("#PAGINATOR_PAGE_SELECTOR_text")
            .click()
            .end()

         .findByCssSelector("#PAGINATOR_PAGE_SELECTOR_dropdown tr:nth-child(4) td:nth-child(3)")
            .click()
            .end()

         .findByCssSelector("#PAGINATOR_PAGE_SELECTOR_text")
            .getVisibleText()
            .then(function(text) {
               assert(text === "151-200 of 243", "Page selector label not correct, expected '151-200 of 243' but saw: " + text);
            });
      },

      "Test next page button (to last page) disables next page button": function() {
         return this.remote.findByCssSelector("#PAGINATOR_PAGE_FORWARD_text")
            .click()
            .end()

         .findAllByCssSelector("#PAGINATOR_PAGE_FORWARD.dijitDisabled")
            .then(function(elements) {
               assert(elements.length === 1, "The next page button should be disabled when next paging to the last page");
            });
      },

      "Test increasing page size adjusts current page (50 to 100 on last page)": function() {
         // This tests that when we increase the page size on the last page, we don't attempt to load
         // a page of data that won't exist... instead, we should load a smaller page number to
         // accommodate the larger page size.
         // Select 100 items per page and the page number should go from 5 to 3...
         return this.remote.findByCssSelector("#PAGINATOR_RESULTS_PER_PAGE_SELECTOR_text")
            .click()
            .end()

         .findByCssSelector("#PAGINATOR_RESULTS_PER_PAGE_SELECTOR_dropdown tr:nth-child(4) td:nth-child(3)")
            .click()
            .end()

         .findByCssSelector("#PAGINATOR_PAGE_SELECTOR_text")
            .getVisibleText()
            .then(function(text) {
               assert(text === "201-243 of 243", "Page selector label not correct, expected '201-243 of 243' but saw: " + text);
            })
            .end()

         .findByCssSelector("#PAGINATOR_PAGE_MARKER > span")
            .getVisibleText()
            .then(function(text) {
               assert(text === "3", "Page number not correct, expected '3' but saw: " + text);
            });
      },

      "Test items loaded correctly for incomplete page(check first row of 100 items": function() {
         return this.remote.findByCssSelector(".alfresco-lists-AlfList tr:nth-child(1) span.value")
            .getVisibleText()
            .then(function(text) {
               assert(text === "201", "First displayed row should be 201, saw: " + text);
            });
      },

      "Test items loaded correctly (check last row of 100 items": function() {
         return this.remote.findByCssSelector(".alfresco-lists-AlfList tr:nth-child(43) span.value")
            .getVisibleText()
            .then(function(text) {
               assert(text === "243", "First displayed row should be 243, saw: " + text);
            });
      },

      "Test Results Per Page Group": function() {
         // This tests the external results per page menu, to ensure it picks up changes correctly...
         return this.remote.findByCssSelector("#MENU_BAR_POPUP_text")
            .click()
            .end()

         .findAllByCssSelector("#MENU_BAR_POPUP_dropdown .alfresco-menus-AlfCheckableMenuItem--checked")
            .then(function(elements) {
               assert(elements.length === 1, "Results per page widget check box not highlighted correctly");
            });
      },

      "Test reducing page size adjusts current page (100 to 25 on last page)": function() {
         // This tests that when we reduce the page size on the last page jump to an
         // appropriate page for the smaller page size. Although we're on the last page (201-243) for
         // 100 items per page, we want to jump to the penultimate page for 25 items per page (201-225)
         // as this is the most appropriate page for where we were.
         return this.remote.findByCssSelector("#PAGINATOR_RESULTS_PER_PAGE_SELECTOR_text")
            .click()
            .end()

         .findByCssSelector("#PAGINATOR_RESULTS_PER_PAGE_SELECTOR_dropdown tr:nth-child(1) td:nth-child(3)")
            .click()
            .end()

         .findByCssSelector("#PAGINATOR_PAGE_SELECTOR_text")
            .getVisibleText()
            .then(function(text) {
               assert(text === "201-225 of 243", "Page selector label not correct, expected '201-225 of 243' but saw: " + text);
            })
            .end()

         .findByCssSelector("#PAGINATOR_PAGE_MARKER > span")
            .getVisibleText()
            .then(function(text) {
               assert(text === "9", "Page number not correct, expected '9' but saw: " + text);
            });
      }
   });

   // See AKU-330...
   defineSuite(module, function() {
      return {
         name: "Pagination Tests (Custom page sizes)",
         testPage: "/Paginator",

         "Starting page is initialised and working (useHash=false)": function() {
            return this.remote.PaginationTest_checkPage("CUSTOM_", 1)
               .PaginationTest_gotoNextPage("CUSTOM_")
               .PaginationTest_checkPage("CUSTOM_", 2);
         },

         "Changing filter changes to page 1 (useHash=false)": function() {
            return this.remote.PaginationTest_clickButton("CHANGE_FILTER")
               .PaginationTest_checkPage("CUSTOM_", 1)
               .PaginationTest_gotoNextPage("CUSTOM_");
         },

         "Changing tag changes to page 1 (useHash=false)": function() {
            return this.remote.PaginationTest_clickButton("CHANGE_TAG")
               .PaginationTest_checkPage("CUSTOM_", 1)
               .PaginationTest_gotoNextPage("CUSTOM_");
         },

         "Changing category changes to page 1 (useHash=false)": function() {
            return this.remote.PaginationTest_clickButton("CHANGE_CATEGORY")
               .PaginationTest_checkPage("CUSTOM_", 1)
               .PaginationTest_gotoNextPage("CUSTOM_");
         },

         "Changing path changes to page 1 (useHash=false)": function() {
            return this.remote.PaginationTest_clickButton("CHANGE_PATH")
               .PaginationTest_checkPage("CUSTOM_", 1)
               .PaginationTest_gotoNextPage("CUSTOM_");
         },

         "Starting page is initialised and working (useHash=true)": function() {
            return this.remote.PaginationTest_checkPage("HASH_CUSTOM_", 1)
               .PaginationTest_gotoNextPage("HASH_CUSTOM_")
               .PaginationTest_checkPage("HASH_CUSTOM_", 2);
         },

         "Changing filter changes to page 1 (useHash=true)": function() {
            return this.remote.PaginationTest_clickButton("HASH_CHANGE_FILTER")
               .PaginationTest_checkPage("HASH_CUSTOM_", 1)
               .PaginationTest_gotoNextPage("HASH_CUSTOM_");
         },

         "Changing tag changes to page 1 (useHash=true)": function() {
            return this.remote.PaginationTest_clickButton("HASH_CHANGE_TAG")
               .PaginationTest_checkPage("HASH_CUSTOM_", 1)
               .PaginationTest_gotoNextPage("HASH_CUSTOM_");
         },

         "Changing category changes to page 1 (useHash=true)": function() {
            return this.remote.PaginationTest_clickButton("HASH_CHANGE_CATEGORY")
               .PaginationTest_checkPage("HASH_CUSTOM_", 1)
               .PaginationTest_gotoNextPage("HASH_CUSTOM_");
         },

         "Changing path changes to page 1 (useHash=true)": function() {
            return this.remote.PaginationTest_clickButton("HASH_CHANGE_PATH")
               .PaginationTest_checkPage("HASH_CUSTOM_", 1)
               .PaginationTest_gotoNextPage("HASH_CUSTOM_");
         }
      };
   });

   defineSuite(module, {
      name: "Pagination Tests (invalid current page)",
      testPage: "/Paginator#currentPage=14&currentPageSize=20",

      "Check no data message": function() {
         return this.remote.findByCssSelector("#HASH_LIST .rendered-view")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "There's nothing to display", "No data message not displayed");
            });
      },

      "Check that the pagination controls are all hidden": function() {
         return this.remote.findByCssSelector("#HASH_CUSTOM_PAGE_SIZE_PAGINATOR_PAGE_SELECTOR")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The page selector was not hidden");
            })
            .end()
            .findByCssSelector("#HASH_CUSTOM_PAGE_SIZE_PAGINATOR_PAGE_BACK")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The page back button was not hidden");
            })
            .end()
            .findByCssSelector("#HASH_CUSTOM_PAGE_SIZE_PAGINATOR_PAGE_MARKER")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The page indicator was not hidden");
            })
            .end()
            .findByCssSelector("#HASH_CUSTOM_PAGE_SIZE_PAGINATOR_PAGE_FORWARD")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The page forward button was not hidden");
            })
            .end()
            .findByCssSelector("#HASH_CUSTOM_PAGE_SIZE_PAGINATOR_RESULTS_PER_PAGE_SELECTOR")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The items per page selector was not hidden");
            });
      }
   });

   defineSuite(module, {
      name: "Pagination Tests (valid current page)",
      testPage: "/Paginator#currentPage=13&currentPageSize=20",

      "Check results": function() {
         return this.remote.findAllByCssSelector("#HASH_LIST tr")
            .then(function(elements) {
               assert.lengthOf(elements, 3, "Unexpected number of results shown");
            });
      },

      "Check that the pagination controls are all hidden": function() {
         return this.remote.findByCssSelector("#HASH_CUSTOM_PAGE_SIZE_PAGINATOR_PAGE_SELECTOR")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "The page selector was hidden");
            })
            .end()
            .findByCssSelector("#HASH_CUSTOM_PAGE_SIZE_PAGINATOR_PAGE_BACK")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "The page back button was hidden");
            })
            .end()
            .findByCssSelector("#HASH_CUSTOM_PAGE_SIZE_PAGINATOR_PAGE_MARKER")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "The page indicator was hidden");
            })
            .end()
            .findByCssSelector("#HASH_CUSTOM_PAGE_SIZE_PAGINATOR_PAGE_FORWARD")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "The page forward button was hidden");
            })
            .end()
            .findByCssSelector("#HASH_CUSTOM_PAGE_SIZE_PAGINATOR_RESULTS_PER_PAGE_SELECTOR")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "The items per page selector was hidden");
            });
      }
   });

   defineSuite(module, {
      name: "Pagination Tests (compact mode)",
      testPage: "/Paginator",

      "Correct items displayed": function() {
         return this.remote.findAllByCssSelector("#COMPACT_MODE_LIST tr")
            .then(function(elements) {
               assert.lengthOf(elements, 25);
            })
            .end()

         .findByCssSelector("#COMPACT_MODE_LIST tr:first-child")
            .getVisibleText()
            .then(function(visibleText) {
               assert.equal(visibleText, "1");
            })
            .end()

         .findByCssSelector("#COMPACT_MODE_LIST tr:last-child")
            .getVisibleText()
            .then(function(visibleText) {
               assert.equal(visibleText, "25");
            });
      },

      "Correct pagination controls displayed": function() {
         return this.remote.findAllByCssSelector("#COMPACT_MODE_PAGE_SIZE_PAGINATOR .dijitMenuItem")
            .then(function(elements) {
               assert.lengthOf(elements, 3);
            })
            .end()

         .findById("COMPACT_MODE_PAGE_SIZE_PAGINATOR_PAGE_BACK")
            .end()

         .findById("COMPACT_MODE_PAGE_SIZE_PAGINATOR_PAGE_MARKER")
            .end()

         .findById("COMPACT_MODE_PAGE_SIZE_PAGINATOR_PAGE_FORWARD");
      },

      "Going to next page changes items": function() {
         return this.remote.findById("COMPACT_MODE_PAGE_SIZE_PAGINATOR_PAGE_FORWARD")
            .clearLog()
            .click()
            .end()

         .getLastPublish("COMPACT_MODE_ALF_DOCLIST_REQUEST_FINISHED", true)

         .findByCssSelector("#COMPACT_MODE_LIST tr:first-child")
            .getVisibleText()
            .then(function(visibleText) {
               assert.equal(visibleText, "26");
            })
            .end()

         .findByCssSelector("#COMPACT_MODE_LIST tr:last-child")
            .getVisibleText()
            .then(function(visibleText) {
               assert.equal(visibleText, "50");
            });
      },

      "Alternate page marker label": function() {
         return this.remote.findById("HIDDEN_PAGE_SELECTOR_PAGINATOR_PAGE_MARKER_text")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "2 of 10");
            });
      },

      "Page selector hidden by config": function() {
         return this.remote.findAllByCssSelector("#HIDDEN_PAGE_SELECTOR_PAGINATOR_PAGE_SELECTOR_text")
            .then(function(elements) {
               assert.lengthOf(elements, 0);
            });
      }
   });

   // See AKU-330...
   defineSuite(module, {
      name: "Scroll to item test",
      testPage: "/Paginator#currentPage=1&currentPageSize=20&currentItem=18",

      "Check scrollTop": function() {
         // Interestingly Firefox registers the scrollTop on html and Chrome on body... so we need to check both!
         function getScrollTops() {
            /* global document */
            var html = document.querySelector("html");
            var body = document.querySelector("body");
            return {
               html: html.scrollTop,
               body: body.scrollTop
            };
         }
         return this.remote.execute(getScrollTops)
            .then(function(scrollTops) {
               assert((scrollTops.html !== 0 || scrollTops.body !== 0), "Page did not scroll, html scrollTop=" + scrollTops.html + ", body scrollTop=" + scrollTops.body);
            });
      }
   });
});