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

   var countResults = function(expected) {
      browser.findAllByCssSelector(".alfresco-search-AlfSearchResult")
         .then(function(elements) {
            assert(elements.length === expected, "Counting Result, expected: " + expected + ", found: " + elements.length);
         })
      .end();
   };
   var scrollToBottom = function() {
      browser.execute("return window.scrollTo(0,Math.max(document.documentElement.scrollHeight,document.body.scrollHeight,document.documentElement.clientHeight))")
         .sleep(2000)
      .end();
   };
   var scrollToTop = function() {
      browser.execute("return window.scrollTo(0,0)")
         .sleep(2000)
      .end();
   };

   var browser;
   registerSuite({
      name: "SearchList Scroll Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/SearchListScroll", "SearchList Scroll Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      // teardown: function() {
      //    browser.end();
      // },
      
     "Check for the search request being made": function () {
         return browser.findByCssSelector(TestCommon.topicSelector("ALF_SEARCH_REQUEST", "publish", "any"))
            .then(null, function() {
               assert(false, "Search request not made");
            });
      },

      "Looking for first search response": function() {
         // Check for the search results being returned...
         return browser.findByCssSelector(TestCommon.topicSelector("ALF_SEARCH_RESULTS_COUNT", "publish", "any"))
            .then(null, function() {
               assert(false, "Test #1b - Search results not returned");
            })
            .then(function(){
               countResults(25);
            });
      },

      "Trigger Infinite Scroll": function() {
         return browser.sleep(1000)
            // Trigger Infinite Scroll.
            .then(function(){
               scrollToBottom();
               scrollToTop();
               scrollToBottom();
            })

            // Count Results. there should be 50. (Request 2)
            .then(function(){
               countResults(50);
            });
      },

      "Scroll Again": function() {
         // Scroll Again.
         return browser.then(function(){
            scrollToBottom();
         })

         // Count Results there should be 75 (Request 3)
         .then(function(){
            countResults(75);
         });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });
});