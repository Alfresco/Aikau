/**
 * Copyright (C) 2005-2014 Alfresco Software Limited.
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

   registerSuite({
      name: 'Pagination Test',
      'Check initial state': function () {

         // var browser = this.remote;
         var testname = "Pagination Test";
         return TestCommon.loadTestWebScript(this.remote, "/Paginator", testname)

         // Make sure the page has loaded...
         .findByCssSelector(TestCommon.topicSelector("ALF_WIDGETS_READY", "publish", "any"))
            .end()

         // Check that the hard-coded data renders the paginators initial state correctly...
         .findByCssSelector("#PAGINATOR_PAGE_SELECTOR_text")
            .getVisibleText()
            .then(function(text) {
               TestCommon.log(testname, "Checking initial drop-down state");
               assert(text === "1-3 of 3", "Test #1a - Hard coded data didn't yield correct page data: " + text);
            })
            .end()

         // Check that the previous and next controls are disabled...
         .findAllByCssSelector("#PAGINATOR_PAGE_BACK.dijitDisabled")
            .then(function(elements) {
               TestCommon.log(testname, "Checking previous button enablement");
               assert(elements.length === 1, "Test #1b - The previous page button should be disabled");
            })
            .end()
         .findAllByCssSelector("#PAGINATOR_PAGE_FORWARD.dijitDisabled")
            .then(function(elements) {
               TestCommon.log(testname, "Checking next button enablement");
               assert(elements.length === 1, "Test #1b - The next page button should be disabled");
            })
            .end();
      },
      'Test First Page': function () {
         // Wait for the data to load and the page to draw - this is currently slow and the rendering needs to be

         var browser = this.remote;
         var testname = "Pagination Test";
         
         // Switch to 50 results per page (will load data via Mock XHR request)...
         return browser.findByCssSelector("#PAGINATOR_RESULTS_PER_PAGE_SELECTOR_text")
            .click()
            .sleep(100)
            .end()

         .findByCssSelector("#PAGINATOR_RESULTS_PER_PAGE_SELECTOR_dropdown tr:nth-child(2) td:nth-child(3)")
            .click()
            .end()

         // sped up - hopefully at some point in the future we can remove this sleep!         
         .sleep(2000)

         .findByCssSelector("#PAGINATOR_PAGE_SELECTOR_text")
            .getVisibleText()
            .then(function(text) {
               TestCommon.log(testname, "Checking drop-down label after first page load");
               assert(text === "1-50 of 57", "Test #2a - First page not displayed correctly: " + text);
            })
            .end()

          // Check that the previous is still disabled but next is now enabled...
         .findAllByCssSelector("#PAGINATOR_PAGE_BACK.dijitDisabled")
            .then(function(elements) {
               TestCommon.log(testname, "Checking previous page button state (after first page load)");
               assert(elements.length === 1, "Test #2b - The previous page button should be disabled");
            })
            .end()
         .findAllByCssSelector("#PAGINATOR_PAGE_FORWARD.dijitDisabled")
            .then(function(elements) {
               TestCommon.log(testname, "Checking next page button state (after first page load)");
               assert(elements.length === 0, "Test #2c - The next page button should now be enabled");
            })
            .end();
      },
      'Test Next Page Button': function () {
         // Wait for the data to load and the page to draw - this is currently slow and the rendering needs to be
         var browser = this.remote;
         var testname = "Pagination Test";
         
         // Click the next button...
         return browser.findByCssSelector("#PAGINATOR_PAGE_FORWARD_text")
            .click()
            .sleep(1000)
            .end()

         .findByCssSelector("#PAGINATOR_PAGE_SELECTOR_text")
            .getVisibleText()
            .then(function(text) {
               TestCommon.log(testname, "Checking drop down label for second page");
               assert(text === "51-57 of 57", "Test #3a - Second page not displayed correctly: " + text);
            })
            .end()

          // Check that the previous is still disabled but next is now enabled...
         .findAllByCssSelector("#PAGINATOR_PAGE_BACK.dijitDisabled")
            .then(function(elements) {
               TestCommon.log(testname, "Checking previous page button state for second page");
               assert(elements.length === 0, "Test #3b - The previous page button should now be enabled");
            })
            .end()
         .findAllByCssSelector("#PAGINATOR_PAGE_FORWARD.dijitDisabled")
            .then(function(elements) {
               TestCommon.log(testname, "Checking next page button for second page");
               assert(elements.length === 1, "Test #3c - The next page button should now be disabled");
            })
            .end();
      },
      'Test Previous Page Button': function () {
         // Wait for the data to load and the page to draw - this is currently slow and the rendering needs to be
         var browser = this.remote;
         var testname = "Pagination Test";
         
         // Click the previous button...
         return browser.findByCssSelector("#PAGINATOR_PAGE_BACK_text")
            .click()
            .sleep(2000)
            .end()

         .findByCssSelector("#PAGINATOR_PAGE_SELECTOR_text")
            .getVisibleText()
            .then(function(text) {
               TestCommon.log(testname, "Checking drop-down label after using previous page button");
               assert(text === "1-50 of 57", "Test #4a - First page not displayed correctly: " + text);
            })
            .end()

          // Check that the previous is still disabled but next is now enabled...
         .findAllByCssSelector("#PAGINATOR_PAGE_BACK.dijitDisabled")
            .then(function(elements) {
               TestCommon.log(testname, "Checking previous button state after using previous page button");
               assert(elements.length === 1, "Test #4b - The previous page button should now be enabled");
            })
            .end()
         .findAllByCssSelector("#PAGINATOR_PAGE_FORWARD.dijitDisabled")
            .then(function(elements) {
               TestCommon.log(testname, "Checking next button state after using previous page button");
               assert(elements.length === 0, "Test #4c - The next page button should now be disabled");
            })
            .end();
      },
      'Test Page Selection': function () {
         // Wait for the data to load and the page to draw - this is currently slow and the rendering needs to be
         var browser = this.remote;
         var testname = "Pagination Test";
         
         // Select page 2 via the drop down...
         return browser.findByCssSelector("#PAGINATOR_PAGE_SELECTOR_text")
            .click()
            .end()

         .findByCssSelector("#PAGINATOR_PAGE_SELECTOR_dropdown tr:nth-child(2) td:nth-child(3)")
            .click()
            .end()

         .findByCssSelector("#PAGINATOR_PAGE_FORWARD_text")
            .click()
            .sleep(1000)
            .end()

         .findByCssSelector("#PAGINATOR_PAGE_SELECTOR_text")
            .getVisibleText()
            .then(function(text) {
               TestCommon.log(testname, "Checking drop down label after selecting page");
               assert(text === "51-57 of 57", "Test #5a - Second page not displayed correctly: " + text);
            })
            .end()

          // Check that the previous is still disabled but next is now enabled...
         .findAllByCssSelector("#PAGINATOR_PAGE_BACK.dijitDisabled")
            .then(function(elements) {
               TestCommon.log(testname, "Checking previous button state after selecting page");
               assert(elements.length === 0, "Test #5b - The previous page button should now be enabled");
            })
            .end()
         .findAllByCssSelector("#PAGINATOR_PAGE_FORWARD.dijitDisabled")
            .then(function(elements) {
               TestCommon.log(testname, "Checking next button state after selecting page");
               assert(elements.length === 1, "Test #5c - The next page button should now be disabled");
            })
            .end();
      },
      'Test Results Per Page Group': function () {
         // Wait for the data to load and the page to draw - this is currently slow and the rendering needs to be
         var browser = this.remote;
         var testname = "Pagination Test";
         
         return browser.findByCssSelector("#MENU_BAR_POPUP_text")
            .click()
            .end()

         .findAllByCssSelector("#MENU_BAR_POPUP_dropdown tr:nth-child(2) td.alf-selected-icon")
            .then(function(elements) {
               TestCommon.log(testname, "Checking results group updated correctly");
               assert(elements.length === 1, "Test #6a - Results per page widget updated correctly");
            })
            .end()


         .alfPostCoverageResults(browser);
      }
   });
});