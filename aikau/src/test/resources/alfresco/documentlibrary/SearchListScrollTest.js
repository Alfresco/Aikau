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
      name: 'SearchList Scroll Test',
      'Basic Test': function () {
         var browser = this.remote,
             testname = "Search List Scroll Test",

            countResults = function(expected) {
               TestCommon.log(testname, "Checking for " +  expected + " results...");
               browser.findAllByCssSelector(".alfresco-search-AlfSearchResult")
                  .then(function(elements) {
                     assert(elements.length === expected, "Counting Result, expected: " + expected + ", found: " + elements.length);
                  })
               .end();
            },
            scrollToBottom = function() {
               TestCommon.log(testname, "Scrolling to bottom...");
               browser.execute("return window.scrollTo(0,Math.max(document.documentElement.scrollHeight,document.body.scrollHeight,document.documentElement.clientHeight))")
                  .sleep(2000)
               .end();
            },
            scrollToTop = function() {
               TestCommon.log(testname, "Scrolling to top...");
               browser.execute("return window.scrollTo(0,0)")
                  .sleep(2000)
               .end();
            };

         return TestCommon.loadTestWebScript(this.remote, "/SearchListScroll", testname)

            // Check for the search request being made...
            .findByCssSelector(TestCommon.topicSelector("ALF_SEARCH_REQUEST", "publish", "any"))
               .then(null, function() {
                  TestCommon.log(testname, "Looking for search request...");
                  assert(false, "Test #1a - Search request not made");
               })
            .end()

            // Check for the search results being returned...
            .findByCssSelector(TestCommon.topicSelector("ALF_SEARCH_RESULTS_COUNT", "publish", "any"))
               .then(null, function() {
                  TestCommon.log(testname, "Looking for first search response...");
                  assert(false, "Test #1b - Search results not returned");
               })
            .end()

            // Count number of results - there should be 25 (Request 1)
            .then(function(){
               countResults(25);
            })

            .sleep(1000)

            // Trigger Infinite Scroll.
            .then(function(){
               scrollToBottom();
               scrollToTop();
               scrollToBottom();
            })

            // Count Results. there should be 50. (Request 2)
            .then(function(){
               countResults(50);
            })

            // Scroll Again.
            .then(function(){
               scrollToBottom();
            })

            // Count Results there should be 75 (Request 3)
            .then(function(){
               countResults(75);
            })

            .alfPostCoverageResults(browser);
      }
   });
});