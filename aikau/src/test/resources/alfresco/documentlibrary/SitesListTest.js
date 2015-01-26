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
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"], 
        function (registerSuite, expect, assert, require, TestCommon, keys) {

   registerSuite({
      name: 'AlfSitesList Test',
      'Test Initial State': function () {

         // The test page is configured to start on page 2, but there will only be enough results for 1 page
         // so we need to test that actually the first and not second page of data is loaded.
         var browser = this.remote;
         var testname = "AlfSitesListTest";
         return TestCommon.loadTestWebScript(this.remote, "/SitesList", testname)
            .findAllByCssSelector(".alfresco-documentlibrary-views-layouts-Row")
               .then(function(elements) {
                  assert(elements.length === 1, "Test #1a - Counting Result, expected: 1, found: " + elements.length);
               })
            .end();
      },
      'Test Page Size Chage':  function() {
         // MNT-12871 was raised to report that it was not possible to switch page size when on the second page
         // of data. This test has been added to ensure the fix is not regressed.
         var browser = this.remote;

         // Click on the page size selector...
         return browser.findByCssSelector("#SITES_LIST_PAGINATION_MENU_RESULTS_PER_PAGE_SELECTOR_text")
            .click()
         .end()

         // Select 100 results per page...
         .findByCssSelector("#SITES_LIST_PAGINATION_MENU_RESULTS_PER_PAGE_SELECTOR_dropdown .alf-dropdown-menu tr:nth-child(4)")
            .click()
         .end()

         // Check that there are now 2 results (note that the MockXhr service has been fixed so that a page size of 
         // 25 returns 1 result and a page size of 100 returns 2 results)...
         .findAllByCssSelector(".alfresco-documentlibrary-views-layouts-Row")
            .then(function(elements) {
               assert(elements.length === 2, "Test #2a - Counting Result, expected: 2, found: " + elements.length);
            })
         .end()

         .alfPostCoverageResults(browser);
      }
   });
});