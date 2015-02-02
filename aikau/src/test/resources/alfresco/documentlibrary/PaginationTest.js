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
        "intern/chai!expect",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon"], 
        function (registerSuite, expect, assert, require, TestCommon) {

   var browser;
   registerSuite({
      name: "Pagination Test",
      "Test page selector drop-down label intialization": function () {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/Paginator", "Pagination Tests").findByCssSelector(TestCommon.topicSelector("ALF_WIDGETS_READY", "publish", "any"))
            .end()
         .findByCssSelector("#PAGINATOR_PAGE_SELECTOR_text")
            .getVisibleText()
            .then(function(text) {
               assert(text === "1-25 of 243", "Page selector menu label didn't initialize correctly, expected '1-25 of 243' but saw: " + text);
            })
         .end();
      },
      "Test prevous page button is disabled on page load": function() {
         return this.remote.findAllByCssSelector("#PAGINATOR_PAGE_BACK.dijitDisabled")
            .then(function(elements) {
               assert(elements.length === 1, "The previous page button should be disabled");
            })
         .end();
      },
      "Test next page button is enabled on page load": function() {
         return this.remote.findAllByCssSelector("#PAGINATOR_PAGE_FORWARD.dijitDisabled")
            .then(function(elements) {
               assert(elements.length === 0, "The next page button should be enabled");
            })
         .end();
      },
      "Test items loaded correctly (check first row of 25 items)": function() {
         return this.remote.findByCssSelector(".alfresco-lists-AlfList tr:nth-child(1) span.value")
            .getVisibleText()
            .then(function(text) {
               assert(text === "1", "First displayed row should be 1, saw: " + text);
            })
         .end();
      },
      "Test items loaded correctly (check last row of 25 items)": function() {
         return this.remote.findByCssSelector(".alfresco-lists-AlfList tr:nth-child(25) span.value")
            .getVisibleText()
            .then(function(text) {
               assert(text === "25", "First displayed row should be 25, saw: " + text);
            })
         .end();
      },
      "Test 50 items per page selection update page selector drop-down label": function () {
         // Wait for the data to load and the page to draw - this is currently slow and the rendering needs to be
         // Switch to 50 results per page...
         return this.remote.findByCssSelector("#PAGINATOR_RESULTS_PER_PAGE_SELECTOR_text")
            .click()
            .sleep(100)
         .end()
         .findByCssSelector("#PAGINATOR_RESULTS_PER_PAGE_SELECTOR_dropdown tr:nth-child(2) td:nth-child(3)")
            .click()
         .end()
         // sped up - hopefully at some point in the future we can remove this sleep!         
         .sleep(1000)
         .findByCssSelector("#PAGINATOR_PAGE_SELECTOR_text")
            .getVisibleText()
            .then(function(text) {
               assert(text === "1-50 of 243", "Page selector label not updated correctly after switching to 50 items per page: " + text);
            })
         .end();
      },
      "Test previous page button is still disabled (after increasing page size)": function() {
         this.remote.findAllByCssSelector("#PAGINATOR_PAGE_BACK.dijitDisabled")
            .then(function(elements) {
               assert(elements.length === 1, "The previous page button should still be disabled");
            })
         .end();
      },
      "Test next page button is still enabled (after increasing page size)": function() {
         this.remote.findAllByCssSelector("#PAGINATOR_PAGE_FORWARD.dijitDisabled")
            .then(function(elements) {
               assert(elements.length === 0, "The next page button should still be enabled");
            })
         .end();
      },
      "Test clicking next page updates page selector drop-down label": function () {
         return this.remote.findByCssSelector("#PAGINATOR_PAGE_FORWARD_text")
            .click()
            .sleep(1000)
         .end()
         .findByCssSelector("#PAGINATOR_PAGE_SELECTOR_text")
            .getVisibleText()
            .then(function(text) {
               assert(text === "51-100 of 243", "Page selector label not correct, expected '51-100 of 243' but saw: " + text);
            })
         .end();
      },
      "Test clicking next page enables previous page button": function () {
         return this.remote.findAllByCssSelector("#PAGINATOR_PAGE_BACK.dijitDisabled")
            .then(function(elements) {
               assert(elements.length === 0, "The previous page button should now be enabled");
            })
         .end();
      },
      "Test next page button is still enabled (after using next page button)": function() {
         return this.remote.findAllByCssSelector("#PAGINATOR_PAGE_FORWARD.dijitDisabled")
            .then(function(elements) {
               assert(elements.length === 0, "The next page button should still be enabled");
            })
         .end();
      },
      "Test previous page button updates page selector drop-down label": function() {
         return this.remote.findByCssSelector("#PAGINATOR_PAGE_BACK_text")
            .click()
            .sleep(1000)
         .end()
         .findByCssSelector("#PAGINATOR_PAGE_SELECTOR_text")
            .getVisibleText()
            .then(function(text) {
               assert(text === "1-50 of 243", "Page selector label not correct, expected '1-50 of 243' but saw: " + text);
            })
         .end();
      },
      "Test previous page button is disabled (after previous page action)": function() {
         return this.remote.findAllByCssSelector("#PAGINATOR_PAGE_BACK.dijitDisabled")
            .then(function(elements) {
               assert(elements.length === 1, "The previous page button should now be disabled");
            })
         .end();
      },
      "Test page selection updates page selector label correctly": function () {
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
            })
         .end();
      },
      "Test next page button (to last page) disables next page button": function() {
         return this.remote.findByCssSelector("#PAGINATOR_PAGE_FORWARD_text")
            .click()
            .sleep(1000)
         .end()
         .findAllByCssSelector("#PAGINATOR_PAGE_FORWARD.dijitDisabled")
            .then(function(elements) {
               assert(elements.length === 1, "The next page button should be disabled when next paging to the last page");
            })
         .end();
      },
      "Test increasing page size adjusts current page (50 to 100 on last page)": function() {
         // This tests that when we increase the page size on the last page, we don't attempt to load 
         // a page of data that won't exist... instead, we should load a smaller page number to 
         // accommodate the larger page size.
         // Select 100 items per page and the page number should go from 5 to 3...
         return this.remote.findByCssSelector("#PAGINATOR_RESULTS_PER_PAGE_SELECTOR_text")
            .click()
            .sleep(100)
         .end()
         .findByCssSelector("#PAGINATOR_RESULTS_PER_PAGE_SELECTOR_dropdown tr:nth-child(4) td:nth-child(3)")
            .click()
         .end()
         .sleep(1000)
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
            })
         .end();
      },
      "Test items loaded correctly for incomplete page(check first row of 100 items": function() {
         return this.remote.findByCssSelector(".alfresco-lists-AlfList tr:nth-child(1) span.value")
            .getVisibleText()
            .then(function(text) {
               assert(text === "201", "First displayed row should be 201, saw: " + text);
            })
         .end();
      },
      "Test items loaded correctly (check last row of 100 items": function() {
         return this.remote.findByCssSelector(".alfresco-lists-AlfList tr:nth-child(43) span.value")
            .getVisibleText()
            .then(function(text) {
               assert(text === "243", "First displayed row should be 243, saw: " + text);
            })
         .end();
      },
      "Test reducing page size adjusts current page (100 to 25 on last page)": function() {
         // This tests that when we reduce the page size on the last page jump to an 
         // appropriate page for the smaller page size. Although we're on the last page (201-243) for
         // 100 items per page, we want to jump to the penultimate page for 25 items per page (201-225)
         // as this is the most appropriate page for where we were.
         return this.remote.findByCssSelector("#PAGINATOR_RESULTS_PER_PAGE_SELECTOR_text")
            .click()
            .sleep(100)
         .end()
         .findByCssSelector("#PAGINATOR_RESULTS_PER_PAGE_SELECTOR_dropdown tr:nth-child(1) td:nth-child(3)")
            .click()
         .end()
         .sleep(1000)
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
            })
         .end();
      }


      // ,
      // "Test Results Per Page Group": function () {
      //    // Wait for the data to load and the page to draw - this is currently slow and the rendering needs to be
      //    var browser = this.remote;
      //    var testname = "Pagination Test";
         
      //    return browser.findByCssSelector("#MENU_BAR_POPUP_text")
      //       .click()
      //       .end()

      //    .findAllByCssSelector("#MENU_BAR_POPUP_dropdown tr:nth-child(2) td.alf-selected-icon")
      //       .then(function(elements) {
      //          TestCommon.log(testname, "Checking results group updated correctly");
      //          assert(elements.length === 1, "Test #6a - Results per page widget updated correctly");
      //       })
      //       .end()


      //    .alfPostCoverageResults(browser);
      // }
   });
});