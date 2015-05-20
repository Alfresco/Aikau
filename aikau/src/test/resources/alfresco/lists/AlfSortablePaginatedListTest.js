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
        "alfresco/TestCommon"], 
        function (registerSuite, assert, require, TestCommon) {

   var browser;
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
         return browser.findByCssSelector(".alfresco-lists-AlfList tr:nth-child(1) .alfresco-renderers-Property .value")
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
         return browser.findAllByCssSelector(".alfresco-lists-views-layouts-Row")
            .then(function(elements) {
               assert.lengthOf(elements, 20, "There should only be twenty rows");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });
});